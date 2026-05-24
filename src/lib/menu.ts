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

export type Temperature = "hot" | "cold" | "either";

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  category: Category;
  sizes: Size[];
  modifiers?: Modifier[];
  image?: string;
  temperature: Temperature;
  featured?: boolean;
  tagline?: string;
};

export function getFeaturedItem(): MenuItem | undefined {
  return MENU.find((m) => m.featured);
}

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
    temperature: "hot",
    image: "/menu/espresso-shot.jpg",
    name: "Espresso Shot",
    description: "Crafted with passion using rich, smooth espresso beans for a bold flavor and velvety finish.",
    category: "Espresso",
    sizes: sizesSL(200, 300),
    modifiers: FLAVOR_OPTIONS,
  },
  {
    id: "americano",
    temperature: "either",
    image: "/menu/americano.jpg",
    name: "Americano",
    description: "Fresh espresso with hot water for a smooth and comforting coffee experience.",
    category: "Espresso",
    sizes: sizesSL(350, 400),
    modifiers: BARISTA_MODS,
  },
  {
    id: "cortado",
    temperature: "hot",
    image: "/menu/cortado.jpg",
    name: "Cortado",
    description: "Perfectly balances rich espresso and silky steamed milk for a smooth, flavorful drink.",
    category: "Espresso",
    sizes: sizeOne(350),
    modifiers: BARISTA_MODS,
  },
  {
    id: "latte",
    temperature: "either",
    image: "/menu/latte.jpg",
    name: "Latte",
    description: "Creamy steamed milk with bold espresso for a smooth and comforting cafe favorite.",
    category: "Espresso",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "breve-latte",
    temperature: "hot",
    image: "/menu/breve-latte.jpg",
    name: "Breve Latte",
    description: "Extra creamy and rich, made with half-and-half for a luxurious coffee experience.",
    category: "Espresso",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "honey-latte",
    temperature: "either",
    image: u("photo-1546039907-7fa05f864c02"),
    name: "Honey Latte",
    category: "Espresso",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },

  // ── Signature Lattes ──
  {
    id: "pumpkin-spice-latte",
    temperature: "either",
    image: "/menu/pumpkin-spice-latte.jpg",
    name: "Pumpkin Spice Latte",
    description: "Cozy seasonal flavors with smooth espresso and creamy milk.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "chocolate-mocha",
    temperature: "either",
    image: "/menu/chocolate-mocha.jpg",
    name: "Chocolate Mocha",
    description: "Rich chocolate, smooth espresso, and creamy milk for the perfect sweet coffee treat.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "white-mocha",
    temperature: "either",
    image: "/menu/white-mocha.jpg",
    name: "White Mocha",
    description: "Creamy white chocolate blended with smooth espresso for a rich, velvety flavor.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "raspberry-white-mocha",
    temperature: "either",
    image: "/menu/raspberry-white-mocha.jpg",
    name: "Raspberry White Mocha",
    description: "Sweet raspberry with creamy white chocolate and rich espresso.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "caramel-macchiato",
    temperature: "either",
    image: "/menu/caramel-macchiato.jpg",
    name: "Caramel Macchiato",
    description: "Bold espresso, creamy milk, and buttery caramel — layered and smooth.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "shaken-espresso",
    temperature: "cold",
    image: "/menu/shaken-espresso.jpg",
    name: "Shaken Espresso",
    description: "Bold, refreshing, and perfectly chilled over ice for a smooth coffee experience.",
    category: "Signature Lattes",
    sizes: sizesSL(550, 600),
    modifiers: BARISTA_MODS,
  },
  {
    id: "tiramisu-latte",
    temperature: "either",
    image: "/menu/tiramisu-latte.jpg",
    name: "Tiramisu Latte",
    description: "Inspired by the Italian dessert — creamy cocoa with smooth espresso flavors.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "spanish-latte",
    temperature: "either",
    image: "/menu/spanish-latte.jpg",
    name: "Spanish Latte",
    description: "Smooth, creamy, and lightly sweetened — the perfect balanced espresso drink.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
    featured: true,
    tagline: "Sweet, silky, with steamed condensed milk. Our most-loved signature.",
  },

  // ── Coffee ──
  {
    id: "drip-coffee",
    temperature: "hot",
    image: "/menu/drip-coffee.jpg",
    name: "Drip Coffee",
    category: "Coffee",
    sizes: sizesSL(275, 300),
    modifiers: BARISTA_MODS,
  },
  {
    id: "nitro-brew",
    temperature: "cold",
    image: "/menu/nitro-brew.jpg",
    name: "Nitro Brew Coffee",
    category: "Coffee",
    sizes: sizesSL(500, 600),
    modifiers: BARISTA_MODS,
  },
  {
    id: "nitro-cold-foam",
    temperature: "cold",
    image: "/menu/nitro-cold-foam.jpg",
    name: "Nitro w/ Cold Foam",
    category: "Coffee",
    sizes: sizesSL(550, 650),
    modifiers: BARISTA_MODS,
  },

  // ── Gelato ──
  {
    id: "gelato",
    temperature: "cold",
    image: "/menu/gelato.jpg",
    name: "Gelato",
    description: "Authentic Italian-style — rich, creamy, and full of bold flavor. Ask the barista for today's flavors.",
    category: "Gelato",
    sizes: [
      { id: "small-4oz", label: "Small (4oz)", priceCents: 475 },
      { id: "medium-5oz", label: "Medium (5oz)", priceCents: 525 },
      { id: "large-8oz", label: "Large (8oz)", priceCents: 750 },
    ],
  },
  {
    id: "affogato",
    temperature: "either",
    image: u("photo-1568901346375-23c9450c58cd"),
    name: "Affogato",
    description: "A scoop of gelato drowned in a fresh espresso shot.",
    category: "Gelato",
    sizes: sizeOne(600),
  },

  // ── Tea ──
  {
    id: "chai-tea-latte",
    temperature: "either",
    image: "/menu/chai-tea-latte.jpg",
    name: "Chai Tea Latte",
    description: "Aromatic spices, black tea, and creamy steamed milk.",
    category: "Tea",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "matcha-tea-latte",
    temperature: "either",
    image: "/menu/matcha-tea-latte.jpg",
    name: "Matcha Tea Latte",
    description: "Premium matcha green tea with creamy milk — smooth and refreshing.",
    category: "Tea",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "hot-tea",
    temperature: "hot",
    image: "/menu/hot-tea.jpg",
    name: "Hot Tea",
    description: "Brewed fresh for a simple, soothing drink any time of day. Ask the barista for today's selection.",
    category: "Tea",
    sizes: sizeOne(300),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "london-fog",
    temperature: "hot",
    image: "/menu/london-fog.jpg",
    name: "London Fog",
    description: "Earl Grey tea, vanilla, and steamed milk — smooth and calming.",
    category: "Tea",
    sizes: sizesSL(400, 450),
    modifiers: BARISTA_MODS,
  },
  {
    id: "matcha-chai",
    temperature: "either",
    image: "/menu/matcha-chai.jpg",
    name: "Matcha Chai",
    description: "Earthy matcha meets warm chai spices — a bold fusion.",
    category: "Tea",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "strawberry-matcha",
    temperature: "cold",
    image: "/menu/strawberry-matcha.jpg",
    name: "Strawberry Matcha",
    description: "Sweet strawberry flavor with creamy matcha — refreshing and vibrant.",
    category: "Tea",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "raspberry-matcha",
    temperature: "cold",
    image: "/menu/raspberry-matcha.jpg",
    name: "Raspberry Matcha",
    description: "Fresh raspberry flavor with smooth matcha — bright and fruity.",
    category: "Tea",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },

  // ── Boba ──
  {
    id: "boba-caramel-macchiato",
    temperature: "cold",
    image: "/menu/boba-caramel-macchiato.jpg",
    name: "Caramel Macchiato Boba",
    description: "Rich espresso, creamy caramel, and chewy boba pearls.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-white-mocha",
    temperature: "cold",
    image: "/menu/boba-white-mocha.jpg",
    name: "White Mocha Boba",
    description: "Creamy white chocolate, smooth espresso, and soft boba pearls.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-shaken-espresso",
    temperature: "cold",
    image: "/menu/boba-shaken-espresso.jpg",
    name: "Shaken Espresso Boba",
    description: "Bold espresso, refreshing ice, and chewy boba pearls.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-spanish-latte",
    temperature: "cold",
    image: "/menu/boba-spanish-latte.jpg",
    name: "Spanish Latte Boba",
    description: "Creamy, lightly sweetened, perfectly paired with soft boba pearls.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-pumpkin-spice",
    temperature: "cold",
    image: "/menu/boba-pumpkin-spice.jpg",
    name: "Pumpkin Spice Boba",
    description: "Cozy pumpkin spice with creamy milk and chewy boba pearls.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-honey-chai",
    temperature: "cold",
    image: "/menu/boba-honey-chai.jpg",
    name: "Honey Chai Boba",
    description: "Warm chai spices, sweet honey, and chewy boba pearls.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-matcha-tea",
    temperature: "cold",
    image: "/menu/boba-matcha-tea.jpg",
    name: "Matcha Tea Boba",
    description: "Premium matcha with creamy milk and soft boba pearls.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },

  // ── Refreshing Drinks ──
  {
    id: "soda-passionfruit",
    temperature: "cold",
    image: u("photo-1597318181409-cf64d0b5d8a2"),
    name: "Passionfruit Italian Soda",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-strawberry",
    temperature: "cold",
    image: "/menu/soda-strawberry.jpg",
    name: "Strawberry Italian Soda",
    description: "Sparkling, fruity, and refreshing with sweet strawberry flavor.",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-raspberry",
    temperature: "cold",
    image: "/menu/soda-raspberry.jpg",
    name: "Raspberry Italian Soda",
    description: "Bright raspberry flavor with refreshing sparkling soda.",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-cream",
    temperature: "cold",
    image: "/menu/soda-cream.jpg",
    name: "Italian Soda w/ Cream",
    description: "Refreshing bubbles with a smooth, creamy finish.",
    category: "Refreshing Drinks",
    sizes: sizeOne(425),
  },
  {
    id: "soda-redbull",
    temperature: "cold",
    image: "/menu/soda-redbull.jpg",
    name: "Red Bull Italian Soda",
    description: "Italian soda flavors with an energizing Red Bull boost.",
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
