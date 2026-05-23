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
};

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
    name: "Espresso Shot",
    category: "Espresso",
    sizes: sizesSL(200, 300),
    modifiers: FLAVOR_OPTIONS,
  },
  {
    id: "americano",
    name: "Americano",
    category: "Espresso",
    sizes: sizesSL(350, 400),
    modifiers: BARISTA_MODS,
  },
  {
    id: "cortado",
    name: "Cortado",
    category: "Espresso",
    sizes: sizeOne(350),
    modifiers: BARISTA_MODS,
  },
  {
    id: "latte",
    name: "Latte",
    category: "Espresso",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "breve-latte",
    name: "Breve Latte",
    description: "Made with steamed half & half.",
    category: "Espresso",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "honey-latte",
    name: "Honey Latte",
    category: "Espresso",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },

  // ── Signature Lattes ──
  {
    id: "pumpkin-spice-latte",
    name: "Pumpkin Spice Latte",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "chocolate-mocha",
    name: "Chocolate Mocha",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "white-mocha",
    name: "White Mocha",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "raspberry-white-mocha",
    name: "Raspberry White Mocha",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "caramel-macchiato",
    name: "Caramel Macchiato",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "shaken-espresso",
    name: "Shaken Espresso",
    category: "Signature Lattes",
    sizes: sizesSL(550, 600),
    modifiers: BARISTA_MODS,
  },
  {
    id: "tiramisu-latte",
    name: "Tiramisu Latte",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "spanish-latte",
    name: "Spanish Latte",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },

  // ── Coffee ──
  {
    id: "drip-coffee",
    name: "Drip Coffee",
    category: "Coffee",
    sizes: sizesSL(275, 300),
    modifiers: BARISTA_MODS,
  },
  {
    id: "nitro-brew",
    name: "Nitro Brew Coffee",
    category: "Coffee",
    sizes: sizesSL(500, 600),
    modifiers: BARISTA_MODS,
  },
  {
    id: "nitro-cold-foam",
    name: "Nitro w/ Cold Foam",
    category: "Coffee",
    sizes: sizesSL(550, 650),
    modifiers: BARISTA_MODS,
  },

  // ── Gelato ──
  {
    id: "gelato",
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
    name: "Affogato",
    description: "A scoop of gelato drowned in a fresh espresso shot.",
    category: "Gelato",
    sizes: sizeOne(600),
  },

  // ── Tea ──
  {
    id: "chai-tea-latte",
    name: "Chai Tea Latte",
    category: "Tea",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "matcha-tea-latte",
    name: "Matcha Tea Latte",
    category: "Tea",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "hot-tea",
    name: "Hot Tea",
    description: "Ask for today's selection.",
    category: "Tea",
    sizes: sizeOne(300),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "london-fog",
    name: "London Fog",
    description: "Earl grey, vanilla, steamed milk.",
    category: "Tea",
    sizes: sizesSL(400, 450),
    modifiers: BARISTA_MODS,
  },
  {
    id: "matcha-chai",
    name: "Matcha Chai",
    category: "Tea",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "strawberry-matcha",
    name: "Strawberry Matcha",
    category: "Tea",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "raspberry-matcha",
    name: "Raspberry Matcha",
    category: "Tea",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },

  // ── Boba ──
  {
    id: "boba-caramel-macchiato",
    name: "Caramel Macchiato Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-white-mocha",
    name: "White Mocha Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-shaken-espresso",
    name: "Shaken Espresso Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-spanish-latte",
    name: "Spanish Latte Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-pumpkin-spice",
    name: "Pumpkin Spice Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-honey-chai",
    name: "Honey Chai Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-matcha-tea",
    name: "Matcha Tea Boba",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },

  // ── Refreshing Drinks ──
  {
    id: "soda-passionfruit",
    name: "Passionfruit Italian Soda",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-strawberry",
    name: "Strawberry Italian Soda",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-raspberry",
    name: "Raspberry Italian Soda",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-cream",
    name: "Italian Soda w/ Cream",
    category: "Refreshing Drinks",
    sizes: sizeOne(425),
  },
  {
    id: "soda-redbull",
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
