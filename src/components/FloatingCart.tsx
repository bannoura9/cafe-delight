"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cartStore";
import { formatMoney } from "@/lib/menu";

// Routes where the floating cart should NOT show.
const HIDDEN_ROUTE_PREFIXES = ["/cart", "/checkout", "/order/", "/admin", "/sign-in", "/sign-up"];

export function FloatingCart() {
  const pathname = usePathname();
  const total = useCart((s) => s.totalQuantity());
  const subtotal = useCart((s) => s.subtotalCents());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || total === 0) return null;
  if (HIDDEN_ROUTE_PREFIXES.some((p) => pathname?.startsWith(p))) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-5 right-5 z-30 sm:hidden inline-flex items-center gap-3 rounded-full bg-espresso text-cream px-5 py-3 font-medium shadow-lg shadow-espresso/30 hover:bg-espresso-2 active:scale-95 transition"
    >
      <span aria-hidden className="text-lg">🛒</span>
      <span className="tabular-nums">
        {total} {total === 1 ? "item" : "items"} · {formatMoney(subtotal)}
      </span>
      <span aria-hidden>→</span>
    </Link>
  );
}
