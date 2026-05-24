import type { Metadata } from "next";
import Link from "next/link";
import { config } from "@/lib/config";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, localBusinessLd, breadcrumbsLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: `${config.businessName} is a coffee shop in Parker, CO serving espresso, signature lattes, boba, matcha, and gelato. Order online for fast pickup.`,
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={localBusinessLd()} />
      <JsonLd
        data={breadcrumbsLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
        ])}
      />

      <article className="max-w-2xl mx-auto px-4 py-10 [&_p]:text-espresso/80 [&_p]:leading-relaxed [&_p]:mt-3 [&_h2]:display [&_h2]:text-2xl [&_h2]:text-espresso [&_h2]:mt-8 [&_h2]:mb-2">
        <h1 className="display text-4xl text-espresso mb-2">
          About {config.businessName}
        </h1>
        <p className="text-espresso/60 text-sm">{config.businessAddress}</p>

        <h2>The shop</h2>
        <p>
          {config.businessName} is a small, locally-owned coffee shop in Parker,
          Colorado, on the ground level of Crown Crest Blvd. We make espresso
          drinks, signature lattes, boba teas, matcha, italian sodas, gelato,
          and breakfast — all made to order.
        </p>
        <p>
          We focus on consistency and speed. Every drink is built the same way
          every time, by people who care, with beans we&apos;re proud to serve.
        </p>

        <h2>How online ordering works</h2>
        <p>
          You order on this site, pay with your card (Apple Pay, Google Pay,
          and Samsung Pay all work), and we start making your order the
          instant you pay. It&apos;s usually ready in about{" "}
          {config.pickupEtaMinutes} minutes. Walk in, grab it, go.
        </p>
        <p>
          No app to install. No account required. Just{" "}
          <Link href="/menu">browse the menu</Link>, customize, and check out.
        </p>

        <h2>Hours</h2>
        <p>
          <strong>Monday – Friday: 7 AM – 3 PM</strong>
          <br />
          Saturday &amp; Sunday: closed
        </p>

        <h2>Find us</h2>
        <p>
          {config.businessAddress}
          <br />
          Ground level, next to the cafeteria. Easy parking right outside.
        </p>
      </article>
    </>
  );
}
