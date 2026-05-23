"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cartStore";

export function CartBadge() {
  const total = useCart((s) => s.totalQuantity());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || total === 0) return null;
  return (
    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-espresso text-cream text-xs font-medium">
      {total}
    </span>
  );
}
