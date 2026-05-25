import Link from "next/link";
import Image from "next/image";
import { CartBadge } from "./CartBadge";
import { OpenDot } from "./OpenDot";
import { config } from "@/lib/config";

export function Header() {
  return (
    <header className="border-b border-espresso/10 bg-cream/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" aria-label={config.businessName} className="block">
          <Image
            src="/logo.png"
            alt={config.businessName}
            width={453}
            height={223}
            priority
            className="h-12 w-auto"
          />
        </Link>
        <div className="flex flex-col items-end gap-1">
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/menu" className="hover:text-crema-2">
              Menu
            </Link>
            <Link
              href="/cart"
              className="hover:text-crema-2 flex items-center gap-2"
            >
              Cart <CartBadge />
            </Link>
          </nav>
          <OpenDot />
        </div>
      </div>
    </header>
  );
}
