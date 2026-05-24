"use client";

/**
 * Fire a GA4 event. Safe to call from anywhere — no-ops if gtag
 * isn't loaded (which happens in dev + when an ad-blocker is active).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type CartLine = {
  menuItemId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  modifiers: { id: string; name: string; priceCents: number }[];
};

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag(...args);
}

function itemPrice(line: { unitPriceCents: number; modifiers: { priceCents: number }[] }): number {
  const mods = line.modifiers.reduce((s, m) => s + m.priceCents, 0);
  return (line.unitPriceCents + mods) / 100;
}

function toGA4Items(lines: CartLine[]) {
  return lines.map((l) => ({
    item_id: l.menuItemId,
    item_name: l.name,
    price: itemPrice(l),
    quantity: l.quantity,
  }));
}

export function trackViewItem(args: {
  id: string;
  name: string;
  category: string;
  priceCents: number;
}) {
  gtag("event", "view_item", {
    currency: "USD",
    value: args.priceCents / 100,
    items: [{
      item_id: args.id,
      item_name: args.name,
      item_category: args.category,
      price: args.priceCents / 100,
      quantity: 1,
    }],
  });
}

export function trackAddToCart(line: CartLine) {
  gtag("event", "add_to_cart", {
    currency: "USD",
    value: itemPrice(line) * line.quantity,
    items: toGA4Items([line]),
  });
}

export function trackBeginCheckout(args: { lines: CartLine[]; valueCents: number }) {
  gtag("event", "begin_checkout", {
    currency: "USD",
    value: args.valueCents / 100,
    items: toGA4Items(args.lines),
  });
}

export function trackPurchase(args: {
  orderId: string;
  totalCents: number;
  taxCents: number;
  tipCents: number;
  items: CartLine[];
}) {
  gtag("event", "purchase", {
    transaction_id: args.orderId,
    currency: "USD",
    value: args.totalCents / 100,
    tax: args.taxCents / 100,
    shipping: args.tipCents / 100,
    items: toGA4Items(args.items),
  });
}
