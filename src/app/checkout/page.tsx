"use client";

import { useActionState, useEffect, useState } from "react";
import { useCart } from "@/lib/cartStore";
import { formatMoney } from "@/lib/menu";
import { ClosedBanner } from "@/components/ClosedBanner";
import { placeOrder, type CheckoutState } from "./actions";
import { Upsell } from "./Upsell";
import { trackBeginCheckout } from "@/lib/track";

const TAX_RATE = 0.08;
const TIP_PCT_OPTIONS = [0, 10, 15, 20, 25];

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lines = useCart((s) => s.lines);
  const subtotal = useCart((s) => s.subtotalCents());

  // Fire GA4 begin_checkout once per cart-snapshot.
  useEffect(() => {
    if (!mounted || lines.length === 0) return;
    trackBeginCheckout({ lines, valueCents: subtotal });
    // Only fire once when the page first loads with items.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // tipMode: 'pct' picks one of the preset percentages; 'custom' uses a dollar amount.
  const [tipMode, setTipMode] = useState<"pct" | "custom">("pct");
  const [tipPct, setTipPct] = useState<number>(15);
  const [customTip, setCustomTip] = useState<string>("");

  // Open/closed status from server — disables submit when shop is closed.
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/open", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setOpen(!!d.open))
      .catch(() => setOpen(true)); // fail open
  }, []);

  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(
    placeOrder,
    {},
  );

  if (!mounted) return null;

  const tax = Math.round(subtotal * TAX_RATE);
  const tip =
    tipMode === "custom"
      ? Math.max(0, Math.round((parseFloat(customTip) || 0) * 100))
      : Math.round(subtotal * (tipPct / 100));
  const total = subtotal + tax + tip;

  // Tip percent we report to the server. For custom, we back-derive it from
  // the dollar amount so the server can recompute exactly the same total.
  const tipPctForServer =
    tipMode === "custom"
      ? subtotal > 0
        ? (tip / subtotal) * 100
        : 0
      : tipPct;

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-espresso/70">
        Your cart is empty.
      </div>
    );
  }

  const closed = open === false;
  const submitDisabled = pending || closed;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <ClosedBanner />
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
        <input type="hidden" name="tipPct" value={tipPctForServer} />

        <fieldset className="space-y-3">
          <legend className="font-semibold text-espresso">Your info</legend>
          <input
            name="name"
            placeholder="Name"
            required
            autoComplete="name"
            className="w-full rounded-xl border border-espresso/20 bg-cream px-4 py-3 focus:outline-none focus:ring-2 focus:ring-crema"
          />
          <input
            name="phone"
            placeholder="Mobile number"
            required
            inputMode="tel"
            autoComplete="tel"
            className="w-full rounded-xl border border-espresso/20 bg-cream px-4 py-3 focus:outline-none focus:ring-2 focus:ring-crema"
          />
          <input
            name="email"
            placeholder="Email (optional — for receipt)"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="w-full rounded-xl border border-espresso/20 bg-cream px-4 py-3 focus:outline-none focus:ring-2 focus:ring-crema"
          />
        </fieldset>

        <fieldset>
          <legend className="font-semibold text-espresso mb-2">Tip</legend>
          <div className="flex flex-wrap gap-2">
            {TIP_PCT_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setTipMode("pct");
                  setTipPct(p);
                }}
                className={`flex-1 min-w-[64px] rounded-full border px-3 py-2 text-sm ${
                  tipMode === "pct" && tipPct === p
                    ? "bg-espresso text-cream border-espresso"
                    : "border-espresso/20 hover:bg-cream-2"
                }`}
              >
                {p === 0 ? "No tip" : `${p}%`}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setTipMode("custom")}
              className={`flex-1 min-w-[80px] rounded-full border px-3 py-2 text-sm ${
                tipMode === "custom"
                  ? "bg-espresso text-cream border-espresso"
                  : "border-espresso/20 hover:bg-cream-2"
              }`}
            >
              Custom
            </button>
          </div>
          {tipMode === "custom" ? (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-espresso/60 text-sm">$</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.25"
                placeholder="0.00"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                className="w-32 rounded-xl border border-espresso/20 bg-cream px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crema tabular-nums"
              />
              <span className="text-xs text-espresso/60">Enter the dollar amount</span>
            </div>
          ) : null}
        </fieldset>

        <Upsell />

        <div className="rounded-2xl bg-cream-2/50 border border-espresso/10 p-4 space-y-1 tabular-nums">
          <Row label="Subtotal" value={formatMoney(subtotal)} />
          <Row label={`Tax (${(TAX_RATE * 100).toFixed(0)}%)`} value={formatMoney(tax)} />
          <Row label="Tip" value={formatMoney(tip)} />
          <div className="border-t border-espresso/10 pt-2 mt-2">
            <Row label="Total" value={formatMoney(total)} bold />
          </div>
        </div>

        <div className="text-xs text-espresso/60 flex items-start gap-2 px-1">
          <span aria-hidden>🔒</span>
          <span>
            Card payment is handled by Clover on a secure hosted page. We never see
            your card number. You&apos;ll be redirected back here when payment completes.
          </span>
        </div>

        <div className="text-xs text-espresso/60 px-1">
          By placing this order you agree to our{" "}
          <a href="/legal/terms" className="underline underline-offset-2 hover:text-crema-2">
            Terms
          </a>{" "}
          and{" "}
          <a href="/legal/privacy" className="underline underline-offset-2 hover:text-crema-2">
            Privacy Policy
          </a>
          . If you provide your email, we&apos;ll send you a single notification
          when your order is ready for pickup.
        </div>

        {state?.error ? (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {state.error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitDisabled}
          className="w-full rounded-full bg-espresso text-cream py-4 font-medium hover:bg-espresso-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pending
            ? "Redirecting to payment…"
            : closed
              ? "We're closed — orders open during business hours"
              : `Continue to payment · ${formatMoney(total)} →`}
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
