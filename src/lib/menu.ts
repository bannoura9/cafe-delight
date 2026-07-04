export type Modifier = {
  id: string;
  name: string;
  priceCents: number;
};

// Hot/Iced is captured as a zero-price modifier so it flows automatically into
// the cart, the saved order, and — crucially — the Clover receipt line (which
// already appends modifier names to the item, e.g. "Latte — Iced, Oat milk").
export const TEMP_HOT: Modifier = { id: "temp-hot", name: "Hot", priceCents: 0 };
export const TEMP_ICED: Modifier = { id: "temp-iced", name: "Iced", priceCents: 0 };
export function tempModifier(t: "hot" | "iced"): Modifier {
  return t === "iced" ? TEMP_ICED : TEMP_HOT;
}

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
    description: "A double shot of our house espresso — dark, syrupy, and intense, with a caramel-brown crema on top. The purest way to taste our beans, and the base for every espresso drink we make.",
    category: "Espresso",
    sizes: sizesSL(200, 300),
    modifiers: FLAVOR_OPTIONS,
  },
  {
    id: "americano",
    temperature: "either",
    image: "/menu/americano.jpg",
    name: "Americano",
    description: "Two shots of espresso lengthened with hot water for a clean, full-bodied black coffee — smoother and less bitter than drip. Order it hot to start the morning or over ice for an easy afternoon lift.",
    category: "Espresso",
    sizes: sizesSL(350, 400),
    modifiers: BARISTA_MODS,
  },
  {
    id: "cortado",
    temperature: "hot",
    image: "/menu/cortado.jpg",
    name: "Cortado",
    description: "Equal parts espresso and lightly steamed milk, served short so the coffee still leads. Silky and balanced, never too milky — a favorite of regulars who find a full latte too heavy.",
    category: "Espresso",
    sizes: sizeOne(350),
    modifiers: BARISTA_MODS,
  },
  {
    id: "latte",
    temperature: "either",
    image: "/menu/latte.jpg",
    name: "Latte",
    description: "A double shot of espresso under steamed milk and a thin layer of microfoam — creamy, mellow, and endlessly customizable with your choice of milk and flavor. Our most popular everyday cup, hot or iced.",
    category: "Espresso",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "breve-latte",
    temperature: "hot",
    image: "/menu/breve-latte.jpg",
    name: "Breve Latte",
    description: "A latte made with steamed half-and-half instead of milk, for a noticeably richer, dessert-like body. Indulgent and velvety — the one to order when you want a treat, not just a coffee.",
    category: "Espresso",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "honey-latte",
    temperature: "either",
    image: "/menu/honey-latte.jpg",
    name: "Honey Latte",
    description: "Real organic honey stirred into nutty espresso and creamy steamed milk for a naturally sweet, lightly floral latte. No syrups — just honey doing the work, hot or iced.",
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
    description: "Real pumpkin-spice flavor with cinnamon and nutmeg over espresso and steamed milk — cozy and warming. Great hot on a cold Parker morning, or iced when the afternoon warms up.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "chocolate-mocha",
    temperature: "either",
    image: "/menu/chocolate-mocha.jpg",
    name: "Chocolate Mocha",
    description: "Rich chocolate melted into espresso and steamed milk, topped however you like it. The perfect middle ground between a coffee and a hot chocolate — a crowd-pleaser for all ages.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "white-mocha",
    temperature: "either",
    image: "/menu/white-mocha.jpg",
    name: "White Mocha",
    description: "Sweet, creamy white chocolate blended with a double shot of espresso and steamed milk. Smooth and dessert-like without being overpowering — a longtime customer favorite, hot or iced.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "raspberry-white-mocha",
    temperature: "either",
    image: "/menu/raspberry-white-mocha.jpg",
    name: "Raspberry White Mocha",
    description: "Our white mocha with a swirl of tart raspberry to cut the sweetness and add a fruity finish. Bright, pink, and photo-ready — especially good iced.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "caramel-macchiato",
    temperature: "either",
    image: "/menu/caramel-macchiato.jpg",
    name: "Caramel Macchiato",
    description: "Vanilla and steamed milk marked with a double shot of espresso, then finished with a lattice of buttery caramel. Sweet on top, bold underneath — a layered classic done right, hot or iced.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "shaken-espresso",
    temperature: "cold",
    image: "/menu/shaken-espresso.jpg",
    name: "Shaken Espresso",
    description: "Espresso shaken hard with brown-sugar cinnamon and ice, then topped with a splash of oat milk. Bright, lightly sweet, and energizing — our go-to iced pick-me-up.",
    category: "Signature Lattes",
    sizes: sizesSL(550, 600),
    modifiers: BARISTA_MODS,
  },
  {
    id: "tiramisu-latte",
    temperature: "either",
    image: "/menu/tiramisu-latte.jpg",
    name: "Tiramisu Latte",
    description: "Inspired by the Italian dessert: espresso, cocoa, and a mascarpone-style cream for a smooth, chocolatey latte. A little indulgent, a lot delicious — hot or iced.",
    category: "Signature Lattes",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "spanish-latte",
    temperature: "either",
    image: "/menu/spanish-latte.jpg",
    name: "Spanish Latte",
    description: "Espresso and steamed milk sweetened with condensed milk for a silky, caramel-sweet cup. Our most-loved signature — just as good hot or iced.",
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
    description: "Our house beans, freshly ground and slowly brewed for a clean, balanced everyday cup. Simple, dependable, and the fastest way out the door.",
    category: "Coffee",
    sizes: sizesSL(275, 300),
    modifiers: BARISTA_MODS,
  },
  {
    id: "nitro-brew",
    temperature: "cold",
    image: "/menu/nitro-brew.jpg",
    name: "Nitro Brew Coffee",
    description: "Cold brew infused with nitrogen and poured on tap for a smooth, creamy body and a cascading, beer-like head — no milk or sugar needed. Naturally sweet, low-acid, and served cold.",
    category: "Coffee",
    sizes: sizesSL(500, 600),
    modifiers: BARISTA_MODS,
  },
  {
    id: "nitro-cold-foam",
    temperature: "cold",
    image: "/menu/nitro-cold-foam.jpg",
    name: "Nitro w/ Cold Foam",
    description: "Our nitro cold brew crowned with house-made cold foam for an extra-creamy, dessert-like finish. Rich, smooth, and impossible to put down.",
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
    description: "Authentic Italian-style gelato made in small batches with locally sourced dairy and eggs, real fresh fruit, and imported Italian ingredients — denser and creamier than ice cream. Ask your barista for today's rotating flavors.",
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
    image: "/menu/affogato.jpg",
    name: "Affogato",
    description: "A scoop of our gelato \"drowned\" in a fresh, hot shot of espresso — part dessert, part coffee. Pour it over, watch it melt, and enjoy the warm-meets-cold contrast.",
    category: "Gelato",
    sizes: sizeOne(600),
  },

  // ── Tea ──
  {
    id: "chai-tea-latte",
    temperature: "either",
    image: "/menu/chai-tea-latte.jpg",
    name: "Chai Tea Latte",
    description: "Spiced black tea simmered with cinnamon, cardamom, and ginger, then finished with steamed milk. Warming and aromatic — comforting hot, refreshing iced.",
    category: "Tea",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "matcha-tea-latte",
    temperature: "either",
    image: "/menu/matcha-tea-latte.jpg",
    name: "Matcha Tea Latte",
    description: "Stone-ground premium matcha whisked with milk for an earthy, subtly sweet green-tea latte with a gentle, steady lift. Vibrant green and just as good iced.",
    category: "Tea",
    sizes: sizesSL(450, 500),
    modifiers: BARISTA_MODS,
  },
  {
    id: "hot-tea",
    temperature: "hot",
    image: "/menu/hot-tea.jpg",
    name: "Hot Tea",
    description: "A soothing cup of freshly brewed loose-leaf tea, perfect any time of day. Ask your barista for today's selection of blends.",
    category: "Tea",
    sizes: sizeOne(300),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "london-fog",
    temperature: "hot",
    image: "/menu/london-fog.jpg",
    name: "London Fog",
    description: "Earl Grey steeped with vanilla (or lavender) and topped with steamed milk for a calming, lightly floral tea latte. Elegant and comforting on a slow morning.",
    category: "Tea",
    sizes: sizesSL(400, 450),
    modifiers: BARISTA_MODS,
  },
  {
    id: "matcha-chai",
    temperature: "either",
    image: "/menu/matcha-chai.jpg",
    name: "Matcha Chai",
    description: "Earthy matcha layered with spiced chai, ginger, lavender, and honey — a bold, unexpected fusion you won't find just anywhere. For the adventurous tea drinker.",
    category: "Tea",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "strawberry-matcha",
    temperature: "cold",
    image: "/menu/strawberry-matcha.jpg",
    name: "Strawberry Matcha",
    description: "Creamy iced matcha poured over a layer of real strawberry for a sweet, fruity twist on the classic. As pretty as it is refreshing.",
    category: "Tea",
    sizes: sizesSL(500, 550),
    modifiers: BARISTA_MODS,
  },
  {
    id: "raspberry-matcha",
    temperature: "cold",
    image: "/menu/raspberry-matcha.jpg",
    name: "Raspberry Matcha",
    description: "Iced matcha with a swirl of tart raspberry — a brighter, punchier take for anyone who finds strawberry too sweet. Can't decide? Get both layered together.",
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
    description: "Our caramel macchiato — espresso, vanilla, and buttery caramel — poured over chewy tapioca pearls cooked fresh daily. Iced, sweet, and fun to sip.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-white-mocha",
    temperature: "cold",
    image: "/menu/boba-white-mocha.jpg",
    name: "White Mocha Boba",
    description: "Creamy white chocolate and espresso poured over soft, fresh-cooked boba pearls. Sweet, playful, and one of our most popular iced treats.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-shaken-espresso",
    temperature: "cold",
    image: "/menu/boba-shaken-espresso.jpg",
    name: "Shaken Espresso Boba",
    description: "Brown-sugar shaken espresso with oat milk over chewy tapioca pearls, served cold. Lightly sweet, caffeinated, and endlessly sippable.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-spanish-latte",
    temperature: "cold",
    image: "/menu/boba-spanish-latte.jpg",
    name: "Spanish Latte Boba",
    description: "Our silky, condensed-milk Spanish latte over soft boba pearls. Smooth, sweet, and satisfying over ice.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-pumpkin-spice",
    temperature: "cold",
    image: "/menu/boba-pumpkin-spice.jpg",
    name: "Pumpkin Spice Boba",
    description: "Cozy pumpkin-spice latte flavors, iced and poured over chewy boba pearls. A seasonal favorite with a fun twist.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-honey-chai",
    temperature: "cold",
    image: "/menu/boba-honey-chai.jpg",
    name: "Honey Chai Boba",
    description: "Spiced chai sweetened with real honey over soft tapioca pearls. Warming spice, cool and chewy — comforting in every sip.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },
  {
    id: "boba-matcha-tea",
    temperature: "cold",
    image: "/menu/boba-matcha-tea.jpg",
    name: "Matcha Tea Boba",
    description: "Earthy premium matcha with milk over fresh-cooked boba pearls. Vibrant, refreshing, and made for matcha lovers.",
    category: "Boba",
    sizes: sizeOne(600),
    modifiers: MILK_OPTIONS,
  },

  // ── Refreshing Drinks ──
  {
    id: "soda-passionfruit",
    temperature: "cold",
    image: "/menu/soda-passionfruit.jpg",
    name: "Passionfruit Italian Soda",
    description: "Sparkling Italian soda with bright, tropical passionfruit — tart, fizzy, and thirst-quenching over ice. A caffeine-free way to cool off.",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-strawberry",
    temperature: "cold",
    image: "/menu/soda-strawberry.jpg",
    name: "Strawberry Italian Soda",
    description: "Sparkling Italian soda with sweet, ripe strawberry flavor over ice. Refreshing, fun, and family-friendly.",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-raspberry",
    temperature: "cold",
    image: "/menu/soda-raspberry.jpg",
    name: "Raspberry Italian Soda",
    description: "Sparkling Italian soda with tart-sweet raspberry over ice. Crisp, bubbly, and caffeine-free.",
    category: "Refreshing Drinks",
    sizes: sizeOne(400),
  },
  {
    id: "soda-cream",
    temperature: "cold",
    image: "/menu/soda-cream.jpg",
    name: "Italian Soda w/ Cream",
    description: "Any of our Italian sodas finished with a splash of cream for a smooth, creamsicle-like twist. Fizzy, sweet, and dessert-adjacent.",
    category: "Refreshing Drinks",
    sizes: sizeOne(425),
  },
  {
    id: "soda-redbull",
    temperature: "cold",
    image: "/menu/soda-redbull.jpg",
    name: "Red Bull Italian Soda",
    description: "Your favorite Italian soda flavor mixed with Red Bull for a fizzy, fruity energy boost. The afternoon pick-me-up for when coffee won't cut it.",
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
