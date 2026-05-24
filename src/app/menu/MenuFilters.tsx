"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/menu";

type TempFilter = "all" | "hot" | "cold";

const FILTER_LABELS: { key: TempFilter; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "✨" },
  { key: "hot", label: "Hot", icon: "🔥" },
  { key: "cold", label: "Iced / Cold", icon: "🧊" },
];

/**
 * Filter pills that hide menu sections + items in the DOM based on the
 * active temperature filter. We rely on data-temperature attributes
 * rendered on each card by the server.
 */
export function MenuFilters() {
  const [active, setActive] = useState<TempFilter>("all");

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-temperature]");
    items.forEach((el) => {
      const t = el.dataset.temperature ?? "either";
      const show =
        active === "all" ||
        t === active ||
        t === "either"; // either/both shown in any filter
      el.style.display = show ? "" : "none";
    });
    // Hide empty category sections
    document.querySelectorAll<HTMLElement>("[data-category-section]").forEach((sec) => {
      const visibleCards = sec.querySelectorAll<HTMLElement>(
        '[data-temperature]:not([style*="display: none"])',
      );
      sec.style.display = visibleCards.length === 0 ? "none" : "";
    });
  }, [active]);

  return (
    <div className="sticky top-16 z-10 bg-cream/90 backdrop-blur -mx-4 px-4 py-3 mb-8 border-b border-espresso/10">
      <div className="flex gap-2 overflow-x-auto">
        {FILTER_LABELS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition ${
              active === f.key
                ? "bg-espresso text-cream border-espresso"
                : "border-espresso/20 hover:bg-cream-2 text-espresso"
            }`}
          >
            <span className="mr-1">{f.icon}</span>
            {f.label}
          </button>
        ))}

        <div className="hidden sm:flex items-center gap-1 ml-2 pl-3 border-l border-espresso/15">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`#${cat.replace(/ /g, "-")}`}
              className="shrink-0 text-xs text-espresso/70 hover:text-crema-2 px-2 py-1"
            >
              {cat}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
