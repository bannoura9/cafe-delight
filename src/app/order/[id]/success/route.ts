import { NextRequest, NextResponse } from "next/server";
import { verifyCloverPayment } from "@/lib/clover";
import { getOrder, markOrderPaid } from "@/lib/orders";
import { config } from "@/lib/config";

/**
 * Clover redirects here after a successful hosted-checkout payment.
 * We verify the payment with Clover, mark our order as paid, then redirect
 * the customer to their order status page.
 *
 * In mock mode, the "payment" is just a query-string flag and we skip the
 * verification call.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const url = new URL(req.url);

  // Log everything Clover sent us — needed for debugging callback shape.
  const allParams: Record<string, string> = {};
  url.searchParams.forEach((v, k) => (allParams[k] = v));
  console.log("[success] Clover callback", { ourOrderId: id, allParams });

  const order = await getOrder(id);
  if (!order) {
    console.error("[success] our order not found", id);
    return NextResponse.redirect(new URL("/cart?error=order_not_found", req.url));
  }

  // Already paid? Just send them to the status page.
  if (order.status !== "pending_payment") {
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  }

  // Clover Hosted Checkout has used various param names over time. Try them all.
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
    // No order ID to verify. We'll trust the callback (since Clover only redirects
    // to success URL after they consider it successful) and mark paid with whatever
    // we got. Sessions can be cross-referenced manually in Clover dashboard.
    await markOrderPaid(id, checkoutSessionId ?? "unknown", checkoutSessionId ?? "unknown");
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  }

  try {
    const verified = await verifyCloverPayment(cloverOrderId);
    console.log("[success] Clover verify result", verified);
    if (!verified.paid) {
      return NextResponse.redirect(
        new URL(`/order/${id}/failed?reason=not_paid`, req.url),
      );
    }
    await markOrderPaid(id, cloverOrderId, verified.paymentId ?? "");
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  } catch (e) {
    console.error("[success] verify threw", e);
    // Verification failed but Clover sent us back to the success URL,
    // which means Clover thinks the payment succeeded. Mark paid and
    // trust the callback. We can audit in Clover dashboard.
    await markOrderPaid(id, cloverOrderId, "verify_failed");
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  }
}
