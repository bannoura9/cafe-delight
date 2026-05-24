import type { Metadata } from "next";
import { MENU, CATEGORIES } from "@/lib/menu";
import { MenuItemCard } from "@/components/MenuItemCard";
import { ClosedBanner } from "@/components/ClosedBanner";
import { JsonLd } from "@/components/JsonLd";
import { menuLd } from "@/lib/seo";
import { config } from "@/lib/config";
import { MenuFilters } from "./MenuFilters";

export const metadata: Metadata = {
  title: "Menu — Espresso, Boba, Matcha & More",
  description: `Full menu for ${config.businessName} in Parker, CO. Espresso, signature lattes, boba, matcha, gelato, italian sodas. Order online for pickup in ~${config.pickupEtaMinutes} minutes.`,
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://cafedelightco.com"}/menu` },
};

export default function MenuPage() {
  return (
    <>
      <JsonLd data={menuLd()} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <ClosedBanner />
        <h1 className="display text-4xl text-espresso mb-2">Menu</h1>
        <p className="text-espresso/70 mb-2">
          Tap a drink to customize and add to your order.
        </p>

        <MenuFilters />

        {CATEGORIES.map((cat) => (
          <section
            key={cat}
            id={cat.replace(/ /g, "-")}
            data-category-section
            className="mb-12 scroll-mt-32"
          >
            <h2 className="display text-2xl text-crema-2 mb-4">{cat}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {MENU.filter((m) => m.category === cat).map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
