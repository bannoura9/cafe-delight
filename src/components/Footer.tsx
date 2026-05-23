import { config } from "@/lib/config";
import { hoursLabel } from "@/lib/hours";

export function Footer() {
  return (
    <footer className="border-t border-espresso/10 bg-cream-2/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-4 sm:grid-cols-3 text-sm text-espresso/80">
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
      </div>
    </footer>
  );
}
