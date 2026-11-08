import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { FoodMenuClient } from "@/components/food/FoodMenuClient";

export const metadata: Metadata = {
  title: "Food Menu | Saffron Restaurant | Hotel Amil Rajapalayam",
  description:
    "Explore our delicious menu at Saffron Restaurant, Hotel Amil Rajapalayam. Breakfast, lunch, dinner, starters, and desserts freshly prepared with authentic ingredients.",
  openGraph: {
    title: "Food Menu | Saffron Restaurant | Hotel Amil",
    description:
      "Explore our freshly prepared dishes across breakfast, lunch, dinner, starters, and desserts at Saffron Restaurant, Hotel Amil Rajapalayam.",
  },
};

export default function FoodMenuPage() {
  return (
    <main className="bg-[#FAF8F5] text-stone-900 min-h-screen">
      <PageHero
        eyebrow="SAFFRON RESTAURANT"
        title="Food Menu"
        description="Freshly prepared dishes across Breakfast, Lunch, Dinner, Starters, and Desserts — featuring Biryanis, Butter Chicken, Tandoori grills, traditional halwas, and South Indian specialties."
        variant="restaurant"
      />

      {/* Main Menu Section */}
      <section className="py-8 sm:py-12">
        <Container>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/facilities/saffron-manor-restaurant"
              className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-700 shadow-2xs hover:border-[#382314] hover:text-[#382314] hover:bg-stone-50 transition-all group"
            >
              <span aria-hidden="true" className="text-[#D8A34F] transition-transform group-hover:-translate-x-1">←</span>
              <span>Back to Restaurant</span>
            </Link>

            <span className="text-xs text-stone-500 font-sans hidden sm:inline-block">
              Saffron Restaurant · Authentic Cuisine &amp; Daily Specials
            </span>
          </div>

          <FoodMenuClient />
        </Container>
      </section>
    </main>
  );
}
