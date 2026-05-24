"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cartStore";
import { loadLastOrder, type LastOrder } from "@/lib/lastOrder";
import { formatMoney } from "@/lib/menu";

export function OrderAgain() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const add = useCart((s) => s.add);
  const clearCart = useCart((s) => s.clear);

  useEffect(() => {
    setOrder(loadLastOrder());
  }, []);

  if (!order) return null;

  const summary = order.lines
    .map((l) => `${l.quantity}× ${l.name}`)
    .join(" · ");
  const subtotal = order.lines.reduce((sum, l) => {
    const modsTotal = l.modifiers.reduce((s, m) => s + m.priceCents, 0);
    return sum + l.quantity * (l.unitPriceCents + modsTotal);
  }, 0);

  const handleReorder = () => {
    clearCart();
    for (const line of order.lines) {
      add({
        menuItemId: line.menuItemId,
        name: line.name,
        unitPriceCents: line.unitPriceCents,
        quantity: line.quantity,
        modifiers: line.modifiers,
      });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 -mt-4 mb-10">
      <div className="rounded-2xl border border-crema/40 bg-crema/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-crema-2 font-medium">
            Your last order
          </div>
          <div className="font-medium text-espresso mt-1">{summary}</div>
          <div className="text-sm text-espresso/60 tabular-nums">
            {formatMoney(subtotal)} · placed{" "}
            {new Date(order.paidAt).toLocaleDateString()}
          </div>
        </div>
        <Link
          href="/cart"
          onClick={handleReorder}
          className="shrink-0 rounded-full bg-espresso text-cream px-5 py-3 font-medium hover:bg-espresso-2 text-center"
        >
          Order again →
        </Link>
      </div>
    </section>
  );
}
