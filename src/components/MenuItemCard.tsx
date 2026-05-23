"use client";

import { useState } from "react";
import Image from "next/image";
import type { MenuItem, Modifier } from "@/lib/menu";
import { formatMoney } from "@/lib/menu";
import { useCart } from "@/lib/cartStore";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const add = useCart((s) => s.add);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Modifier[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  const hasModifiers = (item.modifiers?.length ?? 0) > 0;

  const toggle = (mod: Modifier) => {
    setSelected((s) =>
      s.find((m) => m.id === mod.id)
        ? s.filter((m) => m.id !== mod.id)
        : [...s, mod],
    );
  };

  const handleAdd = () => {
    add({
      menuItemId: item.id,
      name: item.name,
      unitPriceCents: item.priceCents,
      quantity: 1,
      modifiers: selected,
    });
    setSelected([]);
    setOpen(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group rounded-2xl bg-cream-2/40 border border-espresso/5 overflow-hidden hover:shadow-sm transition flex flex-col">
      <div className="relative aspect-[4/3] bg-cream-2">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-semibold text-espresso">{item.name}</h3>
          <span className="text-espresso/80 tabular-nums">
            {formatMoney(item.priceCents)}
          </span>
        </div>
        <p className="text-sm text-espresso/70 mt-1 flex-1">{item.description}</p>

        {open && hasModifiers ? (
          <div className="mt-3 space-y-1.5">
            {item.modifiers!.map((mod) => {
              const checked = !!selected.find((m) => m.id === mod.id);
              return (
                <label
                  key={mod.id}
                  className="flex items-center justify-between text-sm cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(mod)}
                      className="accent-espresso"
                    />
                    {mod.name}
                  </span>
                  <span className="text-espresso/60">
                    {mod.priceCents > 0 ? `+${formatMoney(mod.priceCents)}` : ""}
                  </span>
                </label>
              );
            })}
          </div>
        ) : null}

        <div className="mt-3 flex gap-2">
          {hasModifiers && !open ? (
            <button
              onClick={() => setOpen(true)}
              className="text-sm rounded-full border border-espresso/20 px-3 py-1.5 hover:bg-cream"
            >
              Customize
            </button>
          ) : null}
          <button
            onClick={handleAdd}
            className="flex-1 text-sm rounded-full bg-espresso text-cream px-3 py-1.5 font-medium hover:bg-espresso-2 transition"
          >
            {justAdded ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
