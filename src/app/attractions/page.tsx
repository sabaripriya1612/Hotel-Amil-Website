import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { AttractionsExplorer } from "@/components/attractions/AttractionsExplorer";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nearby Attractions & Heritage Sites | Hotel Amil, Rajapalayam",
  description:
    "Explore iconic temples and scenic spots near Rajapalayam: Srivilliputhur Andal Temple, Ayyanar Kovil & Waterfalls, Kutralam Waterfalls, Rakachi Amman Kovil, Thirumalai Kovil, Kalugumalai, Sankaran Kovil, and Kasi Viswanathar Kovil. Easy day trips from Hotel Amil.",
};

export default function AttractionsPage() {
  return (
    <main className="bg-[#FAF8F5] min-h-screen">
      <PageHero
        eyebrow="ANNAI HERITAGE MUSEUM"
        title="Nearby Attractions"
        description="Explore the rich cultural and architectural wonders that make this destination truly special."
        variant="attractions"
      />

      {/* Main Showcase Section */}
      <section className="py-14 sm:py-16">
        <Container>
          <AttractionsExplorer />

          {/* Bottom Day Trips & Concierge Card */}
          <div className="mt-20 overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-8 sm:p-12 shadow-xs">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs font-semibold tracking-[0.2em] text-[#B88E3E] uppercase">
                  Concierge Travel Service
                </span>
                <h2 className="mt-1 font-display text-2xl font-normal sm:text-3xl lg:text-4xl text-[#1C1917]">
                  Plan your temple &amp; nature day trips with Hotel Amil
                </h2>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-stone-600 max-w-2xl font-sans">
                  Our front desk gladly assists with chauffeur-driven car rentals, optimal temple darshan
                  timings, packed breakfast for early departures, and local route guidance along Tenkasi Main Road.
                  Return each evening to unwind by our swimming pool and savor warm multi-cuisine meals at Saffron Restaurant.
                </p>
                <div className="flex flex-wrap items-center gap-5 pt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700">
                    <span className="h-2 w-2 rounded-full bg-[#382314]" /> Chauffeur car service
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700">
                    <span className="h-2 w-2 rounded-full bg-[#382314]" /> Packed tour meals available
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700">
                    <span className="h-2 w-2 rounded-full bg-[#382314]" /> Free secure parking
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3 sm:flex-row lg:flex-col justify-center">
                <Link
                  href="/contact"
                  className="w-full h-11 rounded-full bg-[#382314] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:bg-[#4A301D] hover:shadow flex items-center justify-center text-center active:scale-98"
                >
                  Inquire at Front Desk
                </Link>
                <a
                  href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`}
                  className="w-full h-11 rounded-full border border-stone-300 px-6 text-xs font-semibold uppercase tracking-wider text-stone-800 transition-all duration-300 hover:border-[#382314] hover:text-[#382314] bg-white flex items-center justify-center text-center shadow-xs"
                >
                  Call Reception
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}