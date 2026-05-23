"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config";
import { getOrder, setOrderStatus, markNotified } from "@/lib/orders";
import { sendSms } from "@/lib/sms";

export async function markReady(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const c = await cookies();
  if (c.get("admin_auth")?.value !== config.adminPassword) {
    return { ok: false, error: "Unauthorized" };
  }
  const order = getOrder(id);
  if (!order) return { ok: false, error: "Order not found" };

  setOrderStatus(id, "ready");
  const sms = await sendSms(
    order.customerPhone,
    `${config.businessName}: Your order #${order.id} is ready for pickup at ${config.businessAddress}.`,
  );
  if (sms.status === "failed") {
    return { ok: false, error: `SMS failed: ${sms.error ?? "unknown"}` };
  }
  markNotified(id);
  return { ok: true };
}
