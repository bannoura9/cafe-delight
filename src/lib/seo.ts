import { config } from "./config";
import { MENU, formatMoney, type MenuItem } from "./menu";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cafedelightco.com";

const LATITUDE = 39.5151; // Parker, CO approximate
const LONGITUDE = -104.7614;

function addressParts() {
  // 9395 Crown Crest Blvd, Parker, CO 80138
  return {
    streetAddress: "9395 Crown Crest Blvd",
    addressLocality: "Parker",
    addressRegion: "CO",
    postalCode: "80138",
    addressCountry: "US",
  };
}

function openingHoursSpec() {
  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "15:00",
    },
  ];
}

export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${SITE_URL}/#cafe`,
    name: config.businessName,
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: config.businessPhone || "+1-720-201-7193",
    priceRange: "$",
    servesCuisine: ["Coffee", "Espresso", "Tea", "Boba", "Gelato", "Breakfast"],
    address: { "@type": "PostalAddress", ...addressParts() },
    geo: {
      "@type": "GeoCoordinates",
      latitude: LATITUDE,
      longitude: LONGITUDE,
    },
    openingHoursSpecification: openingHoursSpec(),
    hasMenu: `${SITE_URL}/menu`,
    acceptsReservations: false,
    paymentAccepted: "Credit Card, Apple Pay, Google Pay, Samsung Pay",
  };
}

export function menuLd() {
  const sectionMap = new Map<string, MenuItem[]>();
  for (const item of MENU) {
    const arr = sectionMap.get(item.category) ?? [];
    arr.push(item);
    sectionMap.set(item.category, arr);
  }

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${SITE_URL}/menu#menu`,
    name: `${config.businessName} Menu`,
    inLanguage: "en-US",
    hasMenuSection: Array.from(sectionMap.entries()).map(([cat, items]) => ({
      "@type": "MenuSection",
      name: cat,
      hasMenuItem: items.map((it) => menuItemLdInline(it)),
    })),
  };
}

function menuItemLdInline(item: MenuItem) {
  const offers = item.sizes.map((s) => ({
    "@type": "Offer",
    name: item.sizes.length > 1 ? s.label : undefined,
    price: (s.priceCents / 100).toFixed(2),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  }));
  return {
    "@type": "MenuItem",
    "@id": `${SITE_URL}/menu/${item.id}#item`,
    name: item.name,
    description: item.description,
    image: item.image
      ? item.image.startsWith("/")
        ? `${SITE_URL}${item.image}`
        : item.image
      : undefined,
    menuAddOn: item.modifiers?.map((m) => ({
      "@type": "MenuItem",
      name: m.name,
      offers: {
        "@type": "Offer",
        price: (m.priceCents / 100).toFixed(2),
        priceCurrency: "USD",
      },
    })),
    offers: offers.length === 1 ? offers[0] : offers,
  };
}

export function menuItemPageLd(item: MenuItem) {
  return {
    "@context": "https://schema.org",
    ...menuItemLdInline(item),
  };
}

export function breadcrumbsLd(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function faqLd(qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function menuItemMetaDescription(item: MenuItem): string {
  const priceRange =
    item.sizes.length > 1
      ? `${formatMoney(item.sizes[0].priceCents)}–${formatMoney(item.sizes[item.sizes.length - 1].priceCents)}`
      : formatMoney(item.sizes[0].priceCents);
  const cta = `Order ${item.name} online from ${config.businessName} in Parker, CO. ${priceRange}. Pickup in ~${config.pickupEtaMinutes} min.`;

  // Google truncates around 160 chars; lead with the first sentence of the
  // description only if the whole line still fits.
  const firstSentence = item.description?.match(/^[^.]*\./)?.[0];
  if (firstSentence && firstSentence.length + cta.length + 1 <= 160) {
    return `${firstSentence} ${cta}`;
  }
  return cta;
}
