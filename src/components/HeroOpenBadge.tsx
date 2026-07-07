"use client";

import { useEffect, useState } from "react";
import { hoursLabel } from "@/lib/hours";

/**
 * Hero open/closed badge. Fetches /api/open on mount (like OpenDot) so the
 * status is live even when the statically-cached homepage was rendered hours
 * ago. Shows just the hours until the live status arrives.
 */
export function HeroOpenBadge() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/open", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (alive) setOpen(!!d.open);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-crema-2 mb-4">
      <span
        className={`inline-block w-2 h-2 rounded-full ${open ? "bg-leaf" : "bg-espresso/40"}`}
      />
      {open === null ? hoursLabel() : `${open ? "Open now" : "Closed"} · ${hoursLabel()}`}
    </div>
  );
}
