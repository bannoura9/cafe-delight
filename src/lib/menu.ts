export type Modifier = {
  id: string;
  name: string;
  priceCents: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  category: "Espresso" | "Brewed" | "Cold" | "Tea" | "Pastries" | "Sandwiches";
  image: string;
  modifiers?: Modifier[];
};

const milkOptions: Modifier[] = [
  { id: "milk-whole", name: "Whole milk", priceCents: 0 },
  { id: "milk-oat", name: "Oat milk", priceCents: 75 },
  { id: "milk-almond", name: "Almond milk", priceCents: 75 },
  { id: "milk-skim", name: "Skim milk", priceCents: 0 },
];

const shotOptions: Modifier[] = [
  { id: "shot-extra", name: "Extra shot", priceCents: 100 },
  { id: "shot-decaf", name: "Decaf", priceCents: 0 },
];

export const MENU: MenuItem[] = [
  {
    id: "latte",
    name: "Latte",
    description: "Double shot of espresso with steamed milk and light foam.",
    priceCents: 525,
    category: "Espresso",
    image:
      "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=800&q=80",
    modifiers: [...milkOptions, ...shotOptions],
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Equal parts espresso, steamed milk, and dense foam.",
    priceCents: 500,
    category: "Espresso",
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80",
    modifiers: [...milkOptions, ...shotOptions],
  },
  {
    id: "americano",
    name: "Americano",
    description: "Espresso with hot water — bold and clean.",
    priceCents: 425,
    category: "Espresso",
    image:
      "https://images.unsplash.com/photo-1581996323441-3d3b1f6f7c2c?w=800&q=80",
    modifiers: shotOptions,
  },
  {
    id: "drip",
    name: "House Drip",
    description: "Single-origin medium roast, brewed fresh hourly.",
    priceCents: 325,
    category: "Brewed",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  },
  {
    id: "pourover",
    name: "Pour Over",
    description: "Hand-poured Ethiopian. Bright, floral, citrus finish.",
    priceCents: 525,
    category: "Brewed",
    image:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80",
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    description: "Steeped 18 hours. Smooth, low-acid, naturally sweet.",
    priceCents: 475,
    category: "Cold",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
    modifiers: milkOptions,
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    description: "Espresso poured over ice with cold milk.",
    priceCents: 550,
    category: "Cold",
    image:
      "https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=800&q=80",
    modifiers: [...milkOptions, ...shotOptions],
  },
  {
    id: "matcha",
    name: "Matcha Latte",
    description: "Ceremonial-grade matcha whisked with steamed milk.",
    priceCents: 575,
    category: "Tea",
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80",
    modifiers: milkOptions,
  },
  {
    id: "earl-grey",
    name: "Earl Grey",
    description: "Bergamot black tea, full leaf.",
    priceCents: 350,
    category: "Tea",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80",
  },
  {
    id: "croissant",
    name: "Butter Croissant",
    description: "Baked in-house. Flaky, golden, 81 layers.",
    priceCents: 425,
    category: "Pastries",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
  },
  {
    id: "scone",
    name: "Blueberry Scone",
    description: "Fresh blueberries, lemon glaze.",
    priceCents: 425,
    category: "Pastries",
    image:
      "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=800&q=80",
  },
  {
    id: "avocado-toast",
    name: "Avocado Toast",
    description:
      "Smashed avocado, lemon, chili flake on toasted sourdough.",
    priceCents: 950,
    category: "Sandwiches",
    image:
      "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&q=80",
  },
  {
    id: "breakfast-sandwich",
    name: "Breakfast Sandwich",
    description: "Egg, sharp cheddar, smoked bacon on a brioche bun.",
    priceCents: 875,
    category: "Sandwiches",
    image:
      "https://images.unsplash.com/photo-1521986329282-0436c1f1e212?w=800&q=80",
  },
];

export const CATEGORIES = Array.from(new Set(MENU.map((m) => m.category)));

export function getMenuItem(id: string): MenuItem | undefined {
  return MENU.find((m) => m.id === id);
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
