import Link from "next/link";
import { config } from "@/lib/config";
import { hoursLabel } from "@/lib/hours";

export function Footer() {
  return (
    <footer className="border-t border-espresso/10 bg-cream-2/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-4 text-sm text-espresso/80">
        <div>
          <div className="display text-lg text-espresso">{config.businessName}</div>
          <div>{config.businessAddress}</div>
        </div>
        <div>
          <div className="font-medium text-espresso">Hours</div>
          <div>{hoursLabel()}</div>
        </div>
        <div>
          <div className="font-medium text-espresso">Pickup</div>
          <div>Ready in ~{config.pickupEtaMinutes} minutes</div>
          <div>SMS when ready</div>
        </div>
        <div>
          <div className="font-medium text-espresso">Legal</div>
          <ul className="space-y-0.5">
            <li><Link href="/legal/terms" className="hover:text-crema-2">Terms of Service</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-crema-2">Privacy Policy</Link></li>
            <li><Link href="/legal/sms" className="hover:text-crema-2">SMS Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-espresso/10">
        <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-espresso/50">
          © {new Date().getFullYear()} {config.businessName}. Payments by Clover.
        </div>
      </div>
    </footer>
  );
}
