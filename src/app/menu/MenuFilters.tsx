import { CATEGORIES } from "@/lib/menu";

/**
 * Sticky category quick-nav for the menu page. The old All/Hot/Iced
 * temperature filter pills were removed — customers pick Hot or Iced
 * on each drink, and having both controls read as duplicates.
 */
export function MenuFilters() {
  return (
    <div className="sticky top-16 z-10 bg-cream/90 backdrop-blur -mx-4 px-4 py-3 mb-8 border-b border-espresso/10">
      <div className="flex items-center gap-1 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <a
            key={cat}
            href={`#${cat.replace(/ /g, "-")}`}
            className="shrink-0 text-sm text-espresso/70 hover:text-crema-2 px-2 py-1"
          >
            {cat}
          </a>
        ))}
      </div>
    </div>
  );
}
