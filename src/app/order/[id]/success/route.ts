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

  const order = await getOrder(id);
  if (!order) {
    return NextResponse.redirect(new URL("/cart?error=order_not_found", req.url));
  }

  // Already paid? Just send them to the status page.
  if (order.status !== "pending_payment") {
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  }

  const url = new URL(req.url);
  const cloverOrderId =
    url.searchParams.get("orderId") ??
    url.searchParams.get("cloverOrderId") ??
    `mock_${Date.now()}`;

  if (config.mockMode) {
    await markOrderPaid(id, cloverOrderId, `mock_pmt_${Date.now()}`);
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
    const msg = encodeURIComponent(e instanceof Error ? e.message : "verify_failed");
    return NextResponse.redirect(
      new URL(`/order/${id}/failed?reason=${msg}`, req.url),
    );
  }
}
