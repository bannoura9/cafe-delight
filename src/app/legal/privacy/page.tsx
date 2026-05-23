import { config } from "@/lib/config";

export const metadata = { title: `Privacy Policy — ${process.env.BUSINESS_NAME ?? "Café Delight"}` };

export default function PrivacyPage() {
  const effective = "May 23, 2026";
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-espresso/60">Effective {effective}</p>

      <p>
        {config.businessName} respects your privacy. This policy explains what
        we collect when you place an order online, why we collect it, and what
        we do with it.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Name</strong> — to label your order and call you when ready.</li>
        <li><strong>Mobile number</strong> — to text you when your order is ready.</li>
        <li><strong>Order items, totals, timestamps</strong> — to fulfill the order and for our own records.</li>
        <li><strong>Payment information</strong> — collected directly by Clover on their hosted page. We never receive your full card number. We store only the last four digits and a Clover reference ID.</li>
        <li><strong>Basic web analytics</strong> — anonymous page-view counts via Vercel Analytics. No cookies, no personal data.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>Fulfilling your order and sending pickup notifications.</li>
        <li>Customer support if there&apos;s a problem.</li>
        <li>Aggregate sales reporting and tax compliance.</li>
        <li>Recognizing returning customers (we may show your name pre-filled at checkout if you previously ordered from the same browser).</li>
      </ul>

      <h2>Who we share it with</h2>
      <ul>
        <li><strong>Clover</strong> — processes payments and stores order records as part of our POS.</li>
        <li><strong>Twilio</strong> — sends the SMS notification when your order is ready.</li>
        <li><strong>Vercel and Neon</strong> — host our website and database (no payment data).</li>
        <li><strong>Law enforcement or tax authorities</strong> — only if legally required.</li>
      </ul>
      <p>We do not sell your information. We do not share it for advertising.</p>

      <h2>SMS messaging</h2>
      <p>
        When you provide a mobile number at checkout, you are consenting to
        receive one automated SMS per order: the &quot;your order is ready&quot;
        notification. Message and data rates may apply. Reply <strong>STOP</strong>
        to opt out (you will not be able to receive ready notifications until
        you re-opt-in). See our <a href="/legal/sms">SMS Terms</a> for details.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep order records indefinitely for accounting and tax compliance.
        We retain SMS logs for 90 days for delivery troubleshooting. You can
        request deletion of your personal data by contacting us.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request a copy of, correction of, or deletion of your personal
        data. Contact us at the shop: {config.businessAddress}.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy. The current version is always at this URL
        with its effective date.
      </p>
    </>
  );
}
