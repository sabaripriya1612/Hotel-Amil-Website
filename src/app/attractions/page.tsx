import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AttractionsExplorer } from "@/components/attractions/AttractionsExplorer";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nearby Attractions & Heritage Sites | Hotel Amil, Rajapalayam",
  description:
    "Explore iconic temples and scenic spots near Rajapalayam: Srivilliputhur Andal Temple, Ayyanar Kovil & Waterfalls, Kutralam Waterfalls, Rakachi Amman Kovil, Thirumalai Kovil, Kalugumalai, Sankaran Kovil, and Kasi Viswanathar Kovil. Easy day trips from Hotel Amil.",
};

export default function AttractionsPage() {
  return (
    <main className="bg-cream min-h-screen">
      {/* Page Header */}
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gold-300 uppercase">
            Sacred Heritage &amp; Nature
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-white">
            Nearby Attractions
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Explore iconic temples, scenic waterfalls, and heritage landmarks near Rajapalayam — all within easy reach of Hotel Amil.
          </p>
        </Container>
      </section>

      {/* Main Showcase Section */}
      <section className="py-12 sm:py-16">
        <Container>
          <AttractionsExplorer />

          {/* Bottom Day Trips & Concierge Card */}
          <div className="mt-20 overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs font-bold tracking-widest text-[#c0262d] uppercase">
                  Concierge Travel Service
                </span>
                <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl lg:text-4xl text-stone-900">
                  Plan your temple &amp; nature day trips with Hotel Amil
                </h2>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-stone-600 max-w-2xl">
                  Our front desk gladly assists with chauffeur-driven car rentals, optimal temple darshan
                  timings, packed breakfast for early departures, and local route guidance along Tenkasi Main Road.
                  Return each evening to unwind by our swimming pool and savor warm multi-cuisine meals at Saffron Manor.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                    <span className="h-2 w-2 rounded-full bg-[#c0262d]" /> Chauffeur car service
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                    <span className="h-2 w-2 rounded-full bg-[#c0262d]" /> Packed tour meals available
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                    <span className="h-2 w-2 rounded-full bg-[#c0262d]" /> Free secure parking
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3 sm:flex-row lg:flex-col justify-center">
                <Link
                  href="/contact"
                  className="w-full h-11 rounded-xl bg-[#c0262d] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#a51d23] flex items-center justify-center text-center active:scale-95"
                >
                  Inquire at Front Desk
                </Link>
                <a
                  href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`}
                  className="w-full h-11 rounded-xl border-2 border-[#c0262d] px-6 text-xs font-bold uppercase tracking-wider text-[#c0262d] transition hover:bg-[#c0262d] hover:text-white bg-white shadow-sm flex items-center justify-center gap-2 text-center active:scale-95"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current shrink-0" aria-hidden="true">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1.01A11.36 11.36 0 0 1 8.5 3.99c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
                  </svg>
                  <span>Call {siteConfig.phones[0]}</span>
                </a>
                <Link
                  href="/rooms"
                  className="w-full h-11 rounded-xl border-2 border-stone-300 px-6 text-xs font-bold uppercase tracking-wider text-stone-800 transition hover:border-[#c0262d] hover:text-[#c0262d] bg-white shadow-sm flex items-center justify-center text-center active:scale-95"
                >
                  Book Your Stay
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}