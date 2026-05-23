"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cartStore";

/**
 * Wipe the cart once the customer reaches a successful order page.
 * Safe because we only mount this on /order/[id] after payment is confirmed.
 */
export function ClearCartOnMount() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
