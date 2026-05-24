"use client";

import { useEffect } from "react";
import { trackPurchase, type CartLine } from "@/lib/track";

/**
 * Fires GA4 `purchase` once when the customer lands on a paid order
 * page. Uses sessionStorage to prevent double-firing on refresh.
 */
export function TrackPurchase({
  orderId,
  totalCents,
  taxCents,
  tipCents,
  items,
}: {
  orderId: string;
  totalCents: number;
  taxCents: number;
  tipCents: number;
  items: CartLine[];
}) {
  useEffect(() => {
    const key = `cd-tracked-purchase:${orderId}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
    trackPurchase({ orderId, totalCents, taxCents, tipCents, items });
  }, [orderId, totalCents, taxCents, tipCents, items]);
  return null;
}
