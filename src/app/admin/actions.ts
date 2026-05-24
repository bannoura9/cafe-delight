"use server";

import { auth } from "@clerk/nextjs/server";
import { getOrder, setOrderStatus, markNotified } from "@/lib/orders";
import { sendOrderReadyEmail } from "@/lib/email";

export async function markReady(
  id: string,
): Promise<{ ok: boolean; error?: string; warning?: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Unauthorized" };

  const order = await getOrder(id);
  if (!order) return { ok: false, error: "Order not found" };

  await setOrderStatus(id, "ready");

  if (!order.customerEmail) {
    await markNotified(id);
    return { ok: true, warning: "Marked ready (no email on file to notify)" };
  }

  const result = await sendOrderReadyEmail(order);
  if (!result.ok) {
    return { ok: false, error: `Email failed: ${result.error}` };
  }
  await markNotified(id);
  return { ok: true };
}
