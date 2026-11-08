import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { FacilityGallery } from "@/components/facilities/FacilityGallery";
import { Button } from "@/components/ui/Button";
import { getFacilityBySlug, facilities } from "@/lib/facilities";
import { facilitySlides } from "@/lib/images";
import { siteConfig } from "@/lib/site";

const featuredDishes = [
  {
    name: "Hyderabadi Dum Biryani",
    category: "Biryani & Rice",
    price: 260,
    tag: "Chef's Special",
    image: "/images/food/Chicken Biryani.jpeg",
  },
  {
    name: "Tandoori Chicken Grill",
    category: "Clay-Oven Tandoor",
    price: 290,
    tag: "Tandoor Special",
    image: "/images/food/Tandoori Chicken.jpeg",
  },
  {
    name: "Creamy Butter Chicken",
    category: "North Indian Gravy",
    price: 280,
    tag: "Most Loved",
    image: "/images/food/Butter Chicken.jpeg",
  },
  {
    name: "South Indian Tiffin Feast",
    category: "Breakfast & Tiffin",
    price: 140,
    tag: "Traditional",
    image: "/images/food/South Indian Tiffin Platter.jpeg",
  },
];

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return facilities.map((facility) => ({ slug: facility.slug }));
}

export function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return params.then(({ slug }) => {
    const facility = getFacilityBySlug(slug);
    if (!facility) return {};
    return {
      title: `${facility.name} | Hotel Amil, Rajapalayam`,
      description: facility.description,
    };
  });
}

const facilityHeroImages: Record<string, string> = {
  "saffron-manor-restaurant": "/images/reest.png",
  "banquet-hall": "/images/hall.png",
  "conference-hall": "/images/mainhall4.jpeg",
  "kings-bar": "/images/bar1.png",
  "celebrations": "/images/celebration1.jpeg",
  "reception-events": "/images/celebration1.jpeg",
  "amil-cafe": "/images/cafe.png",
  "swimming-pool": "/images/swim1.png",
  "car-parking": "/images/car-parking.png",
};

const facilityEyebrows: Record<string, string> = {
  "saffron-manor-restaurant": "FINE DINING & CUISINE",
  "banquet-hall": "GRAND WEDDINGS & CONFERENCES",
  "conference-hall": "CORPORATE MEETS & PARTIES",
  "kings-bar": "COCKTAIL LOUNGE & SPIRITS",
  "celebrations": "SPECIAL OCCASIONS & PARTIES",
  "reception-events": "SPECIAL OCCASIONS & PARTIES",
  "amil-cafe": "24/7 FRESH BEVERAGES & BITES",
  "swimming-pool": "REFRESHING OUTDOOR POOL",
  "car-parking": "SECURE PARKING FOR GUESTS",
};

