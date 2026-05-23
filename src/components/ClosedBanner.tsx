"use client";

import { useEffect, useState } from "react";

type State = { open: boolean; hours: string } | null;

export function ClosedBanner() {
  const [state, setState] = useState<State>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/open", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (alive) setState(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!state || state.open) return null;

  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 p-4 mb-6 flex items-start gap-3">
      <span aria-hidden className="text-2xl leading-none">🕒</span>
      <div>
        <div className="font-semibold">We&apos;re closed right now</div>
        <div className="text-sm mt-0.5">
          {state.hours}. You can browse the menu and build your cart — orders
          open back up when we do.
        </div>
      </div>
    </div>
  );
}
