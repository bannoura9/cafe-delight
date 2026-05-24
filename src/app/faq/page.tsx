import type { Metadata } from "next";
import Link from "next/link";
import { config } from "@/lib/config";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, faqLd, breadcrumbsLd } from "@/lib/seo";

const FAQS = [
  {
    q: "How do I order online?",
    a: `Visit our menu, add items to your cart, customize with milk or flavor options, and check out. Payment is handled securely by Clover. You'll get a receipt by email and we'll start making your order the moment you pay.`,
  },
  {
    q: "How long until my order is ready?",
    a: `Most orders are ready in about ${process.env.PICKUP_ETA_MINUTES ?? 5} minutes after you pay. Walk in, grab it, and you're out.`,
  },
  {
    q: "Where do I pick up my order?",
    a: `Come to ${process.env.BUSINESS_ADDRESS ?? "9395 Crown Crest Blvd, Parker, CO 80138"}. Tell us your name at the counter — we'll have it ready for you.`,
  },
  {
    q: "What payment methods do you accept online?",
    a: `Credit and debit cards (Visa, Mastercard, Amex, Discover), Apple Pay, Google Pay, and Samsung Pay. All processed securely by Clover.`,
  },
  {
    q: "Do you accept cash?",
    a: `Yes — but only in-store. Online orders require a card.`,
  },
  {
    q: "Can I get my drink with oat milk / almond milk / soy milk / coconut milk?",
    a: `Yes. Every milk-based drink lets you swap to oat, almond, soy, or coconut milk for an extra \$0.50. Pick your add-ons at checkout.`,
  },
  {
    q: "Do you have non-dairy options?",
    a: `Yes — oat, almond, soy, and coconut milks are all available. Our italian sodas and most teas are naturally dairy-free.`,
  },
  {
    q: "Do you have gluten-free options?",
    a: `All of our drinks are gluten-free. For food items, please ask in store as our kitchen handles wheat.`,
  },
  {
    q: "Do you have boba?",
    a: `Yes! We have 7 boba flavors: Caramel Macchiato, White Mocha, Shaken Espresso, Spanish Latte, Pumpkin Spice, Honey Chai, and Matcha Tea — all \$6.`,
  },
  {
    q: "Can I order on behalf of someone else?",
    a: `Yes — just use their name at checkout. They can come in and grab it under that name.`,
  },
  {
    q: "What if I made a mistake on my order?",
    a: `Call us right away. We can usually fix or cancel before we start making it. After preparation begins, refunds are at our discretion.`,
  },
  {
    q: "Do you offer refunds?",
    a: `For legitimate issues — wrong item, missing item, quality problem — yes, refunded through Clover. Email or visit the shop.`,
  },
  {
    q: "What are your hours?",
    a: `Monday through Friday, 7 AM to 3 PM. Closed Saturday and Sunday.`,
  },
  {
    q: "Do you have parking?",
    a: `Yes — free parking at our Crown Crest location in Parker.`,
  },
  {
    q: "Do you deliver?",
    a: `Not directly. We may add Grubhub / DoorDash / Uber Eats integration in the future. For now, our site is for online ordering with in-store pickup only.`,
  },
];

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: `Common questions about ordering online from ${config.businessName} in Parker, CO. Payment, pickup times, milk options, hours, and more.`,
  alternates: { canonical: `${SITE_URL}/faq` },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQS)} />
      <JsonLd
        data={breadcrumbsLd([
          { name: "Home", url: SITE_URL },
          { name: "FAQ", url: `${SITE_URL}/faq` },
        ])}
      />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="display text-4xl text-espresso mb-2">FAQ</h1>
        <p className="text-espresso/70 mb-8">
          Common questions about ordering from {config.businessName}.
        </p>

        <ul className="space-y-5">
          {FAQS.map((f, i) => (
            <li key={i}>
              <details className="rounded-2xl border border-espresso/10 bg-cream-2/30 p-4 [&[open]_summary_span]:rotate-180">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-medium text-espresso">{f.q}</span>
                  <span className="text-crema-2 transition-transform">▾</span>
                </summary>
                <p className="text-espresso/80 leading-relaxed mt-3">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-sm text-espresso/60 text-center">
          Still have a question?{" "}
          <Link href="/about" className="underline underline-offset-2 hover:text-crema-2">
            About us
          </Link>{" "}
          ·{" "}
          <Link href="/menu" className="underline underline-offset-2 hover:text-crema-2">
            See menu
          </Link>
        </div>
      </div>
    </>
  );
}
