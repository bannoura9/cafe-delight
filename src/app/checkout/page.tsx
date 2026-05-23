"use client";

import { useActionState, useEffect, useState } from "react";
import { useCart } from "@/lib/cartStore";
import { formatMoney } from "@/lib/menu";
import { placeOrder, type CheckoutState } from "./actions";

const TAX_RATE = 0.0775;
const TIP_OPTIONS = [0, 10, 15, 20];

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lines = useCart((s) => s.lines);
  const subtotal = useCart((s) => s.subtotalCents());
  const clear = useCart((s) => s.clear);

  const [tipPct, setTipPct] = useState<number>(15);
  const [cardToken, setCardToken] = useState("tok_visa");

  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(
    placeOrder,
    {},
  );

  useEffect(() => {
    // On hard navigation away after redirect, clear cart.
    return () => {
      if (state && !state.error) clear();
    };
  }, [state, clear]);

  if (!mounted) return null;

  const tax = Math.round(subtotal * TAX_RATE);
  const tip = Math.round(subtotal * (tipPct / 100));
  const total = subtotal + tax + tip;

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-espresso/70">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="display text-3xl text-espresso mb-6">Checkout</h1>

      <form action={formAction} className="space-y-6">
        <input
          type="hidden"
          name="lines"
          value={JSON.stringify(
            lines.map((l) => ({
              menuItemId: l.menuItemId,
              name: l.name,
              unitPriceCents: l.unitPriceCents,
              quantity: l.quantity,
              modifiers: l.modifiers,
            })),
          )}
        />
        <input type="hidden" name="tipPct" value={tipPct} />
        <input type="hidden" name="cardToken" value={cardToken} />

        <fieldset className="space-y-3">
          <legend className="font-semibold text-espresso">Your info</legend>
          <input
            name="name"
            placeholder="Name"
            required
            className="w-full rounded-xl border border-espresso/20 bg-cream px-4 py-3 focus:outline-none focus:ring-2 focus:ring-crema"
          />
          <input
            name="phone"
            placeholder="Mobile number (for SMS when ready)"
            required
            inputMode="tel"
            className="w-full rounded-xl border border-espresso/20 bg-cream px-4 py-3 focus:outline-none focus:ring-2 focus:ring-crema"
          />
        </fieldset>

        <fieldset>
          <legend className="font-semibold text-espresso mb-2">Tip</legend>
          <div className="flex gap-2">
            {TIP_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setTipPct(p)}
                className={`flex-1 rounded-full border px-3 py-2 text-sm ${
                  tipPct === p
                    ? "bg-espresso text-cream border-espresso"
                    : "border-espresso/20 hover:bg-cream-2"
                }`}
              >
                {p === 0 ? "No tip" : `${p}%`}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-semibold text-espresso">Payment</legend>
          <div className="rounded-xl border border-espresso/20 bg-cream-2/40 p-4 text-sm text-espresso/70">
            <div className="flex items-center justify-between">
              <span>Mock payment (real Clover swap-in)</span>
              <select
                value={cardToken}
                onChange={(e) => setCardToken(e.target.value)}
                className="rounded-lg bg-cream border border-espresso/20 px-2 py-1"
              >
                <option value="tok_visa">Visa •••• 4242 (succeeds)</option>
                <option value="tok_amex">Amex •••• 0005 (succeeds)</option>
                <option value="tok_fail">Card declined (test)</option>
              </select>
            </div>
          </div>
        </fieldset>

        <div className="rounded-2xl bg-cream-2/50 border border-espresso/10 p-4 space-y-1 tabular-nums">
          <Row label="Subtotal" value={formatMoney(subtotal)} />
          <Row label={`Tax (${(TAX_RATE * 100).toFixed(2)}%)`} value={formatMoney(tax)} />
          <Row label="Tip" value={formatMoney(tip)} />
          <div className="border-t border-espresso/10 pt-2 mt-2">
            <Row label="Total" value={formatMoney(total)} bold />
          </div>
        </div>

        {state?.error ? (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {state.error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-espresso text-cream py-4 font-medium hover:bg-espresso-2 disabled:opacity-60"
        >
          {pending ? "Placing order…" : `Pay ${formatMoney(total)} & place order`}
        </button>
      </form>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold text-espresso" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
