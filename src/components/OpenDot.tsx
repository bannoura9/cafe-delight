"use client";

import { useEffect, useState } from "react";

/**
 * Tiny live open/closed dot. Fetches /api/open on mount so it shows the
 * current Mountain Time status even on statically-cached pages.
 */
export function OpenDot() {
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

  if (open === null) return null;

  return (
    <div className="flex items-center gap-1.5 text-[11px] leading-none">
      <span
        aria-hidden
        className={`inline-block w-1.5 h-1.5 rounded-full ${open ? "bg-leaf" : "bg-red-500"}`}
      />
      <span className={open ? "text-leaf" : "text-red-700"}>
        {open ? "Open" : "Closed"}
      </span>
    </div>
  );
}
