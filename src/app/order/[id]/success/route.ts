import { NextRequest, NextResponse } from "next/server";
import { verifyCloverPayment } from "@/lib/clover";
import { getOrder, markOrderPaid } from "@/lib/orders";
import { config } from "@/lib/config";

/**
 * Clover redirects here after a successful hosted-checkout payment.
 * We verify the payment with Clover, mark our order as paid, then redirect
 * the customer to their order status page.
 *
 * Note: the receipt email is sent automatically by Clover. We don't send
 * a duplicate receipt; we send a separate "your order is ready" email
 * from /admin when staff marks the order ready.
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

  const cloverOrderId =
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

  if (!cloverOrderId) {
    console.error("[success] no cloverOrderId in callback", { allParams });
    await markOrderPaid(id, checkoutSessionId ?? "unknown", checkoutSessionId ?? "unknown");
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  }

  try {
    const verified = await verifyCloverPayment(cloverOrderId);
    if (!verified.paid) {
      return NextResponse.redirect(
        new URL(`/order/${id}/failed?reason=not_paid`, req.url),
      );
    }
    await markOrderPaid(id, cloverOrderId, verified.paymentId ?? "");
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  } catch (e) {
    console.error("[success] verify threw", e);
    await markOrderPaid(id, cloverOrderId, "verify_failed");
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  }
}
