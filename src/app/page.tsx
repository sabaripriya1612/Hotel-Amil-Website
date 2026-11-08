import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HeroSlider } from "@/components/home/HeroSlider";
import { HighlightCard } from "@/components/home/HighlightCard";
import { RoomCard } from "@/components/rooms/RoomCard";
import { HeroSearch } from "@/components/booking/HeroSearch";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { photoSlides } from "@/lib/images";
import { siteConfig } from "@/lib/site";
import { rooms } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Hotel Amil — Premier 3-Star Luxury Hotel in Rajapalayam, Tamil Nadu",
  description:
    "Experience 3-star hospitality at Hotel Amil Rajapalayam. Featuring deluxe & family rooms with hill-view balconies, Saffron Restaurant, swimming pool, Kings Bar, and grand banquet halls.",
};

export default function HomePage() {
  const featuredRooms = rooms.slice(0, 4);

  // Key hotel highlights: rooms, dining and celebrations (reusable HighlightCard)
  const highlights = [
    {
      title: "Rooms & Accommodation",
      description:
        "Four room categories with hill-view balconies, individual climate control, free Wi-Fi and complimentary breakfast under the CP Plan.",
      image: "/images/deluxe1.jpeg",
      badge: "4 Room Categories",
      href: "/rooms",
      ctaLabel: "Explore rooms",
    },
    {
      title: "Dining at Saffron Restaurant",
      description:
        "Relish rich Chettinad feasts, fragrant Biryanis, Tandoori grills and North Indian curries — plus professional outdoor catering available for external events.",
      image: "/images/reest.png",
      badge: "Complimentary Breakfast (CP Plan)",
      href: "/facilities/saffron-manor-restaurant",
      ctaLabel: "View restaurant & catering",
    },
    {
      title: "Celebrations & Events",
      description:
        "A fully air-conditioned banquet hall with 150+ seating, stage lighting and bespoke catering for weddings, receptions and corporate gatherings.",
      image: "/images/banhoot.png",
      badge: "150+ Seating Capacity",
      href: "/facilities/banquet-hall",
      ctaLabel: "Plan your event",
    },
  ];

  return (
    <main className="bg-[#FAF8F5] text-stone-900">
      {/* 1. Hero Dynamic Scroll Image Slider: Starts directly from bottom of header and covers the front screen */}
      <section
        id="home-hero"
        className="relative bg-[#1A1412]"
      >
        <div className="relative h-[calc(100svh-3rem)] sm:h-[calc(100svh-3.5rem)] min-h-[520px] max-h-[920px] w-full overflow-hidden bg-black">
          <HeroSlider
            slides={photoSlides}
            dotsClassName="bottom-28 sm:bottom-32 lg:bottom-28"
          />

          {/* Cinematic subtle gradient overlay */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/20 to-black/15" />

          {/* Hero Headline Overlay: Experience Comfort & Elegance in Rajapalayam (Top Left Corner) */}
          <div className="pointer-events-none absolute inset-x-0 top-5 sm:top-7 md:top-9 lg:top-10 z-20">
            <Container className="w-full">
              <div className="flex justify-start">
                <div className="inline-flex flex-col items-start text-left px-2 sm:px-0 max-w-xl">
                  {/* 3-Star Hotel Badge */}
                  <div className="mb-2 sm:mb-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-3 py-0.5 sm:px-3.5 sm:py-1 border border-[#E5A93C]/40 shadow-md">
                      <span className="text-[#E5A93C] text-[11px] sm:text-xs">★ ★ ★</span>
                      <span className="text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F5EEE6]">
                        3-Star Hotel
                      </span>
                    </span>
                  </div>

                  <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] font-medium leading-[1.2] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.92)]">
                    <span className="block text-white whitespace-nowrap">
                      Experience Comfort &amp;
                    </span>
                    <span className="block mt-1 sm:mt-1.5 whitespace-nowrap">
                      <span className="text-white">Elegance in </span>
                      <span className="text-[#E5A93C]">Rajapalayam</span>
                    </span>
                  </h1>

                  {/* Golden Luxury Divider Line with Centered Diamond Motif */}
                  <div className="mt-2.5 sm:mt-3 flex items-center gap-2 w-full max-w-xs sm:max-w-sm">
                    <div className="h-[1.5px] flex-1 bg-gradient-to-r from-[#E5A93C]/30 via-[#E5A93C] to-[#E5A93C]" />
                    <div className="h-1.5 w-1.5 rotate-45 bg-[#E5A93C] shrink-0 shadow-xs" />
                    <div className="h-[1.5px] flex-1 bg-gradient-to-l from-[#E5A93C]/30 via-[#E5A93C] to-[#E5A93C]" />
                  </div>
                </div>
              </div>
            </Container>
          </div>

          {/* Floating booking bar placed cleanly at bottom of hero */}
          <div
            id="check-availability"
            className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-0 right-0 z-30 px-3 sm:px-6 pointer-events-auto"
          >
            <div className="mx-auto max-w-4xl rounded-2xl border border-[#D8A34F]/30 bg-[#FAF7F2]/95 backdrop-blur-md p-3 sm:p-4 shadow-2xl ring-1 ring-black/5">
              <HeroSearch />
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Hotel Amil: Clean, Spacious Editorial Showcase */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF8F5]">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Story & Philosophy */}
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold tracking-[0.25em] text-[#D8A34F] uppercase">
                Welcome to Our Haven
              </p>
              <h2 className="mt-3 font-display text-3xl font-normal tracking-tight leading-snug text-[#1C1917] sm:text-4xl lg:text-[2.75rem]">
                A refined 3-star escape nestled in the foothills of Rajapalayam
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-stone-600 font-sans">
                <p>
                  Conveniently situated along Tenkasi Main Road, Hotel Amil is the landmark of
                  distinguished hospitality in Rajapalayam. Whether travelling for leisure,
                  pilgrimage, family gatherings or corporate ventures, our sanctuary unites
                  modern comforts with traditional Tamil warmth.
                </p>
                <p>
                  From peaceful hill-view balconies to immaculate swimming waters and aromatic South
                  Indian dining, every moment is crafted to ensure effortless relaxation.
                </p>
              </div>

              {/* Minimalist Editorial Trust Indicators */}
              <div className="mt-8 flex flex-wrap items-center gap-6 sm:gap-10 border-t border-[#D8A34F]/30 pt-6">
                <div>
                  <p className="font-display text-3xl sm:text-4xl font-semibold text-[#B88E3E]">84+</p>
                  <p className="mt-1 text-xs font-semibold text-[#8C6B32] uppercase tracking-wider">Rooms &amp; Suites</p>
                </div>
                <div className="hidden sm:block h-8 w-px bg-[#D8A34F]/30" />
                <div>
                  <p className="font-display text-3xl sm:text-4xl font-semibold text-[#B88E3E]">3★</p>
                  <p className="mt-1 text-xs font-semibold text-[#8C6B32] uppercase tracking-wider">Govt. Certified</p>
                </div>
                <div className="hidden sm:block h-8 w-px bg-[#D8A34F]/30" />
                <div>
                  <p className="font-display text-3xl sm:text-4xl font-semibold text-[#B88E3E]">4.7</p>
                  <p className="mt-1 text-xs font-semibold text-[#8C6B32] uppercase tracking-wider">Guest Rating</p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/rooms"
                  className="rounded-full bg-[#382314] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:bg-[#4A301D] hover:shadow-md"
                >
                  Explore Rooms
                </Link>
                <Link
                  href="/facilities"
                  className="rounded-full border border-stone-300 px-7 py-3 text-xs font-semibold uppercase tracking-wider text-stone-800 transition-all duration-300 hover:border-[#382314] hover:text-[#382314] bg-white shadow-xs"
                >
                  Hotel Facilities
                </Link>
              </div>
            </div>

            {/* Luxury Front Hero Image Frame */}
            <div className="relative lg:col-span-6">
              <div className="group relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl border border-stone-200/80 bg-stone-100">
                <Image
                  src="/images/fronthero.jpeg"
                  alt="Hotel Amil Front View and Grand Entrance in Rajapalayam"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Featured Accommodations */}
      <section className="bg-white py-16 sm:py-20 lg:py-24 border-y border-stone-200/80">
        <Container>
          <SectionTitle
            eyebrow="Accommodations"
            title="Refined comfort for every traveller"
            description="All rooms feature hill-view balconies, individual climate control, complimentary breakfast under the CP Plan, and high-speed Wi-Fi."
          />

          <div className="mt-10 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredRooms.map((room) => (
              <RoomCard key={room.slug} room={room} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 rounded-full bg-[#382314] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:bg-[#4A301D] hover:shadow-md"
            >
              <span>View All 4 Room Categories</span>
              <span aria-hidden="true" className="text-[#D8A34F]">→</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. Hotel Highlights: Rooms, Dining & Celebrations (reusable cards) */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF8F5]">
        <Container>
          <SectionTitle
            eyebrow="Hotel Highlights"
            title="Stay, dine and celebrate under one roof"
            description="From refined rooms and Saffron Restaurant dining to grand celebrations — everything you need for an effortless visit to Rajapalayam."
          />

          <div className="mt-10 sm:mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <HighlightCard key={item.href} {...item} />
            ))}
          </div>

          {/* Quick Hospitality Highlights: Amil Café Shop & Outdoor Catering */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Link
              href="/facilities/amil-cafe"
              className="group flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:border-[#382314]/40 hover:shadow-md"
            >
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                <Image
                  src="/images/cafe.png"
                  alt="Amil Café Shop"
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2">
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                    Open 24/7
                  </span>
                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs text-stone-500 font-medium">In-House Café</span>
                </div>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-[#1C1917] group-hover:text-[#382314] transition-colors">
                  Amil Café Shop
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                  In-house café serving fresh beverages and quick bites day and night, with comfortable seating and clean washroom amenities.
                </p>
                <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#382314] group-hover:text-[#4A301D] inline-flex items-center gap-1">
                  <span>Visit Café</span>
                  <span aria-hidden="true" className="text-[#D8A34F] transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>

            <Link
              href="/facilities/saffron-manor-restaurant#outdoor-catering"
              className="group flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:border-[#382314]/40 hover:shadow-md"
            >
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                <Image
                  src="/images/restaa.png"
                  alt="Outdoor Catering"
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                    Saffron Restaurant
                  </span>
                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs text-stone-500 font-medium">External Events</span>
                </div>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-[#1C1917] group-hover:text-[#382314] transition-colors">
                  Outdoor Catering
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                  Professional catering services available for external events — weddings, corporate galas, and celebrations in Rajapalayam.
                </p>
                <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#382314] group-hover:text-[#4A301D] inline-flex items-center gap-1">
                  <span>View Catering</span>
                  <span aria-hidden="true" className="text-[#D8A34F] transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/facilities"
              className="inline-flex items-center gap-2 rounded-full bg-[#382314] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:bg-[#4A301D] hover:shadow-md"
            >
              <span>Explore All Facilities &amp; Timings</span>
              <span aria-hidden="true" className="text-[#D8A34F]">→</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* 5. Clean Curated Photo Showcase (Neat, In Order, Not Cramped) */}
      <section className="bg-white py-16 sm:py-20 lg:py-24 border-t border-stone-200/80">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-[#D8A34F] uppercase">
                Visual Journey
              </p>
              <h2 className="mt-2 font-display text-3xl font-normal tracking-tight text-[#1C1917] sm:text-4xl">
                A glimpse of life at Hotel Amil
              </h2>
            </div>
            <Link
              href="/gallery"
              className="rounded-full bg-[#382314] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:bg-[#4A301D]"
            >
              Browse Full Gallery (20+ Photos) →
            </Link>
          </div>

          {/* Clean 4-card showcase with actual authentic photos in thematic order */}
          <div className="mt-10 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Grand Entrance",
                category: "Arrival",
                img: "/images/enter.png",
              },
              {
                title: "Deluxe Suite",
                category: "Accommodations",
                img: "/images/deluxe1.jpeg",
              },
              {
                title: "Saffron Restaurant",
                category: "Fine Dining",
                img: "/images/reest.png",
              },
              {
                title: "Azure Pool",
                category: "Recreation",
                img: "/images/swim1.png",
              },
            ].map((pic) => (
              <Link
                key={pic.title}
                href="/gallery"
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200/90 shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-[#382314]/40 hover:shadow-xl"
              >
                <Image
                  src={pic.img}
                  alt={pic.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition group-hover:opacity-60" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-[#D8A34F] uppercase">
                    {pic.category}
                  </p>
                  <p className="font-display text-base font-medium text-white">{pic.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Guest Reviews — Google-style rating summary with a review-card carousel */}
      <GoogleReviews />

      {/* 7. Direct Booking Guarantee Banner */}
      <section className="bg-[#FAF8F5] py-16 sm:py-20 lg:py-24 border-t border-stone-200/80">
        <Container>
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 sm:p-12 shadow-sm flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="max-w-xl">
              <span className="text-xs font-semibold tracking-[0.25em] text-[#D8A34F] uppercase">
                Best Rate Guarantee
              </span>
              <h2 className="mt-2 font-display text-2xl font-normal sm:text-3xl tracking-tight text-[#1C1917]">
                Reserve your stay directly with Hotel Amil
              </h2>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed font-sans">
                Direct bookings include complimentary breakfast, free Wi-Fi, flexible cancellation,
                and priority room allocation.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/rooms"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-2.5 font-display text-xs sm:text-[13px] font-semibold uppercase tracking-[0.16em] text-[#F0DCBE] transition-all duration-300 ease-out cursor-pointer select-none active:scale-97 shrink-0 border-[1.5px] border-[#D4A346] hover:border-[#E8B85A] hover:text-[#FFF6E9] shadow-[0_2px_8px_rgba(20,10,5,0.3),inset_0_1px_1px_rgba(255,235,180,0.18)] hover:shadow-[0_4px_14px_rgba(30,16,8,0.45),inset_0_1px_1.5px_rgba(255,235,180,0.28)]"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 25%, #3E2716 0%, #25160C 65%, #150B05 100%)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 fill-[#D4A346] transition-transform duration-300 group-hover:scale-105 group-hover:fill-[#E8B85A]"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm14 6H4v12h16V8zm-13 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"
                    />
                  </svg>
                  <span>BOOK ONLINE NOW</span>
                </span>
              </Link>
              <a
                href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`}
                className="rounded-full border border-stone-300 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-stone-800 transition-all duration-300 hover:border-[#382314] hover:text-[#382314] bg-white shadow-xs"
              >
                Call Front Desk
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}