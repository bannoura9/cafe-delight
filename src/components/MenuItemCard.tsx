"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MenuItem, Modifier, Size } from "@/lib/menu";
import { formatMoney, CATEGORY_EMOJI } from "@/lib/menu";
import { useCart } from "@/lib/cartStore";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const add = useCart((s) => s.add);
  const [size, setSize] = useState<Size>(item.sizes[0]);
  const [showMods, setShowMods] = useState(false);
  const [selected, setSelected] = useState<Modifier[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  const hasSizes = item.sizes.length > 1;
  const hasModifiers = (item.modifiers?.length ?? 0) > 0;

  const toggle = (mod: Modifier) =>
    setSelected((s) =>
      s.find((m) => m.id === mod.id)
        ? s.filter((m) => m.id !== mod.id)
        : [...s, mod],
    );

  const modsTotal = selected.reduce((s, m) => s + m.priceCents, 0);
  const currentPrice = size.priceCents + modsTotal;

  const handleAdd = () => {
    const displayName = hasSizes ? `${item.name} (${size.label})` : item.name;
    add({
      menuItemId: item.id,
      name: displayName,
      unitPriceCents: size.priceCents,
      quantity: 1,
      modifiers: selected,
    });
    setSelected([]);
    setShowMods(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group rounded-2xl bg-cream-2/40 border border-espresso/5 overflow-hidden hover:shadow-sm transition flex flex-col">
      {item.image ? (
        <div className="relative aspect-[4/3] bg-cream-2">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-crema/25 to-espresso/15 flex items-center justify-center text-6xl">
          <span aria-hidden>{CATEGORY_EMOJI[item.category]}</span>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-semibold text-espresso leading-tight">
              <Link href={`/menu/${item.id}`} className="hover:text-crema-2">
                {item.name}
              </Link>
            </h3>
            <span className="text-espresso/80 tabular-nums whitespace-nowrap">
              {formatMoney(currentPrice)}
            </span>
          </div>
          {item.description ? (
            <p className="text-sm text-espresso/70 mt-1">{item.description}</p>
          ) : null}
        </div>

        {hasSizes ? (
          <div className="flex gap-1.5 flex-wrap">
            {item.sizes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSize(s)}
                className={`text-xs rounded-full px-3 py-1 border tabular-nums ${
                  size.id === s.id
                    ? "bg-espresso text-cream border-espresso"
                    : "border-espresso/20 hover:bg-cream"
                }`}
              >
                {s.label} · {formatMoney(s.priceCents)}
              </button>
            ))}
          </div>
        ) : null}

        {showMods && hasModifiers ? (
          <ModifierGroup
            modifiers={item.modifiers!}
            selected={selected}
            onToggle={toggle}
          />
        ) : null}

        <div className="mt-auto flex gap-2">
          {hasModifiers && !showMods ? (
            <button
              onClick={() => setShowMods(true)}
              className="text-sm rounded-full border border-espresso/20 px-3 py-1.5 hover:bg-cream"
            >
              + Add-ons
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

function ModifierGroup({
  modifiers,
  selected,
  onToggle,
}: {
  modifiers: Modifier[];
  selected: Modifier[];
  onToggle: (m: Modifier) => void;
}) {
  const milk = modifiers.filter((m) => m.id.startsWith("milk-"));
  const flavor = modifiers.filter((m) => m.id.startsWith("flav-"));
  const other = modifiers.filter(
    (m) => !m.id.startsWith("milk-") && !m.id.startsWith("flav-"),
  );

  return (
    <div className="space-y-3 text-sm">
      {milk.length > 0 ? (
        <Group title="Milk (+$0.50)" mods={milk} selected={selected} onToggle={onToggle} />
      ) : null}
      {flavor.length > 0 ? (
        <Group
          title="Flavor (+$0.50)"
          mods={flavor}
          selected={selected}
          onToggle={onToggle}
        />
      ) : null}
      {other.length > 0 ? (
        <Group title="Add-ons" mods={other} selected={selected} onToggle={onToggle} />
      ) : null}
    </div>
  );
}

function Group({
  title,
  mods,
  selected,
  onToggle,
}: {
  title: string;
  mods: Modifier[];
  selected: Modifier[];
  onToggle: (m: Modifier) => void;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-espresso/60 mb-1.5">
        {title}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {mods.map((m) => {
          const on = !!selected.find((s) => s.id === m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onToggle(m)}
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
  );
}
