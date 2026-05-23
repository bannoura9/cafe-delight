"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHostedCheckout } from "@/lib/clover";
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

async function siteOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  console.log("[checkout] placeOrder invoked", {
    mockMode: process.env.MOCK_MODE,
    hasCloverToken: !!process.env.CLOVER_API_TOKEN,
    cloverEnv: process.env.CLOVER_ENVIRONMENT,
    merchantId: process.env.CLOVER_MERCHANT_ID,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!isOpenNow()) {
    console.log("[checkout] closed, rejecting");
    return { error: "We're closed right now. Come back during open hours." };
  }

  const customerName = String(formData.get("name") ?? "").trim();
  const customerPhone = String(formData.get("phone") ?? "").trim();
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

  // Create our internal order first so we have an ID to put in the redirect URL.
  console.log("[checkout] creating order in DB");
  let order;
  try {
    order = await createOrder({
      cloverOrderId: null,
      customerName,
      customerPhone,
      items,
      subtotalCents,
      taxCents,
      tipCents,
      totalCents,
    });
    console.log("[checkout] order created", { id: order.id, totalCents });
  } catch (e) {
    console.error("[checkout] createOrder FAILED", e);
    return { error: e instanceof Error ? `DB: ${e.message}` : "DB error" };
  }

  // Hand off to Clover hosted checkout.
  const origin = await siteOrigin();
  console.log("[checkout] calling Clover hosted checkout", { origin, ourOrderId: order.id });
  let checkout;
  try {
    checkout = await createHostedCheckout({
      ourOrderId: order.id,
      items,
      taxCents,
      tipCents,
      customerName,
      customerPhone,
      successUrl: `${origin}/order/${order.id}/success`,
      cancelUrl: `${origin}/cart`,
    });
    console.log("[checkout] Clover returned", { href: checkout.href, sessionId: checkout.checkoutSessionId });
  } catch (e) {
    console.error("[checkout] createHostedCheckout FAILED", e);
    return {
      error: e instanceof Error ? e.message : "Payment setup failed.",
    };
  }

  console.log("[checkout] redirecting to Clover");
  redirect(checkout.href);
}
