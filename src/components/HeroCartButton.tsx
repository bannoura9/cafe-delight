"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cartStore";

export function HeroCartButton() {
  const total = useCart((s) => s.totalQuantity());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || total === 0) return null;
  return (
    <Link
      href="/cart"
      className="inline-flex items-center justify-center rounded-full border border-espresso/20 px-6 py-3 font-medium hover:bg-cream-2 transition"
    >
      View cart ({total})
    </Link>
  );
}
