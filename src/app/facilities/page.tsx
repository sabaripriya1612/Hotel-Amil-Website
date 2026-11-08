import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { facilities } from "@/lib/facilities";

export const metadata: Metadata = {
  title: "Facilities | Hotel Amil, Rajapalayam",
  description:
    "Explore Hotel Amil's facilities in Rajapalayam: Saffron Restaurant, Amil Café Shop, Kings Bar, swimming pool, banquet hall, conference hall and free parking.",
};

export default function FacilitiesPage() {
  return (
    <main className="bg-[#FAF8F5] text-stone-900">
      <PageHero
        eyebrow="HOTEL AMIL EXPERIENCES"
        title="Dine, Relax & Celebrate"
        description="Every Hotel Amil facility is designed around comfortable luxury — from our multi-cuisine Saffron Restaurant and 24/7 Amil Café Shop to our outdoor swimming pool, Kings Bar, and grand celebrations halls."
        variant="facilities"
        image="/images/hall.png"
        imageAlt="Hotel Amil Facilities & Event Hall"
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#explore-facilities"
            className="inline-flex items-center gap-2 rounded-full border border-[#D4A346] px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-[#F0DCBE] transition-all hover:border-[#E8B85A] hover:text-white active:scale-97 shadow-xs hover:shadow-md"
          >
            <span>Explore Facilities</span>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-[#D4A346]">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </PageHero>

      <section id="explore-facilities" className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <Link
                key={facility.slug}
                href={`/facilities/${facility.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-[#382314]/40 hover:shadow-xl"
              >
                <div className="relative overflow-hidden bg-stone-100">
                  <ImagePlaceholder
                    name={facility.image}
                    className="aspect-[4/3] transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-[#382314] px-3.5 py-1 text-xs font-semibold text-[#F5EEE6] shadow-sm border border-[#D8A34F]/40 backdrop-blur-xs">
                    {facility.tagline}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-medium text-[#1C1917] group-hover:text-[#382314] transition-colors">
                    {facility.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600 font-sans">
                    {facility.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {facility.highlights.slice(0, 3).map((h) => (
                      <span key={h} className="rounded-full bg-[#FAF8F5] px-2.5 py-1 text-xs font-medium text-stone-600 border border-stone-200/60">
                        {h}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto pt-5 text-xs font-semibold uppercase tracking-wider text-[#382314] group-hover:text-[#4A301D] inline-flex items-center gap-1.5 transition-colors">
                    <span>Learn more</span>
                    <span aria-hidden="true" className="text-[#D8A34F] transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Nearby Attractions Feature Banner */}
          <div className="mt-16 overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-8 sm:p-12 text-stone-900 shadow-xs">
            <div className="grid gap-6 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <span className="text-xs font-semibold tracking-[0.2em] text-[#B88E3E] uppercase">
                  Heritage &amp; Day Trips
                </span>
                <h2 className="mt-2 font-display text-2xl font-normal sm:text-3xl tracking-tight text-[#1C1917]">
                  Explore Nearby Temples &amp; Nature Spots
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 max-w-2xl font-sans">
                  Visit the historic Srivilliputhur Andal Temple, refreshing Ayyanar Waterfalls, Kutralam Waterfalls, Rakachi Amman Kovil, Thirumalai Kovil, Kalugumalai, Sankaran Kovil and Kasi Viswanathar Kovil — all within driving distance from Hotel Amil.
                </p>
              </div>
              <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center md:items-end">
                <Link
                  href="/attractions"
                  className="inline-flex items-center justify-center rounded-full bg-[#382314] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:bg-[#4A301D] text-center"
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