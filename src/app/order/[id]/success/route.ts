import { NextRequest, NextResponse } from "next/server";
import {
  verifyCloverPayment,
  annotateCloverOrder,
  printCloverOrder,
  getOrderIdFromCheckoutSession,
  findRecentPaidOrder,
} from "@/lib/clover";
import { getOrder, markOrderPaid } from "@/lib/orders";
import { config } from "@/lib/config";

/**
 * Clover redirects here after a successful hosted-checkout payment.
 * We verify the payment with Clover, mark our order as paid, then redirect
 * the customer to their order status page.
 *
 * Clover sometimes redirects back with no query params at all. In that case
 * we fall back to looking up the Clover order via the checkout session ID
 * we stashed on the order when we created the checkout.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const url = new URL(req.url);

  const allParams: Record<string, string> = {};
  url.searchParams.forEach((v, k) => (allParams[k] = v));

  const order = await getOrder(id);
  if (!order) {
    return NextResponse.redirect(new URL("/cart?error=order_not_found", req.url));
  }

  if (order.status !== "pending_payment") {
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  }

  let cloverOrderId =
    url.searchParams.get("orderId") ??
    url.searchParams.get("cloverOrderId") ??
    url.searchParams.get("order_id") ??
    url.searchParams.get("merchantOrderId") ??
    url.searchParams.get("id");

  const checkoutSessionId =
    url.searchParams.get("checkoutSessionId") ??
    url.searchParams.get("sessionId") ??
    url.searchParams.get("session_id");

  if (config.mockMode) {
    const fakeId = cloverOrderId ?? `mock_${Date.now()}`;
    await markOrderPaid(id, fakeId, `mock_pmt_${Date.now()}`);
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  }

  // Fallback: Clover redirected with no order ID. Use the session we stashed.
  if (!cloverOrderId) {
    const stashed = order.cloverOrderId;
    const sessId =
      checkoutSessionId ??
      (stashed && stashed.startsWith("session:")
        ? stashed.slice("session:".length)
        : null);

    if (sessId) {
      const lookedUp = await getOrderIdFromCheckoutSession(sessId).catch(
        (e) => {
          console.error("[success] session lookup threw", e);
          return null;
        },
      );
      if (lookedUp) {
        cloverOrderId = lookedUp;
        console.error("[success] recovered cloverOrderId via session", {
          sessId,
          cloverOrderId,
        });
      }
    }
  }

  // Last-resort fallback: search recent merchant orders by exact total.
  // The session endpoint 404s once the session is consumed; this is the
  // reliable path for low-volume merchants.
  if (!cloverOrderId) {
    const byAmount = await findRecentPaidOrder(order.totalCents).catch(
      (e) => {
        console.error("[success] findRecentPaidOrder threw", e);
        return null;
      },
    );
    console.error("[success] amount search result", { byAmount, totalCents: order.totalCents });
    if (byAmount) {
      cloverOrderId = byAmount;
      console.error("[success] recovered cloverOrderId via amount search", {
        cloverOrderId,
        totalCents: order.totalCents,
      });
    }
  }

  if (!cloverOrderId) {
    console.error("[success] no cloverOrderId — all lookups failed", {
      allParams,
      stashed: order.cloverOrderId,
      totalCents: order.totalCents,
    });
    // Never mark paid without a verifiable Clover order. The order stays
    // pending_payment; staff can confirm the charge in Clover and mark it
    // received from /admin.
    return NextResponse.redirect(
      new URL(`/order/${id}/failed?reason=unconfirmed`, req.url),
    );
  }

  try {
    const verified = await verifyCloverPayment(cloverOrderId);
    if (!verified.paid) {
      return NextResponse.redirect(
        new URL(`/order/${id}/failed?reason=not_paid`, req.url),
      );
    }
    await markOrderPaid(id, cloverOrderId, verified.paymentId ?? "");

    await annotateCloverOrder(cloverOrderId, order.customerName, id, order.notes).catch(
      (e) => console.error("[success] annotate failed", e),
    );
    printCloverOrder(cloverOrderId).catch((e) =>
      console.error("[success] print_event failed", e),
    );

    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  } catch (e) {
    console.error("[success] verify threw", e);
    return NextResponse.redirect(
      new URL(`/order/${id}/failed?reason=unconfirmed`, req.url),
    );
  }
}
