"use server";

import { redirect } from "next/navigation";
import { chargeAndCreateOrder } from "@/lib/clover";
import { createOrder, type OrderItem } from "@/lib/orders";
import { isOpenNow } from "@/lib/hours";

const TAX_RATE = 0.0775;

type SubmittedLine = {
  menuItemId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  modifiers: { id: string; name: string; priceCents: number }[];
};

export type CheckoutState = {
  error?: string;
};

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  if (!isOpenNow()) {
    return { error: "We're closed right now. Come back during open hours." };
  }

  const customerName = String(formData.get("name") ?? "").trim();
  const customerPhone = String(formData.get("phone") ?? "").trim();
  const cardToken = String(formData.get("cardToken") ?? "tok_visa").trim();
  const tipPct = Number(formData.get("tipPct") ?? 0);
  const linesRaw = String(formData.get("lines") ?? "[]");

  if (!customerName) return { error: "Please enter your name." };
  if (!/^\+?\d[\d\s\-().]{8,}$/.test(customerPhone)) {
    return { error: "Please enter a valid mobile number." };
  }

  let parsed: SubmittedLine[];
  try {
    parsed = JSON.parse(linesRaw);
  } catch {
    return { error: "Cart could not be read. Refresh and try again." };
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { error: "Your cart is empty." };
  }

  const items: OrderItem[] = parsed.map((l) => {
    const modsTotal = l.modifiers.reduce((s, m) => s + m.priceCents, 0);
    return {
      menuItemId: l.menuItemId,
      name: l.name,
      unitPriceCents: l.unitPriceCents,
      quantity: l.quantity,
      modifiers: l.modifiers,
      lineTotalCents: l.quantity * (l.unitPriceCents + modsTotal),
    };
  });

  const subtotalCents = items.reduce((s, i) => s + i.lineTotalCents, 0);
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const tipCents = Math.round(subtotalCents * (tipPct / 100));
  const totalCents = subtotalCents + taxCents + tipCents;

  let cloverResult;
  try {
    cloverResult = await chargeAndCreateOrder({
      amountCents: totalCents,
      cardToken,
      customerName,
      customerPhone,
      items,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Payment failed." };
  }

  const order = await createOrder({
    cloverOrderId: cloverResult.cloverOrderId,
    customerName,
    customerPhone,
    items,
    subtotalCents,
    taxCents,
    tipCents,
    totalCents,
  });

  redirect(`/order/${order.id}`);
}
