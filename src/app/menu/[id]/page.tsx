import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MENU, getMenuItem, formatMoney, CATEGORY_EMOJI } from "@/lib/menu";
import { config } from "@/lib/config";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_URL,
  menuItemPageLd,
  breadcrumbsLd,
  menuItemMetaDescription,
} from "@/lib/seo";
import { AddToCartButton } from "./AddToCartButton";

export function generateStaticParams() {
  return MENU.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = getMenuItem(id);
  if (!item) return { title: "Item not found" };

  const desc = menuItemMetaDescription(item);
  const url = `${SITE_URL}/menu/${item.id}`;
  const image = item.image
    ? item.image.startsWith("/")
      ? `${SITE_URL}${item.image}`
      : item.image
    : `${SITE_URL}/logo.png`;

  return {
    title: `${item.name} — ${item.category}`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${item.name} · ${config.businessName}`,
      description: desc,
      url,
      images: [{ url: image, alt: item.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.name} · ${config.businessName}`,
      description: desc,
      images: [image],
    },
  };
}

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getMenuItem(id);
  if (!item) notFound();

  const priceRange =
    item.sizes.length > 1
      ? `${formatMoney(item.sizes[0].priceCents)} – ${formatMoney(item.sizes[item.sizes.length - 1].priceCents)}`
      : formatMoney(item.sizes[0].priceCents);

  return (
    <>
      <JsonLd data={menuItemPageLd(item)} />
      <JsonLd
        data={breadcrumbsLd([
          { name: "Home", url: SITE_URL },
          { name: "Menu", url: `${SITE_URL}/menu` },
          { name: item.category, url: `${SITE_URL}/menu#${item.category.replace(/ /g, "-")}` },
          { name: item.name, url: `${SITE_URL}/menu/${item.id}` },
        ])}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-espresso/60 mb-6">
          <Link href="/menu" className="hover:text-crema-2">
            Menu
          </Link>
          <span className="mx-2">›</span>
          <Link href={`/menu#${item.category}`} className="hover:text-crema-2">
            {item.category}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-espresso/80">{item.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
          {item.image ? (
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-2">
              <Image
                src={item.image}
                alt={`${item.name} from ${config.businessName} in Parker, CO`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-crema/30 to-espresso/20 flex items-center justify-center text-9xl">
              <span aria-hidden>{CATEGORY_EMOJI[item.category]}</span>
            </div>
          )}

          <div>
            <div className="text-xs uppercase tracking-wider text-crema-2 mb-2">
              {item.category}
            </div>
            <h1 className="display text-4xl text-espresso mb-3">{item.name}</h1>
            <div className="text-xl tabular-nums text-espresso mb-4">{priceRange}</div>
            {item.description ? (
              <p className="text-espresso/80 mb-6 leading-relaxed">{item.description}</p>
            ) : null}

            {item.sizes.length > 1 ? (
              <div className="mb-6">
                <div className="text-sm font-medium text-espresso mb-2">Sizes</div>
                <ul className="space-y-1 text-sm">
                  {item.sizes.map((s) => (
                    <li key={s.id} className="flex justify-between">
                      <span>{s.label}</span>
                      <span className="tabular-nums">{formatMoney(s.priceCents)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {item.modifiers && item.modifiers.length > 0 ? (
              <div className="mb-6">
                <div className="text-sm font-medium text-espresso mb-2">
                  Add-ons (+$0.50 each)
                </div>
                <p className="text-sm text-espresso/70">
                  {item.modifiers.map((m) => m.name).join(" · ")}
                </p>
              </div>
            ) : null}

            <AddToCartButton item={item} />

            <p className="mt-4 text-xs text-espresso/60">
              Order ahead at {config.businessName} · {config.businessAddress} ·
              Ready in ~{config.pickupEtaMinutes} minutes
            </p>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="display text-2xl text-espresso mb-4">
            More from our {item.category} menu
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MENU.filter((m) => m.category === item.category && m.id !== item.id)
              .slice(0, 6)
              .map((m) => (
                <Link
                  key={m.id}
                  href={`/menu/${m.id}`}
                  className="rounded-xl border border-espresso/10 bg-cream-2/30 p-4 hover:bg-cream-2/60 transition"
                >
                  <div className="font-medium text-espresso">{m.name}</div>
                  <div className="text-sm text-espresso/60 mt-1 tabular-nums">
                    {m.sizes.length > 1
                      ? `${formatMoney(m.sizes[0].priceCents)} – ${formatMoney(m.sizes[m.sizes.length - 1].priceCents)}`
                      : formatMoney(m.sizes[0].priceCents)}
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
