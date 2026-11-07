import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig, hotelPolicies } from "@/lib/site";
import { facilities } from "@/lib/facilities";

export const metadata: Metadata = {
  title: "Hotel Policies & Swimming Pool Rules | Hotel Amil, Rajapalayam",
  description:
    "Official policies, swimming pool rules, check-in guidelines, cancellation terms, and guest safety regulations at Hotel Amil Rajapalayam.",
};

const poolFacility = facilities.find((f) => f.id === "swimming-pool");

export default function PolicyPage() {
  return (
    <main className="bg-[#FAF8F5] text-stone-900 min-h-screen">
      <PageHero
        eyebrow="OFFICIAL GUIDELINES"
        title="Hotel Policies & Pool Rules"
        description="For the comfort, well-being, and safety of all our guests, please review Hotel Amil's operational policies, check-in rules, and swimming pool guidelines."
        variant="policy"
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              {/* 1. Swimming Pool Rules */}
              <article className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88E3E]">
                      Guest Safety &amp; Hygiene
                    </span>
                    <h2 className="mt-1 font-display text-2xl font-bold text-[#1C1917] sm:text-3xl">
                      HOTEL AMIL — POOL RULES
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-3.5 py-1 text-xs font-semibold tracking-wider text-emerald-800">
                    Daytime &amp; Night (Inform Previously)
                  </span>
                </div>

                <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-950">
                  <p className="font-semibold text-sm text-amber-950">Timings: 7:00 AM – 6:30 PM (Daytime)</p>
                  <p className="mt-1 text-stone-700">
                    Standard pool hours are 7:00 AM to 6:30 PM. <strong>Night time swimming is allowed provided guests inform the hotel management/reception in advance</strong> for safety and lighting. Access is reserved for resident hotel guests only. All guests must shower and follow the rules below.
                  </p>
                </div>

                <ol className="mt-6 space-y-3.5 text-sm text-stone-700">
                  {poolFacility?.policies?.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#382314]/10 font-sans text-xs font-bold text-[#382314]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ol>
              </article>

              {/* 2. Check-In & Check-Out Policy */}
              <article className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                  Check-in &amp; Check-out
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-stone-50 border border-stone-100 p-5">
                    <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">Check-in Time</p>
                    <p className="mt-1 font-sans text-2xl font-bold text-[#382314]">{hotelPolicies.checkInTime}</p>
                    <p className="mt-1 text-xs text-stone-500">Early arrival luggage holding available</p>
                  </div>
                  <div className="rounded-xl bg-stone-50 border border-stone-100 p-5">
                    <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">Check-out Time</p>
                    <p className="mt-1 font-sans text-2xl font-bold text-[#382314]">{hotelPolicies.checkOutTime}</p>
                    <p className="mt-1 text-xs text-stone-500">Late checkout subject to availability</p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-stone-600 leading-relaxed">
                  A government-issued photo ID (Aadhaar, Passport, Voter ID or Driving Licence) is
                  mandatory for all adults at check-in.
                </p>
              </article>

              {/* 3. CP Plan (Breakfast) & Dining Policies */}
              <article className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                  CP Plan — Complimentary Breakfast
                </h2>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                  Every booking at Hotel Amil is offered under the Continental Plan (CP Plan). Guests
                  enjoy a complimentary hot buffet breakfast served at Saffron Restaurant.
                </p>
                <div className="mt-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80 p-4 text-xs font-medium text-stone-800">
                  Breakfast Hours: {hotelPolicies.cpPlan.breakfastTime} daily at Saffron Restaurant.
                </div>
              </article>

              {/* 4. Children & Extra Person Policy */}
              <article className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                  Children &amp; Extra Guests
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-stone-700">
                  <li className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#D8A34F]" />
                    Children below <strong>8 years</strong> stay completely free when sharing existing bedding.
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#D8A34F]" />
                    Extra guest / bed charge: <strong>₹1,050 per person per night</strong> (includes CP breakfast).
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#D8A34F]" />
                    Maximum room occupancy guidelines must be strictly adhered to.
                  </li>
                </ul>
              </article>

              {/* 5. Cancellation Policy */}
              <article className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                  Cancellation &amp; Refund Terms
                </h2>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                  {hotelPolicies.cancellation.note}
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between rounded-lg bg-emerald-50 px-3.5 py-2.5 text-emerald-800">
                    <span>{hotelPolicies.cancellation.full.label}</span>
                    <strong className="font-semibold">{hotelPolicies.cancellation.full.refund}</strong>
                  </div>
                  <div className="flex justify-between rounded-lg bg-amber-50 px-3.5 py-2.5 text-amber-800">
                    <span>{hotelPolicies.cancellation.late.label}</span>
                    <strong className="font-semibold">{hotelPolicies.cancellation.late.refund}</strong>
                  </div>
                </div>
              </article>

              {/* 6. General House Rules & Bar Rules */}
              <article className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                  General House Rules
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-stone-700">
                  {hotelPolicies.rules.map((rule) => (
                    <li key={rule} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#382314]" />
                      {rule}
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#382314]" />
                    <span><strong>Kings Bar:</strong> {hotelPolicies.barRestriction} Valid age identification required.</span>
                  </li>
                </ul>
              </article>

              {/* 7. Privacy Policy */}
              <article id="privacy" className="scroll-mt-24 rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
                <div className="border-b border-stone-100 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88E3E]">
                    Legal &amp; Compliance
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-[#1C1917]">
                    Privacy Policy
                  </h2>
                </div>
                <div className="mt-4 space-y-3 text-sm text-stone-600 leading-relaxed font-sans">
                  <p>
                    Hotel Amil respects your privacy and is committed to protecting your personal information. When you book a room, dine at Saffron Restaurant, or contact our team, we collect necessary guest details (such as your name, contact phone, email, and government ID details) strictly for statutory guest registration, reservation processing, and ensuring personalized hospitality.
                  </p>
                  <p>
                    We implement industry-standard encryption and security protocols to safeguard your payment and contact data. We never sell, rent, or trade guest personal information to unauthorized third parties. For questions regarding your personal information, please contact our front desk at <a href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`} className="font-medium text-[#382314] underline">{siteConfig.phones[0]}</a>.
                  </p>
                </div>
              </article>

              {/* 8. Terms & Conditions */}
              <article id="terms" className="scroll-mt-24 rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
                <div className="border-b border-stone-100 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88E3E]">
                    Reservation Agreement
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-[#1C1917]">
                    Terms &amp; Conditions
                  </h2>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-stone-700 leading-relaxed font-sans">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#382314] shrink-0 mt-2" />
                    <span><strong>Reservation Guarantee:</strong> Confirmed reservations are held until midnight of the arrival date. Advance payment or card pre-authorization is required to guarantee booking.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#382314] shrink-0 mt-2" />
                    <span><strong>Identification Requirements:</strong> All guests above 18 must present valid government photo identification (Aadhaar, Passport, Voter ID or Driving Licence) at check-in. PAN cards are not accepted as proof of address.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#382314] shrink-0 mt-2" />
                    <span><strong>Occupancy &amp; Extra Person:</strong> Room tariffs are based on base room occupancy. Extra adult charges apply for additional occupants, which include complimentary breakfast under the CP Plan.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#382314] shrink-0 mt-2" />
                    <span><strong>Guest Conduct &amp; Property:</strong> Guests are expected to maintain decorum and respect hotel property. Any damage caused to hotel property, linens, or fixtures will be charged to the guest&apos;s folio upon checkout.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#382314] shrink-0 mt-2" />
                    <span><strong>Jurisdiction:</strong> All disputes and claims arising from reservations or services at Hotel Amil are subject to the exclusive jurisdiction of the competent courts in Rajapalayam, Tamil Nadu, India.</span>
                  </li>
                </ul>
              </article>
            </div>

            {/* Aside Contact */}
            <aside className="h-fit rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h3 className="font-display text-xl font-semibold text-[#1C1917]">Need Assistance?</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                Our front desk is available 24 hours a day to clarify any question regarding your stay.
              </p>
              <div className="mt-6 space-y-3">
                <a
                  href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`}
                  className="block rounded-full bg-[#382314] py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-sm transition hover:bg-[#4A301D]"
                >
                  Call Front Desk
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-full bg-emerald-600 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-emerald-700"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}
