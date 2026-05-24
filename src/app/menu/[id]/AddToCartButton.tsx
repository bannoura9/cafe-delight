"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartStore";
import type { MenuItem, Modifier, Size } from "@/lib/menu";
import { formatMoney } from "@/lib/menu";
import { trackAddToCart } from "@/lib/track";

export function AddToCartButton({ item }: { item: MenuItem }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const [size, setSize] = useState<Size>(item.sizes[0]);
  const [selected, setSelected] = useState<Modifier[]>([]);
  const [busy, setBusy] = useState(false);

  const hasSizes = item.sizes.length > 1;
  const modsTotal = selected.reduce((s, m) => s + m.priceCents, 0);
  const price = size.priceCents + modsTotal;

  const toggle = (mod: Modifier) =>
    setSelected((s) =>
      s.find((m) => m.id === mod.id)
        ? s.filter((m) => m.id !== mod.id)
        : [...s, mod],
    );

  const handleAdd = (goToCart: boolean) => {
    setBusy(true);
    const displayName = hasSizes ? `${item.name} (${size.label})` : item.name;
    const line = {
      menuItemId: item.id,
      name: displayName,
      unitPriceCents: size.priceCents,
      quantity: 1,
      modifiers: selected,
    };
    add(line);
    trackAddToCart(line);
    if (goToCart) router.push("/cart");
    else {
      setTimeout(() => setBusy(false), 800);
      setSelected([]);
    }
  };

  return (
    <div className="space-y-3">
      {hasSizes ? (
        <div>
          <div className="text-sm font-medium text-espresso mb-2">Size</div>
          <div className="flex gap-2 flex-wrap">
            {item.sizes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSize(s)}
                className={`text-sm rounded-full px-3 py-1.5 border tabular-nums ${
                  size.id === s.id
                    ? "bg-espresso text-cream border-espresso"
                    : "border-espresso/20 hover:bg-cream"
                }`}
              >
                {s.label} · {formatMoney(s.priceCents)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {item.modifiers && item.modifiers.length > 0 ? (
        <div>
          <div className="text-sm font-medium text-espresso mb-2">Add-ons</div>
          <div className="flex gap-1.5 flex-wrap">
            {item.modifiers.map((m) => {
              const on = !!selected.find((s) => s.id === m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggle(m)}
                  className={`text-xs rounded-full px-2.5 py-1 border ${
                    on
                      ? "bg-crema-2 text-cream border-crema-2"
                      : "border-espresso/20 hover:bg-cream"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => handleAdd(false)}
          disabled={busy}
          className="flex-1 rounded-full border border-espresso/20 px-4 py-3 font-medium hover:bg-cream-2 disabled:opacity-60"
        >
          Add to cart · {formatMoney(price)}
        </button>
        <button
          onClick={() => handleAdd(true)}
          disabled={busy}
          className="flex-1 rounded-full bg-espresso text-cream px-4 py-3 font-medium hover:bg-espresso-2 disabled:opacity-60"
        >
          Add + checkout
        </button>
      </div>
    </div>
  );
}
