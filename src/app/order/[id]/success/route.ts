import { NextRequest, NextResponse } from "next/server";
import { verifyCloverPayment } from "@/lib/clover";
import { getOrder, markOrderPaid, markEmailSent } from "@/lib/orders";
import { sendOrderReceipt } from "@/lib/email";
import { config } from "@/lib/config";

async function sendReceiptIfEmail(orderId: string): Promise<void> {
  const fresh = await getOrder(orderId);
  if (!fresh || !fresh.customerEmail) return;
  const res = await sendOrderReceipt(fresh);
  if (res.ok) {
    await markEmailSent(orderId);
  } else {
    console.error("[success] email receipt failed", res.error);
  }
}

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
    await sendReceiptIfEmail(id);
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  }

  if (!cloverOrderId) {
    console.error("[success] no cloverOrderId in callback", { allParams });
    await markOrderPaid(id, checkoutSessionId ?? "unknown", checkoutSessionId ?? "unknown");
    await sendReceiptIfEmail(id);
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
    await sendReceiptIfEmail(id);
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  } catch (e) {
    console.error("[success] verify threw", e);
    await markOrderPaid(id, cloverOrderId, "verify_failed");
    await sendReceiptIfEmail(id);
    return NextResponse.redirect(new URL(`/order/${id}`, req.url));
  }
}
