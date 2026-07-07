import Image from "next/image";
import Link from "next/link";
import { getFeaturedItem, formatMoney } from "@/lib/menu";

export function FeaturedDrink() {
  const item = getFeaturedItem();
  if (!item || !item.image) return null;

  const startingPrice = item.sizes[0].priceCents;

  return (
    <section className="max-w-6xl mx-auto px-4 mb-16">
      <div className="rounded-3xl overflow-hidden bg-cream-2/60 border border-espresso/5 grid md:grid-cols-2">
        <Link
          href={`/menu/${item.id}`}
          className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px] block group"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-[1.02]"
          />
        </Link>
        <div className="p-6 md:p-10 flex flex-col justify-center">
          <div className="text-xs uppercase tracking-wider text-crema-2 font-medium mb-2">
            Featured · {item.category}
          </div>
          <h2 className="display text-3xl md:text-4xl text-espresso mb-3">
            {item.name}
          </h2>
          {item.tagline ? (
            <p className="text-espresso/80 mb-4 leading-relaxed">
              {item.tagline}
            </p>
          ) : null}
          <div className="text-sm text-espresso/70 mb-5 tabular-nums">
            Starting at {formatMoney(startingPrice)}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/menu/${item.id}`}
              className="rounded-full bg-espresso text-cream px-5 py-3 font-medium hover:bg-espresso-2"
            >
              Order now →
            </Link>
            <Link
              href="/menu"
              className="rounded-full border border-espresso/20 px-5 py-3 hover:bg-cream"
            >
              See full menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
