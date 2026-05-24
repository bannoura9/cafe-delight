"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart, lineTotalCents } from "@/lib/cartStore";
import { formatMoney } from "@/lib/menu";
import { ClosedBanner } from "@/components/ClosedBanner";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lines = useCart((s) => s.lines);
  const remove = useCart((s) => s.remove);
  const setQuantity = useCart((s) => s.setQuantity);
  const subtotal = useCart((s) => s.subtotalCents());

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="display text-3xl text-espresso mb-3">Your cart is empty</h1>
        <p className="text-espresso/70 mb-6">Add something delicious to get started.</p>
        <Link
          href="/menu"
          className="inline-flex items-center rounded-full bg-espresso text-cream px-6 py-3 font-medium hover:bg-espresso-2"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <ClosedBanner />
      <h1 className="display text-3xl text-espresso mb-6">Your cart</h1>
      <ul className="divide-y divide-espresso/10 border border-espresso/10 rounded-2xl bg-cream-2/30">
        {lines.map((l) => (
          <li key={l.lineId} className="p-4 flex gap-4 items-start">
            <div className="flex-1">
              <div className="flex justify-between gap-3">
                <div className="font-medium text-espresso">{l.name}</div>
                <div className="tabular-nums">
                  {formatMoney(lineTotalCents(l))}
                </div>
              </div>
              {l.modifiers.length > 0 ? (
                <div className="text-sm text-espresso/75 mt-0.5">
                  {l.modifiers.map((m) => m.name).join(" · ")}
                </div>
              ) : null}
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => setQuantity(l.lineId, l.quantity - 1)}
                  className="w-11 h-11 rounded-full border border-espresso/30 hover:bg-cream text-lg leading-none flex items-center justify-center"
                  aria-label={`Decrease ${l.name} quantity`}
                >
                  −
                </button>
                <span className="w-8 text-center tabular-nums text-base font-medium">{l.quantity}</span>
                <button
                  onClick={() => setQuantity(l.lineId, l.quantity + 1)}
                  className="w-11 h-11 rounded-full border border-espresso/30 hover:bg-cream text-lg leading-none flex items-center justify-center"
                  aria-label={`Increase ${l.name} quantity`}
                >
                  +
                </button>
                <button
                  onClick={() => remove(l.lineId)}
                  className="ml-2 min-h-[44px] px-3 text-sm text-espresso/80 hover:text-crema-2 underline underline-offset-2"
                  aria-label={`Remove ${l.name}`}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-espresso/80">Tax & tip calculated at checkout</div>
        <div className="text-lg">
          Subtotal <span className="font-semibold tabular-nums">{formatMoney(subtotal)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/checkout"
          className="w-full rounded-full bg-espresso text-cream py-3.5 px-5 font-medium hover:bg-espresso-2 text-center min-h-[48px] flex items-center justify-center"
        >
          Checkout →
        </Link>
        <p className="text-center text-xs text-espresso/60">
          🍎  Apple Pay · Google Pay · Samsung Pay · all major cards accepted
        </p>
        <Link
          href="/menu"
          className="w-full rounded-full border border-espresso/20 py-3 px-5 hover:bg-cream-2 text-center min-h-[44px] flex items-center justify-center"
        >
          Keep browsing
        </Link>
      </div>
    </div>
  );
}
