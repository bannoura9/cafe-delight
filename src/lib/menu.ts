export type Modifier = {
  id: string;
  name: string;
  priceCents: number;
};

export type Size = {
  id: string;
  label: string;
  priceCents: number;
};

export type Category =
  | "Espresso"
  | "Signature Lattes"
  | "Coffee"
  | "Gelato"
  | "Tea"
  | "Boba"
  | "Refreshing Drinks";

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  category: Category;
  sizes: Size[];
  modifiers?: Modifier[];
  image?: string;
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?w=600&q=80&auto=format&fit=crop`;

const MILK_OPTIONS: Modifier[] = [
  { id: "milk-oat", name: "Oat milk", priceCents: 50 },
  { id: "milk-almond", name: "Almond milk", priceCents: 50 },
  { id: "milk-soy", name: "Soy milk", priceCents: 50 },
  { id: "milk-coconut", name: "Coconut milk", priceCents: 50 },
];

const FLAVOR_OPTIONS: Modifier[] = [
  { id: "flav-vanilla", name: "Vanilla", priceCents: 50 },
  { id: "flav-caramel", name: "Caramel", priceCents: 50 },
  { id: "flav-hazelnut", name: "Hazelnut", priceCents: 50 },
  { id: "flav-almond", name: "Almond", priceCents: 50 },
  { id: "flav-irish-cream", name: "Irish Cream", priceCents: 50 },
  { id: "flav-pistachio", name: "Pistachio", priceCents: 50 },
  { id: "flav-coconut-syrup", name: "Coconut", priceCents: 50 },
  { id: "flav-salted-caramel", name: "Salted Caramel", priceCents: 50 },
  { id: "flav-peppermint", name: "Peppermint", priceCents: 50 },
  { id: "flav-lavender", name: "Lavender", priceCents: 50 },
  { id: "flav-raspberry", name: "Raspberry", priceCents: 50 },
  { id: "flav-tiramisu", name: "Tiramisu", priceCents: 50 },
  { id: "flav-pumpkin-spice", name: "Pumpkin Spice", priceCents: 50 },
];

const BARISTA_MODS: Modifier[] = [...MILK_OPTIONS, ...FLAVOR_OPTIONS];

const sizesSL = (small: number, large: number): Size[] => [
  { id: "small", label: "Small", priceCents: small },
  { id: "large", label: "Large", priceCents: large },
];
const sizeOne = (cents: number, label = "Regular"): Size[] => [
  { id: "regular", label, priceCents: cents },
];

export const MENU: MenuItem[] = [
  // ── Espresso ──
  {
    id: "espresso-shot",
    image: u("photo-1521305916504-4a1121188589"),
    name: "Espresso Shot",
    category: "Espresso",
    sizes: sizesSL(200, 300),
    modifiers: FLAVOR_OPTIONS,
  },
  {
    id: "americano",
    image: u("photo-1485808191679-5f86510681a2"),
    name: "Americano",
    category: "Espresso",
    sizes: sizesSL(350, 400),
    modifiers: BARISTA_MODS,
  },
  {
    id: "cortado",
    image: u("photo-1572442388796-11668a67e53d"),
    name: "Cortado",
    category: "Espresso",
    sizes: sizeOne(350),
    modifiers: BARISTA_MODS,
  },
  {
    id: "latte",
    image: u("photo-1561882468-9110e03e0f78"),
    name: "Latte",
    category: "Espresso",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "breve-latte",
    image: u("photo-1556679343-c7306c1976bc"),
    name: "Breve Latte",
    description: "Made with steamed half & half.",
    category: "Espresso",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "honey-latte",
    image: u("photo-1546039907-7fa05f864c02"),
    name: "Honey Latte",
    category: "Espresso",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },

  // ── Signature Lattes ──
  {
    id: "pumpkin-spice-latte",
    image: u("photo-1577805947697-89e18249d767"),
    name: "Pumpkin Spice Latte",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "chocolate-mocha",
    image: u("photo-1497636577773-f1231844b336"),
    name: "Chocolate Mocha",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "white-mocha",
    image: u("photo-1502462041640-b3d7e50d0662"),
    name: "White Mocha",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "raspberry-white-mocha",
    image: u("photo-1442512595331-e89e73853f31"),
    name: "Raspberry White Mocha",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "caramel-macchiato",
    image: u("photo-1488477181946-6428a0291777"),
    name: "Caramel Macchiato",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "shaken-espresso",
    image: u("photo-1517959105821-eaf2591984ca"),
    name: "Shaken Espresso",
    category: "Signature Lattes",
    sizes: sizesSL(550, 600),
    modifiers: BARISTA_MODS,
  },
  {
    id: "tiramisu-latte",
    image: u("photo-1530373239216-42518e6b4063"),
    name: "Tiramisu Latte",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "spanish-latte",
    image: "/menu/spanish-latte.jpg",
    name: "Spanish Latte",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },

  // ── Coffee ──
  {
    id: "drip-coffee",
    image: "/menu/drip-coffee.jpg",
    name: "Drip Coffee",
    category: "Coffee",
    sizes: sizesSL(275, 300),
    modifiers: BARISTA_MODS,
  },
  {
    id: "nitro-brew",
    image: "/menu/nitro-brew.jpg",
    name: "Nitro Brew Coffee",
    category: "Coffee",
    sizes: sizesSL(500, 600),
    modifiers: BARISTA_MODS,
  },
  {
    id: "nitro-cold-foam",
    image: "/menu/nitro-cold-foam.jpg",
    name: "Nitro w/ Cold Foam",
    category: "Coffee",
    sizes: sizesSL(550, 650),
    modifiers: BARISTA_MODS,
  },

  // ── Gelato ──
  {
    id: "gelato",
    image: "/menu/gelato.jpg",
    name: "Gelato",
    description: "Ask the barista for today's flavors.",
    category: "Gelato",
    sizes: [
      { id: "small-4oz", label: "Small (4oz)", priceCents: 475 },
      { id: "medium-5oz", label: "Medium (5oz)", priceCents: 525 },
      { id: "large-8oz", label: "Large (8oz)", priceCents: 750 },
    ],
  },
  {
    id: "affogato",
    image: u("photo-1568901346375-23c9450c58cd"),
    name: "Affogato",
    description: "A scoop of gelato drowned in a fresh espresso shot.",
    category: "Gelato",
    sizes: sizeOne(600),
  },

  // ── Tea ──
  {
    id: "chai-tea-latte",
    image: "/menu/chai-tea-latte.jpg",
    name: "Chai Tea Latte",
    category: "Tea",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "matcha-tea-latte",
    image: "/menu/matcha-tea-latte.jpg",
    name: "Matcha Tea Latte",
    category: "Tea",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "hot-tea",
    image: "/menu/hot-tea.jpg",
    name: "Hot Tea",
    description: "Ask for today's selection.",
    category: "Tea",
    sizes: sizeOne(300),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "london-fog",
    image: "/menu/london-fog.jpg",
    name: "London Fog",
    description: "Earl grey, vanilla, steamed milk.",
    category: "Tea",
    sizes: sizesSL(400, 450),
    modifiers: BARISTA_MODS,
  },
  {
    id: "matcha-chai",
    image: "/menu/matcha-chai.jpg",
    name: "Matcha Chai",
    category: "Tea",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "strawberry-matcha",
    image: "/menu/strawberry-matcha.jpg",
    name: "Strawberry Matcha",
    category: "Tea",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "raspberry-matcha",
    image: "/menu/raspberry-matcha.jpg",
    name: "Raspberry Matcha",
    category: "Tea",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },

  // ── Boba ──
  {
    id: "boba-caramel-macchiato",
    image: "/menu/boba-caramel-macchiato.jpg",
    name: "Caramel Macchiato Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-white-mocha",
    image: "/menu/boba-white-mocha.jpg",
    name: "White Mocha Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-shaken-espresso",
    image: "/menu/boba-shaken-espresso.jpg",
    name: "Shaken Espresso Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-spanish-latte",
    image: "/menu/boba-spanish-latte.jpg",
    name: "Spanish Latte Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-pumpkin-spice",
    image: "/menu/boba-pumpkin-spice.jpg",
    name: "Pumpkin Spice Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-honey-chai",
    image: "/menu/boba-honey-chai.jpg",
    name: "Honey Chai Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-matcha-tea",
    image: "/menu/boba-matcha-tea.jpg",
    name: "Matcha Tea Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },

  // ── Refreshing Drinks ──
  {
    id: "soda-passionfruit",
    image: u("photo-1597318181409-cf64d0b5d8a2"),
    name: "Passionfruit Italian Soda",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-strawberry",
    image: "/menu/soda-strawberry.jpg",
    name: "Strawberry Italian Soda",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-raspberry",
    image: "/menu/soda-raspberry.jpg",
    name: "Raspberry Italian Soda",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-cream",
    image: "/menu/soda-cream.jpg",
    name: "Italian Soda w/ Cream",
    category: "Refreshing Drinks",
    sizes: sizeOne(425),
  },
  {
    id: "soda-redbull",
    image: "/menu/soda-redbull.jpg",
    name: "Red Bull Italian Soda",
    category: "Refreshing Drinks",
    sizes: sizeOne(500),
  },
];

export const CATEGORIES: Category[] = [
  "Espresso",
  "Signature Lattes",
  "Coffee",
  "Gelato",
  "Tea",
  "Boba",
  "Refreshing Drinks",
];

export const CATEGORY_EMOJI: Record<Category, string> = {
  Espresso: "☕",
  "Signature Lattes": "🥛",
  Coffee: "☕",
  Gelato: "🍨",
  Tea: "🍵",
  Boba: "🧋",
  "Refreshing Drinks": "🥤",
};

export function getMenuItem(id: string): MenuItem | undefined {
  return MENU.find((m) => m.id === id);
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
