import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { FacilityGallery } from "@/components/facilities/FacilityGallery";
import { Button } from "@/components/ui/Button";
import { getFacilityBySlug, facilities } from "@/lib/facilities";
import { facilitySlides } from "@/lib/images";
import { siteConfig } from "@/lib/site";

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

export default async function FacilityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const facility = getFacilityBySlug(slug);
  if (!facility) notFound();

  const isRestaurant = facility.id === "saffron-manor-restaurant";
  const isPool = facility.id === "swimming-pool";
  const slides = facilitySlides[facility.slug] ?? [];

  return (
    <main className="bg-white text-stone-900">
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container>
          <nav className="text-xs font-semibold uppercase tracking-widest text-white/75">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/facilities" className="hover:text-white transition-colors">Facilities</Link>
            <span className="mx-2">/</span>
            <span className="text-gold-300 font-bold">{facility.name}</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl text-white">{facility.name}</h1>
          <p className="mt-3 max-w-2xl text-white/90">{facility.tagline}</p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              <div id="photos" className="scroll-mt-24">
                <FacilityGallery name={facility.name} slides={slides} />
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-stone-900">About</h2>
                <p className="mt-3 leading-relaxed text-stone-600">{facility.description}</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-stone-900">Highlights</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {facility.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-stone-800">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#c0262d] font-bold text-xs">
                        ✓
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {facility.policies && facility.policies.length > 0 && (
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h2 className="font-display text-2xl font-semibold text-stone-900">
                      {isPool ? "HOTEL AMIL — POOL RULES" : "Policies & Guidelines"}
                    </h2>
                    {isPool && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Night Swimming Allowed (Inform Previously)
                      </span>
                    )}
                  </div>

                  {isPool && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900">
                      <strong className="font-semibold">Important Notice:</strong> Swimming pool access is open during daytime hours (7:00 AM – 6:30 PM). Night-time swimming is allowed provided guests inform hotel management in advance. All guests must adhere to hygiene and attire requirements.
                    </div>
                  )}

                  <ul className="mt-4 space-y-2.5 text-sm text-stone-800">
                    {facility.policies.map((p, idx) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-[#c0262d]">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-semibold text-stone-900">Quick Info</h2>
              <dl className="mt-4 space-y-3">
                {facility.details.map((d) => (
                  <div key={d.label} className="border-b border-stone-100 pb-3">
                    <dt className="text-xs uppercase tracking-wider text-stone-500">{d.label}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-stone-900">{d.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-col gap-3">
                {isRestaurant ? (
                  <Button href={`tel:${siteConfig.foodDeliveryPhone.replace(/\s/g, "")}`} className="w-full">
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
              <p className="mt-4 text-center text-xs text-muted">
                Hotel Amil · {siteConfig.address}
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}