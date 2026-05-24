"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useCart } from "@/lib/cartStore";
import { MENU, formatMoney, type MenuItem } from "@/lib/menu";

// Items that pair well as an add-on with a drink order.
const UPSELL_POOL = ["gelato", "affogato", "soda-cream"];

export function Upsell() {
  const lines = useCart((s) => s.lines);
  const add = useCart((s) => s.add);

  const suggestions = useMemo(() => {
    const inCart = new Set(lines.map((l) => l.menuItemId));
    return MENU.filter(
      (m) => UPSELL_POOL.includes(m.id) && !inCart.has(m.id),
    ).slice(0, 3);
  }, [lines]);

  if (suggestions.length === 0) return null;

  const addItem = (item: MenuItem) => {
    const size = item.sizes[0];
    add({
      menuItemId: item.id,
      name: item.sizes.length > 1 ? `${item.name} (${size.label})` : item.name,
      unitPriceCents: size.priceCents,
      quantity: 1,
      modifiers: [],
    });
  };

  return (
    <div className="rounded-2xl border border-crema/30 bg-crema/5 p-4">
      <div className="text-xs uppercase tracking-wider text-crema-2 font-medium mb-3">
        Add a sweet treat?
      </div>
      <ul className="space-y-2">
        {suggestions.map((item) => {
          const price = item.sizes[0].priceCents;
          return (
            <li key={item.id} className="flex items-center gap-3">
              {item.image ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-cream-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-cream-2 shrink-0 flex items-center justify-center text-xl">
                  🍨
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-espresso truncate">
                  {item.name}
                </div>
                <div className="text-sm text-espresso/60 tabular-nums">
                  {formatMoney(price)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => addItem(item)}
                className="shrink-0 text-sm rounded-full bg-espresso text-cream px-4 py-2 font-medium hover:bg-espresso-2"
              >
                + Add
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
