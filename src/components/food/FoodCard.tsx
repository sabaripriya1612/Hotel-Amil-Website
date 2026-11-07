import Image from "next/image";
import type { FoodMenuItem } from "@/lib/foodMenu";

type FoodCardProps = {
  item: FoodMenuItem;
};

export function FoodCard({ item }: FoodCardProps) {
  const isVeg = item.dietary === "veg";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white transition-all duration-300 hover:border-stone-300 hover:shadow-md">
      {/* Consistent, equally sized image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Food Information directly below image */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {/* Subtle traditional Indian Veg / Non-Veg indicator */}
            <span
              className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[2px] border ${
                isVeg ? "border-emerald-600" : "border-[#8B4513]"
              }`}
              title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
              aria-label={isVeg ? "Vegetarian" : "Non-Vegetarian"}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isVeg ? "bg-emerald-600" : "bg-[#8B4513]"
                }`}
              />
            </span>
            <h3 className="font-display text-base sm:text-lg font-semibold text-[#1C1917] group-hover:text-[#382314] transition-colors leading-snug">
              {item.name}
            </h3>
          </div>

          {/* Food price (only displayed if actual price is available) */}
          {item.price && (
            <span className="shrink-0 font-sans text-sm font-semibold text-[#382314]">
              {item.price}
            </span>
          )}
        </div>

        {/* Short food description (if available) */}
        {item.description && (
          <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed font-sans">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}
