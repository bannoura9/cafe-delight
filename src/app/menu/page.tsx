import { MENU, CATEGORIES } from "@/lib/menu";
import { MenuItemCard } from "@/components/MenuItemCard";

export default function MenuPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="display text-4xl text-espresso mb-2">Menu</h1>
      <p className="text-espresso/70 mb-8">
        Tap a drink to customize and add to your order.
      </p>

      {CATEGORIES.map((cat) => (
        <section key={cat} className="mb-12">
          <h2 className="display text-2xl text-crema-2 mb-4">{cat}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MENU.filter((m) => m.category === cat).map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
