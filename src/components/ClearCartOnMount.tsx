"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cartStore";
import { saveLastOrder, type LastOrderLine } from "@/lib/lastOrder";

/**
 * Runs once the customer reaches a successful order page.
 * - Saves a snapshot of the order to localStorage so we can offer
 *   "Order again" on a future visit.
 * - Wipes the working cart so it's empty next time they browse.
 */
export function ClearCartOnMount({ lines }: { lines: LastOrderLine[] }) {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    if (lines.length > 0) saveLastOrder(lines);
    clear();
  }, [clear, lines]);
  return null;
}
