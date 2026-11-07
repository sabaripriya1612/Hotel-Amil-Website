"use client";

import { attractions } from "@/lib/attractions";
import { AttractionDynamicScroll } from "./AttractionDynamicScroll";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function AttractionsExplorer() {
  return (
    <div className="space-y-12">
      {/* Quick Jump Destination Bar */}
      <div className="sticky top-16 sm:top-18 z-30 -mx-4 rounded-2xl border border-stone-200/80 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md sm:mx-0 sm:px-6">
        <div className="flex items-center justify-between gap-3 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#382314] shrink-0">
            Quick Jump ({attractions.length} Destinations):
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            {attractions.map((attraction, idx) => (
              <a
                key={attraction.id}
                href={`#${attraction.id}`}
                className="whitespace-nowrap rounded-full bg-stone-100 hover:bg-[#382314] hover:text-white px-3 py-1 text-xs font-medium text-stone-700 transition-colors"
              >
                #{idx + 1} {attraction.name.split(" ")[0]}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Attractions Showcase Cards */}
      <div className="space-y-16 sm:space-y-20">
        {attractions.map((attraction, index) => (
          <article
            key={attraction.id}
            id={attraction.id}
            className="scroll-mt-36 rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8 lg:p-10 transition-shadow hover:shadow-md"
          >
            <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Left / Gallery Column */}
              <div className="lg:col-span-6 xl:col-span-6">
                <AttractionDynamicScroll
                  name={attraction.name}
                  images={attraction.images}
                  categoryLabel={attraction.categoryLabel}
                  distance={attraction.distance}
                />
              </div>

              {/* Right / Content Column */}
              <div className="flex flex-col lg:col-span-6 xl:col-span-6 space-y-5">
                {/* Header metadata */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#FAF8F5] border border-stone-200 px-3 py-0.5 text-xs font-semibold tracking-wider text-[#B88E3E] uppercase">
                      Destination #{index + 1}
                    </span>
                    <span className="rounded-full bg-[#382314]/10 px-3 py-0.5 text-xs font-semibold text-[#382314]">
                      {attraction.distance}
                    </span>
                    <span className="rounded-full bg-stone-100 px-3 py-0.5 text-xs font-medium text-stone-700">
                      {attraction.travelTime}
                    </span>
                  </div>

                  <h2 className="mt-3 font-display text-2xl font-normal text-[#1C1917] sm:text-3xl">
                    {attraction.name}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-[#B88E3E] uppercase tracking-wider">
                    {attraction.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base leading-relaxed text-stone-600 font-sans">
                  {attraction.description}
                </p>

                {/* Timings and Entry Box */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 rounded-2xl bg-stone-50/80 p-4 border border-stone-200/80 text-xs">
                  <div>
                    <span className="font-semibold text-stone-900 block">Visiting &amp; Darshan Hours:</span>
                    <span className="text-stone-600 mt-0.5 block">{attraction.timings}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block">Entry &amp; Access:</span>
                    <span className="text-stone-600 mt-0.5 block">{attraction.entryFee}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#382314]">
                    Key Highlights
                  </h3>
                  <ul className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {attraction.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-stone-700">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#382314]/10 text-[#382314] font-bold text-[10px]">
                          ✓
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Button href="/contact" variant="primary" size="sm">
                    Book Day Cab / Concierge
                  </Button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${attraction.name} Rajapalayam Tamil Nadu`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-white px-4 py-2 text-xs font-medium text-stone-700 shadow-xs transition-all hover:border-[#382314] hover:text-[#382314]"
                  >
                    <span>Google Maps Directions</span>
                    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-[#B88E3E]" aria-hidden="true">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
