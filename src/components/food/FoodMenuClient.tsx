"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FoodCard } from "./FoodCard";
import {
  foodCategories,
  getFoodItemsByCategory,
  type FoodCategory,
} from "@/lib/foodMenu";
import { siteConfig } from "@/lib/site";

export function FoodMenuClient() {
  const [activeCategory, setActiveCategory] = useState<FoodCategory>("breakfast");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">("all");

  const activeCategoryInfo = useMemo(() => {
    return (
      foodCategories.find((cat) => cat.id === activeCategory) ?? foodCategories[0]
    );
  }, [activeCategory]);

  // Items for the selected category in the exact specified order
  const currentCategoryItems = useMemo(() => {
    return getFoodItemsByCategory(activeCategory);
  }, [activeCategory]);

  const filteredItems = useMemo(() => {
    return currentCategoryItems.filter((item) => {
      if (dietaryFilter === "all") return true;
      return item.dietary === dietaryFilter;
    });
  }, [currentCategoryItems, dietaryFilter]);

  return (
    <div className="space-y-10">
      {/* Category Navigation - Neat, aligned, understated */}
      <nav aria-label="Menu Categories" className="border-b border-stone-200/80">
        <div className="flex items-center justify-center gap-2 sm:gap-8 overflow-x-auto no-scrollbar py-1">
          {foodCategories.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setDietaryFilter("all");
                }}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-4 sm:px-6 py-3.5 font-display text-sm sm:text-base tracking-wide transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? "text-[#1C1917] font-semibold"
                    : "text-stone-500 hover:text-stone-900 font-normal"
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#382314]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Category Sub-header: Timing & Dietary Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-stone-200/60">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1C1917]">
            {activeCategoryInfo.label}
          </h2>
          <p className="mt-0.5 text-xs text-stone-500 uppercase tracking-wider font-sans font-medium">
            {activeCategoryInfo.timeNote}
          </p>
        </div>

        {/* Minimalist Dietary Filter */}
        <div className="flex items-center gap-4 text-xs font-medium text-stone-500">
          <button
            type="button"
            onClick={() => setDietaryFilter("all")}
            className={`transition-colors cursor-pointer ${
              dietaryFilter === "all"
                ? "text-[#1C1917] font-semibold underline underline-offset-4 decoration-[#382314]"
                : "hover:text-stone-800"
            }`}
          >
            All Items ({currentCategoryItems.length})
          </button>
          <span className="text-stone-300">·</span>
          <button
            type="button"
            onClick={() => setDietaryFilter("veg")}
            className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              dietaryFilter === "veg"
                ? "text-emerald-700 font-semibold underline underline-offset-4 decoration-emerald-700"
                : "hover:text-emerald-700"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Vegetarian
          </button>
          <span className="text-stone-300">·</span>
          <button
            type="button"
            onClick={() => setDietaryFilter("non-veg")}
            className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              dietaryFilter === "non-veg"
                ? "text-stone-900 font-semibold underline underline-offset-4 decoration-[#382314]"
                : "hover:text-stone-800"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B4513]" />
            Non-Vegetarian
          </button>
        </div>
      </div>

      {/* Food Cards Grid - Displays items in exact user requested order */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <FoodCard key={`${activeCategory}-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="font-display text-lg text-stone-700">
            No items available in this selection
          </p>
          <button
            type="button"
            onClick={() => setDietaryFilter("all")}
            className="mt-3 text-xs uppercase tracking-wider text-[#382314] hover:underline font-semibold cursor-pointer"
          >
            View all {activeCategoryInfo.label} dishes
          </button>
        </div>
      )}

      {/* Elegant Dining & Reservation Information Card */}
      <section className="mt-16 rounded-2xl border border-stone-200/80 bg-white p-8 sm:p-10 text-center shadow-xs">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B88E3E]">
          Saffron Restaurant
        </p>
        <h3 className="mt-2 font-display text-xl sm:text-2xl font-semibold text-[#1C1917]">
          Table Reservations &amp; Room Dining
        </h3>
        <p className="mx-auto mt-2.5 max-w-xl text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
          All dishes are freshly prepared to order by our kitchen team. Complimentary breakfast buffet is served daily from 7:30 AM to 9:30 AM under the CP Plan. For table reservations or in-room dining, kindly call our dining desk.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${siteConfig.foodDeliveryPhone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#382314] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#4A301D] shadow-xs transition-colors"
          >
            <span>Call Dining Desk: {siteConfig.foodDeliveryPhone}</span>
          </a>
          <Link
            href="/facilities/saffron-manor-restaurant"
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-stone-700 hover:border-[#382314] hover:text-[#382314] shadow-xs transition-colors"
          >
            <span>About Saffron Restaurant →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
