import { config } from "@/lib/config";

export const metadata = { title: `SMS Terms — ${process.env.BUSINESS_NAME ?? "Café Delight"}` };

export default function SmsPage() {
  return (
    <>
      <h1>SMS / Text Message Terms</h1>
      <p className="text-sm text-espresso/60">Effective May 23, 2026</p>

      <p>
        {config.businessName} sends one automated text message per online order:
        a notification that your order is ready for pickup. This page explains
        the terms of that messaging program.
      </p>

      <h2>Consent</h2>
      <p>
        By entering your mobile number at checkout and submitting your order,
        you are providing express consent to receive one transactional SMS
        from us at that number for that specific order.
      </p>

      <h2>What you&apos;ll receive</h2>
      <p>
        A single message in the form:
      </p>
      <p className="bg-cream-2/50 border border-espresso/10 rounded-xl px-4 py-3 font-mono text-sm">
        {config.businessName}: Your order #abc123 is ready for pickup at {config.businessAddress}.
      </p>
      <p>
        We do not send marketing texts. We do not send promotional messages.
        We do not enroll you in any recurring program.
      </p>

      <h2>Frequency</h2>
      <p>One message per order placed.</p>

      <h2>Cost</h2>
      <p>
        Message and data rates may apply per your wireless carrier&apos;s plan.
        We do not charge you for SMS.
      </p>

      <h2>Opt-out</h2>
      <p>
        Reply <strong>STOP</strong> to any of our messages to opt out. We will
        send one confirmation that you have been unsubscribed. You will not
        receive any further messages, including ready notifications for future
        orders, until you re-opt in by placing a new order (which re-establishes
        consent).
      </p>

      <h2>Help</h2>
      <p>
        Reply <strong>HELP</strong> for assistance, or visit us at{" "}
        {config.businessAddress}.
      </p>

      <h2>Supported carriers</h2>
      <p>
        AT&amp;T, T-Mobile, Verizon, US Cellular, and most other US carriers.
        Carriers are not liable for delayed or undelivered messages.
      </p>

      <h2>Privacy</h2>
      <p>
        See our <a href="/legal/privacy">Privacy Policy</a> for how we handle
        your phone number and other personal information.
      </p>
    </>
  );
}