export default async function FacilityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const facility = getFacilityBySlug(slug);
  if (!facility) notFound();

  const isRestaurant = facility.id === "saffron-manor-restaurant";
  const isPool = facility.id === "swimming-pool";
  const slides = facilitySlides[facility.slug] ?? [];
  const heroImage = facilityHeroImages[facility.slug] || "/images/hall.png";
  const heroEyebrow = facilityEyebrows[facility.slug] || "FACILITY & EXPERIENCE";

  return (
    <main className="bg-[#FAF8F5] text-stone-900">
      <PageHero
        eyebrow={heroEyebrow}
        title={facility.name}
        description={facility.tagline}
        variant={isRestaurant ? "restaurant" : "facilities"}
        image={heroImage}
        imageAlt={`Hotel Amil ${facility.name}`}
      >
        {isRestaurant ? (
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4A346] px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-[#F0DCBE] transition-all hover:border-[#E8B85A] hover:text-white active:scale-97 shadow-xs hover:shadow-md"
            >
              <span>Explore Food Menu</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-[#D4A346]">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </Link>
            <a
              href="#photos"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 font-sans text-xs font-medium text-[#F5EEE6] hover:bg-white/20 transition-all"
            >
              <span>View Gallery</span>
              <span>↓</span>
            </a>
          </div>
        ) : isPool ? (
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#photos"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4A346] px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-[#F0DCBE] transition-all hover:border-[#E8B85A] hover:text-white active:scale-97 shadow-xs hover:shadow-md cursor-pointer"
            >
              <span>See Pool Photos</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-[#D4A346]">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.69l3.72-3.72a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-1.06 0l-5-5a.75.75 0 111.06-1.06l3.72 3.72V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="#policies"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 font-sans text-xs font-medium text-[#F5EEE6] hover:bg-white/20 transition-all cursor-pointer"
            >
              <span>Pool Rules &amp; Timings ↓</span>
            </a>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4A346] px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-[#F0DCBE] transition-all hover:border-[#E8B85A] hover:text-white active:scale-97 shadow-xs hover:shadow-md"
            >
              <span>{facility.ctaLabel}</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-[#D4A346]">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </Link>
            <a
              href="#photos"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 font-sans text-xs font-medium text-[#F5EEE6] hover:bg-white/20 transition-all"
            >
              <span>View Photos</span>
              <span>↓</span>
            </a>
          </div>
        )}
      </PageHero>

      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              <div id="photos" className="scroll-mt-24">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88E3E]">
                      {isPool ? "Hotel Amil Pool Gallery" : `${facility.name} Gallery`}
                    </p>
                    <h2 className="font-display text-2xl font-normal text-[#1C1917]">
                      {isPool ? "Outdoor Swimming Pool Photos" : "Photo Gallery"}
                    </h2>
                  </div>
                  <span className="text-xs text-stone-500 font-sans">
                    {slides.length} Photos
                  </span>
                </div>
                <FacilityGallery name={facility.name} slides={slides} />
              </div>

              {isRestaurant && (
                <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs">
                  {/* Top Bar: Title, Description & Luxury Gold CTA Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-stone-100 pb-6">
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88E3E]">
                        Saffron Restaurant Dining
                      </p>
                      <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#1C1917]">
                        Our Food Menu
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed font-sans">
                        Savor freshly prepared North &amp; South Indian specialties, fragrant Dum Biryanis, Clay-Oven Tandoori grills, and rich curries crafted by our master chefs.
                      </p>
                    </div>

                    <Link
                      href="/menu"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D8A34F] via-[#E7B765] to-[#D8A34F] hover:from-[#C99745] hover:via-[#D8A34F] hover:to-[#C99745] px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#29180C] shadow-md hover:shadow-lg transition-all text-center border border-[#FFE6A8]/50 active:scale-98"
                    >
                      <span>View Food Menu</span>
                      <span aria-hidden="true" className="text-[#29180C]">→</span>
                    </Link>
                  </div>

                  {/* Visual Food Showcase: 4 Enticing Dish Cards */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-sans">
                        Chef&apos;s Signature Recommendations
                      </span>
                      <Link
                        href="/menu"
                        className="text-xs font-semibold text-[#B88E3E] hover:underline inline-flex items-center gap-1 font-sans"
                      >
                        <span>Explore full menu</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {featuredDishes.map((dish) => (
                        <Link
                          key={dish.name}
                          href="/menu"
                          className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white hover:border-[#D8A34F]/60 shadow-xs hover:shadow-md transition-all duration-300"
                        >
                          <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                            <Image
                              src={encodeURI(dish.image)}
                              alt={dish.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                            />
                            <span className="absolute top-2 left-2 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-semibold text-stone-800 shadow-2xs">
                              {dish.tag}
                            </span>
                            <span className="absolute bottom-2 right-2 rounded-full bg-[#382314]/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-[#E7B765] shadow-xs border border-[#D8A34F]/40">
                              ₹{dish.price}
                            </span>
                          </div>

                          <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 font-sans">
                                {dish.category}
                              </p>
                              <h4 className="mt-0.5 font-sans text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#382314] transition-colors line-clamp-1">
                                {dish.name}
                              </h4>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-[#B88E3E] group-hover:text-[#382314] transition-colors border-t border-stone-100 pt-2 font-sans">
                              <span>Touch to view</span>
                              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {isRestaurant && (
                <div id="outdoor-catering" className="rounded-2xl border border-[#D8A34F]/40 bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-5">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
                        External Event Service
                      </span>
                      <h3 className="mt-2 font-display text-2xl font-semibold text-[#1C1917]">
                        Outdoor Catering Services
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed max-w-xl">
                        Professional catering services available for external events — weddings, corporate functions, milestone anniversaries, and private parties across Rajapalayam.
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp}?text=Hi,%20I%20am%20inquiring%20about%20Outdoor%20Catering%20services%20from%20Saffron%20Restaurant%20for%20my%20event.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#382314] hover:bg-[#4A301D] text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider shadow-sm transition-all text-center"
                    >
                      Inquire for Catering →
                    </a>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3 text-left">
                    <div className="rounded-xl border border-stone-200/80 bg-[#FAF8F5] p-4">
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#B88E3E]">Weddings &amp; Receptions</p>
                      <p className="mt-1 text-xs text-stone-600 font-sans leading-relaxed">
                        Authentic South &amp; North Indian wedding feasts, live counters, and traditional sweets.
                      </p>
                    </div>
                    <div className="rounded-xl border border-stone-200/80 bg-[#FAF8F5] p-4">
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#B88E3E]">Corporate Meets</p>
                      <p className="mt-1 text-xs text-stone-600 font-sans leading-relaxed">
                        Executive lunch spreads, hot buffet stations, and tea-time refreshment counters.
                      </p>
                    </div>
                    <div className="rounded-xl border border-stone-200/80 bg-[#FAF8F5] p-4">
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#B88E3E]">Private Celebrations</p>
                      <p className="mt-1 text-xs text-stone-600 font-sans leading-relaxed">
                        Tailored menus, live tandoor skewers, and full chafing &amp; uniformed service team.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <h2 className="font-display text-2xl font-medium text-[#1C1917]">About</h2>
                <p className="mt-3 leading-relaxed text-stone-600 font-sans">{facility.description}</p>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <h2 className="font-display text-2xl font-medium text-[#1C1917]">Highlights</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {facility.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2.5 text-sm text-stone-800">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#382314]/10 text-[#382314] font-bold text-xs">
                        ✓
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {facility.policies && facility.policies.length > 0 && (
                <div id="policies" className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs scroll-mt-24">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h2 className="font-display text-2xl font-medium text-[#1C1917]">
                      {isPool ? "HOTEL AMIL — POOL RULES" : "Policies & Guidelines"}
                    </h2>
                    {isPool && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                        Night Swimming Allowed (Inform Previously)
                      </span>
                    )}
                  </div>

                  {isPool && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900 font-sans">
                      <strong className="font-semibold">Important Notice:</strong> Swimming pool access is open during daytime hours (7:00 AM – 6:30 PM). Night-time swimming is allowed provided guests inform hotel management in advance. All guests must adhere to hygiene and attire requirements.
                    </div>
                  )}

                  <ul className="mt-4 space-y-2.5 text-sm text-stone-800">
                    {facility.policies.map((p, idx) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#382314]/10 text-xs font-semibold text-[#382314]">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-medium text-[#1C1917]">Quick Info</h2>
              <dl className="mt-4 space-y-3">
                {facility.details.map((d) => (
                  <div key={d.label} className="border-b border-stone-100 pb-3">
                    <dt className="text-xs uppercase tracking-wider text-stone-500">{d.label}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-stone-900">{d.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-col gap-3">
                {isRestaurant && (
                  <Link
                    href="/menu"
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-[#D8A34F] via-[#E7B765] to-[#D8A34F] hover:from-[#C99745] hover:via-[#D8A34F] hover:to-[#C99745] active:scale-[0.98] text-[#29180C] font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 border border-[#FFE6A8]/50 text-center"
                  >
                    <span>Explore Our Menu</span>
                    <span aria-hidden="true" className="text-[#29180C]">→</span>
                  </Link>
                )}
                {isRestaurant ? (
                  <Button
                    href={`tel:${siteConfig.foodDeliveryPhone.replace(/\s/g, "")}`}
                    variant="outline"
                    className="w-full border-stone-300 text-stone-800 hover:bg-stone-50"
                  >
                    {facility.ctaLabel}
                  </Button>
                ) : isPool ? (
                  <Button href="#photos" className="w-full">
                    {facility.ctaLabel}
                  </Button>
                ) : (
                  <Button href="/contact" className="w-full">
                    {facility.ctaLabel}
                  </Button>
                )}
                <Button href="/gallery" variant="outline" className="w-full">
                  View Photos
                </Button>
              </div>
              <p className="mt-4 text-center text-xs text-stone-500">
                Hotel Amil · {siteConfig.address}
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}