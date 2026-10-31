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
    "Experience 3-star hospitality at Hotel Amil Rajapalayam. Featuring deluxe & family rooms with hill-view balconies, Saffron Manor restaurant, swimming pool, Kings Bar, and grand banquet halls.",
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
      title: "Dining at Saffron Manor",
      description:
        "Relish rich Chettinad feasts, fragrant Biryanis, North Indian curries and Continental delicacies — with a complimentary breakfast buffet under the CP Plan.",
      image: "/images/reest.png",
      badge: "Complimentary Breakfast (CP Plan)",
      href: "/facilities/saffron-manor-restaurant",
      ctaLabel: "View the restaurant",
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
    <main className="bg-white text-stone-900">
      {/* 1. Hero Dynamic Scroll Image Slider: Starts directly from bottom of header and covers the front screen */}
      <section
        id="home-hero"
        className="relative pt-14 sm:pt-15 bg-white"
      >
        <div className="relative h-[calc(100svh-3.5rem)] sm:h-[calc(100svh-3.75rem)] min-h-[480px] max-h-[920px] w-full overflow-hidden bg-white">
          <HeroSlider
            slides={photoSlides}
            dotsClassName="bottom-24 sm:bottom-26 lg:bottom-24"
          />

          {/* Cinematic gradient overlays for contrast and readability */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Floating booking bar placed directly on the front screen at the dynamic scroll image bottom */}
          <div
            id="check-availability"
            className="absolute bottom-2.5 sm:bottom-3.5 lg:bottom-4 left-0 right-0 z-30 px-3 sm:px-6 pointer-events-auto"
          >
            <div className="mx-auto max-w-4xl rounded-2xl border border-stone-200 bg-white/95 backdrop-blur-md p-2 sm:p-2.5 sm:px-4 shadow-2xl">
              <HeroSearch />
            </div>
          </div>
        </div>

        {/* Accessible heading for SEO */}
        <h1 className="sr-only">Hotel Amil — Premier 3-Star Luxury Hotel in Rajapalayam</h1>
      </section>

      {/* 2. About Hotel Amil: Clean, Spacious Editorial Showcase */}
      <section className="py-10 lg:py-14 bg-white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Story & Philosophy */}
            <div className="lg:col-span-6">
              <p className="text-xs font-bold tracking-[0.25em] text-[#c0262d] uppercase">
                Welcome to Our Haven
              </p>
              <h2 className="mt-2.5 font-display text-3xl font-semibold leading-snug text-stone-900 sm:text-4xl">
                A refined 3-star escape nestled in the foothills of Rajapalayam
              </h2>
              <div className="mt-4 space-y-3.5 text-base leading-relaxed text-stone-600">
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

              {/* Stats & Trust Signals */}
              <div className="mt-6 grid grid-cols-3 gap-6 border-t border-stone-200 pt-5">
                <div>
                  <p className="font-display text-3xl font-bold text-[#c0262d]">84+</p>
                  <p className="mt-1 text-xs text-stone-500">Luxury Rooms &amp; Suites</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-[#c0262d]">3★</p>
                  <p className="mt-1 text-xs text-stone-500">Government Certified</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-[#c0262d]">4.7</p>
                  <p className="mt-1 text-xs text-stone-500">Guest Satisfaction</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <Link
                  href="/rooms"
                  className="rounded-xl bg-[#c0262d] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#a51d23]"
                >
                  Explore Rooms
                </Link>
                <Link
                  href="/facilities"
                  className="rounded-xl border-2 border-[#c0262d] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#c0262d] transition hover:bg-[#c0262d] hover:text-white bg-white shadow-sm"
                >
                  Hotel Facilities
                </Link>
              </div>
            </div>

            {/* Clean, Artistic YouTube Video Frame */}
            <div className="relative lg:col-span-6">
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-2xl border border-stone-200 bg-black">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/z4BrL1BRVtU?rel=0&modestbranding=1"
                  title="Hotel Amil Rajapalayam Video Tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>

              {/* Floating luxury badge */}
              <div className="hidden sm:block absolute -bottom-5 left-6 rounded-2xl bg-white/95 p-3.5 shadow-xl border border-stone-200 max-w-xs backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#c0262d]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Exceptional Hospitality</p>
                    <p className="text-[11px] text-stone-500">Watch our hotel video tour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Featured Accommodations */}
      <section className="bg-white py-10 lg:py-14 border-y border-stone-200">
        <Container>
          <SectionTitle
            eyebrow="Accommodations"
            title="Refined comfort for every traveller"
            description="All rooms feature hill-view balconies, individual climate control, complimentary breakfast under the CP Plan, and high-speed Wi-Fi."
          />

          <div className="mt-8 sm:mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredRooms.map((room) => (
              <RoomCard key={room.slug} room={room} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 rounded-xl bg-[#c0262d] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#a51d23]"
            >
              <span>View All 4 Room Categories</span>
              <span>→</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. Hotel Highlights: Rooms, Dining & Celebrations (reusable cards) */}
      <section className="py-10 lg:py-14 bg-white">
        <Container>
          <SectionTitle
            eyebrow="Hotel Highlights"
            title="Stay, dine and celebrate under one roof"
            description="From refined rooms and Saffron Manor dining to grand celebrations — everything you need for an effortless visit to Rajapalayam."
          />

          <div className="mt-8 sm:mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <HighlightCard key={item.href} {...item} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/facilities"
              className="inline-flex items-center gap-2 rounded-xl bg-[#c0262d] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#a51d23]"
            >
              <span>Explore All Facilities &amp; Timings</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* 5. Clean Curated Photo Showcase (Neat, In Order, Not Cramped) */}
      <section className="bg-white py-10 text-stone-900 lg:py-14 border-t border-stone-200">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-[#c0262d] uppercase">
                Visual Journey
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-stone-900 sm:text-4xl">
                A glimpse of life at Hotel Amil
              </h2>
            </div>
            <Link
              href="/gallery"
              className="rounded-xl bg-[#c0262d] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#a51d23]"
            >
              Browse Full Gallery (20+ Photos) →
            </Link>
          </div>

          {/* Clean 4-card showcase with actual authentic photos in thematic order */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                title: "Saffron Manor",
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
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200 shadow-sm"
              >
                <Image
                  src={pic.img}
                  alt={pic.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition group-hover:opacity-60" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[10px] font-bold tracking-widest text-red-300 uppercase">
                    {pic.category}
                  </p>
                  <p className="font-display text-base font-semibold text-white">{pic.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Guest Reviews — Google-style rating summary with a review-card carousel */}
      <GoogleReviews />

      {/* 7. Direct Booking Guarantee Banner */}
      <section className="bg-white py-10 lg:py-14 text-stone-900 border-t border-stone-200">
        <Container>
          <div className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="max-w-xl">
              <span className="text-xs font-bold tracking-widest text-[#c0262d] uppercase">
                Best Rate Guarantee
              </span>
              <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl text-stone-900">
                Reserve your stay directly with Hotel Amil
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                Direct bookings include complimentary breakfast, free Wi-Fi, flexible cancellation,
                and priority room allocation.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/rooms"
                className="rounded-xl bg-[#c0262d] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#a51d23]"
              >
                Book Online Now
              </Link>
              <a
                href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`}
                className="rounded-xl border-2 border-[#c0262d] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#c0262d] transition hover:bg-[#c0262d] hover:text-white bg-white shadow-sm"
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