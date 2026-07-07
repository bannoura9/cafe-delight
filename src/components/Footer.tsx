import Link from "next/link";
import { config } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-espresso/10 bg-cream-2/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-4 text-sm text-espresso/80">
        <div>
          <div className="display text-lg text-espresso">{config.businessName}</div>
          <div>9395 Crown Crest Blvd</div>
          <div>Parker, CO 80138</div>
        </div>
        <div>
          <div className="font-medium text-espresso">Hours</div>
          <div>Mon–Fri 7 AM – 3 PM</div>
          <div>Sat &amp; Sun closed</div>
        </div>
        <div>
          <div className="font-medium text-espresso">Pickup</div>
          <div>Ready in ~{config.pickupEtaMinutes} minutes</div>
          <div>Walk in, grab, go</div>
        </div>
        <div>
          <div className="font-medium text-espresso">Explore</div>
          <ul>
            <li><Link href="/menu" className="inline-block py-1.5 hover:text-crema-2">Menu</Link></li>
            <li><Link href="/about" className="inline-block py-1.5 hover:text-crema-2">About</Link></li>
            <li><Link href="/faq" className="inline-block py-1.5 hover:text-crema-2">FAQ</Link></li>
            <li><Link href="/legal/terms" className="inline-block py-1.5 hover:text-crema-2">Terms</Link></li>
            <li><Link href="/legal/privacy" className="inline-block py-1.5 hover:text-crema-2">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-espresso/10">
        <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-espresso/70">
          © {new Date().getFullYear()} {config.businessName}. Payments by Clover.
        </div>
      </div>
    </footer>
  );
}
