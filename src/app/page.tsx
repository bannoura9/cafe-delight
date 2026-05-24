import Link from "next/link";
import Image from "next/image";
import { config } from "@/lib/config";
import { isOpenNow, hoursLabel } from "@/lib/hours";
import { HeroCartButton } from "@/components/HeroCartButton";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessLd } from "@/lib/seo";

export default function HomePage() {
  const open = isOpenNow();
  return (
    <div>
      <JsonLd data={localBusinessLd()} />
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-crema-2 mb-4">
            <span
              className={`inline-block w-2 h-2 rounded-full ${open ? "bg-leaf" : "bg-espresso/40"}`}
            />
            {open ? "Open now" : "Closed"} · {hoursLabel()}
          </div>
          <h1 className="display text-5xl md:text-6xl font-semibold leading-tight text-espresso">
            Order ahead.<br />
            <span className="text-crema-2">Skip the line.</span>
          </h1>
          <p className="mt-5 text-lg text-espresso/80 max-w-md">
            Fresh espresso, slow-brewed coffee, and breakfast made to order in
            Parker, CO. Pay online, pick up in ~{config.pickupEtaMinutes} minutes.
          </p>
          <div className="mt-7 flex gap-3">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-full bg-espresso text-cream px-6 py-3 font-medium hover:bg-espresso-2 transition"
            >
              See the menu
            </Link>
            <HeroCartButton />
          </div>
        </div>
        <div className="relative aspect-[4/3] md:aspect-[4/5] rounded-3xl overflow-hidden bg-cream-2 shadow-sm">
          <Image
            src="/hero-shop.jpg"
            alt={`Inside ${config.businessName} in Parker, CO`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="object-cover"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16 grid gap-6 sm:grid-cols-3">
        {[
          { t: "Order online", d: "Browse menu, customize, pay securely." },
          { t: "We make it", d: "Order prints in our shop the moment you pay." },
          {
            t: "Quick pickup",
            d: `Ready in about ${config.pickupEtaMinutes} minutes. Walk in, grab, go.`,
          },
        ].map((s, i) => (
          <div
            key={s.t}
            className="rounded-2xl bg-cream-2/60 p-6 border border-espresso/5"
          >
            <div className="display text-3xl text-crema-2 mb-2">0{i + 1}</div>
            <div className="font-semibold text-espresso">{s.t}</div>
            <div className="text-sm text-espresso/70 mt-1">{s.d}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
