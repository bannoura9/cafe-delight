import { config } from "@/lib/config";

export const metadata = {
  title: `Terms of Service — ${process.env.BUSINESS_NAME ?? "Café Delight"}`,
  description: `Terms for ordering online from ${process.env.BUSINESS_NAME ?? "Café Delight"} in Parker, CO: payments, pickup, refunds, and cancellations.`,
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://cafedelightco.com"}/legal/terms` },
};

export default function TermsPage() {
  const effective = "May 23, 2026";
  return (
    <>
      <h1>Terms of Service</h1>
      <p className="text-sm text-espresso/60">Effective {effective}</p>

      <h2>1. Who we are</h2>
      <p>
        {config.businessName} ({config.businessAddress}) operates this website
        for online ordering and pickup. By placing an order through this site
        you agree to these Terms.
      </p>

      <h2>2. Ordering and payment</h2>
      <ul>
        <li>All orders are for in-store pickup at our address. We do not deliver.</li>
        <li>Payments are processed by Clover. We never see or store your card number.</li>
        <li>Prices, sales tax, and tips are shown at checkout before you pay.</li>
        <li>An order is confirmed only after Clover successfully charges your card.</li>
      </ul>

      <h2>3. Pickup</h2>
      <ul>
        <li>Orders are typically ready in ~{config.pickupEtaMinutes} minutes during business hours.</li>
        <li>If you provide your email, we will email you when your order is ready. Staff may also call the phone number you provided.</li>
        <li>Please pick up your order within 60 minutes of being notified.</li>
        <li>Unclaimed orders may be discarded; we cannot guarantee refunds for orders not picked up.</li>
      </ul>

      <h2>4. Cancellations and refunds</h2>
      <p>
        Because every order is made fresh, we generally cannot cancel an order
        once preparation has begun. If you need to cancel, call us immediately.
        Refunds for legitimate issues (wrong item, missing item, quality problem)
        are issued through Clover at our discretion.
      </p>

      <h2>5. Food allergies</h2>
      <p>
        Our kitchen handles dairy, soy, gluten, nuts, and other common allergens.
        We cannot guarantee any item is free of cross-contact. If you have a
        serious allergy, please call us before ordering.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        We are not liable for indirect, incidental, or consequential damages
        arising out of your use of this site. Our maximum liability for any
        order is the amount you paid for that order.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may update these Terms from time to time. The current version is
        always posted at this URL with its effective date. Continued use of
        the site means you accept the updated Terms.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about these Terms? Visit us at {config.businessAddress}.
      </p>
    </>
  );
}
