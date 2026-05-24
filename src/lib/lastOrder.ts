"use client";

/**
 * Persist a customer's last order in localStorage so we can offer
 * a one-tap "Order again" on the home page next visit.
 * No account required, no server data — purely client-side.
 */

const KEY = "cd-last-order-v1";

export type LastOrderLine = {
  menuItemId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  modifiers: { id: string; name: string; priceCents: number }[];
};

export type LastOrder = {
  paidAt: number;
  lines: LastOrderLine[];
};

export function saveLastOrder(lines: LastOrderLine[]): void {
  try {
    const data: LastOrder = { paidAt: Date.now(), lines };
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function loadLastOrder(): LastOrder | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as LastOrder;
    if (!Array.isArray(data.lines) || data.lines.length === 0) return null;
    // Expire after 60 days
    if (Date.now() - data.paidAt > 60 * 24 * 3600 * 1000) return null;
    return data;
  } catch {
    return null;
  }
}
