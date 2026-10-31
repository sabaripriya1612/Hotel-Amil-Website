import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { facilities } from "@/lib/facilities";

export const metadata: Metadata = {
  title: "Facilities | Hotel Amil, Rajapalayam",
  description:
    "Explore Hotel Amil's facilities in Rajapalayam: Saffron Manor Restaurant, Amil Cafe 24/7, Kings Bar, swimming pool, banquet hall, conference hall and free parking.",
};

export default function FacilitiesPage() {
  return (
    <main className="bg-white text-stone-900">
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gold-300 uppercase">
            Facilities
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-white">
            Dine, relax &amp; celebrate
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Every Hotel Amil facility is designed around one idea — a comfortable, enjoyable stay
            in Rajapalayam, whether you are here for a night or hosting a grand event.
          </p>
        </Container>
      </section>

      <section className="py-14 bg-white">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <Link
                key={facility.slug}
                href={`/facilities/${facility.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <ImagePlaceholder
                    name={facility.image}
                    className="aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-[#c0262d] px-3 py-1 text-xs font-bold text-white shadow-md">
                    {facility.tagline}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-semibold text-stone-900 group-hover:text-[#c0262d] transition-colors">
                    {facility.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">
                    {facility.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {facility.highlights.slice(0, 3).map((h) => (
                      <span key={h} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
                        {h}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto pt-4 text-xs font-bold uppercase tracking-wider text-[#c0262d] group-hover:text-[#a51d23]">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Nearby Attractions Feature Banner */}
          <div className="mt-16 overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 text-stone-900 shadow-sm">
            <div className="grid gap-6 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <span className="text-xs font-bold tracking-[0.2em] text-[#c0262d] uppercase">
                  Heritage &amp; Day Trips
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl text-stone-900">
                  Explore Nearby Temples &amp; Nature Spots
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 max-w-2xl">
                  Visit the historic Srivilliputhur Andal Temple, refreshing Ayyanar Waterfalls, Kutralam Waterfalls, Rakachi Amman Kovil, Thirumalai Kovil, Kalugumalai, Sankaran Kovil and Kasi Viswanathar Kovil — all within driving distance from Hotel Amil.
                </p>
              </div>
              <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center md:items-end">
                <Link
                  href="/attractions"
                  className="inline-flex items-center justify-center rounded-xl bg-[#c0262d] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#a51d23] text-center"
                >
                  View All 8 Attractions →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}