import Link from "next/link";
import { CartBadge } from "./CartBadge";
import { config } from "@/lib/config";

export function Header() {
  return (
    <header className="border-b border-espresso/10 bg-cream/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <span className="display text-xl font-semibold text-espresso">
            {config.businessName}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/menu" className="hover:text-crema-2">
            Menu
          </Link>
          <Link href="/cart" className="hover:text-crema-2 flex items-center gap-2">
            Cart <CartBadge />
          </Link>
        </nav>
      </div>
    </header>
  );
}
