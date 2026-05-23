"use server";

import { auth } from "@clerk/nextjs/server";
import { config } from "@/lib/config";
import { getOrder, setOrderStatus, markNotified } from "@/lib/orders";
import { sendSms } from "@/lib/sms";

export async function markReady(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Unauthorized" };

  const order = await getOrder(id);
  if (!order) return { ok: false, error: "Order not found" };

  await setOrderStatus(id, "ready");
  const sms = await sendSms(
    order.customerPhone,
    `${config.businessName}: Your order #${order.id} is ready for pickup at ${config.businessAddress}.`,
  );
  if (sms.status === "failed") {
    return { ok: false, error: `SMS failed: ${sms.error ?? "unknown"}` };
  }
  await markNotified(id);
  return { ok: true };
}
