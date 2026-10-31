import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
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
    <main className="bg-white text-stone-900">
      {/* Header */}
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gold-300 uppercase">
            Official Guidelines
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-white">
            Hotel Policies &amp; Pool Rules
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            For the comfort, well-being, and safety of all our guests, please review Hotel Amil's
            operational policies and swimming pool rules.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <div className="space-y-12">
              {/* 1. Swimming Pool Rules */}
              <article className="rounded-2xl border border-maroon-100 bg-white p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-maroon-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
                      Guest Safety &amp; Hygiene
                    </span>
                    <h2 className="mt-1 font-display text-2xl font-bold text-maroon-900 sm:text-3xl">
                      HOTEL AMIL — POOL RULES
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Daytime &amp; Night (Inform Previously)
                  </span>
                </div>

                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs leading-relaxed text-amber-900">
                  <p className="font-semibold text-sm text-amber-950">Timings: 7:00 AM – 6:30 PM (Daytime)</p>
                  <p className="mt-1">
                    Standard pool hours are 7:00 AM to 6:30 PM. <strong>Night time swimming is allowed provided guests inform the hotel management/reception in advance</strong> for safety and lighting. Access is reserved for resident hotel guests only. All guests must shower and follow the rules below.
                  </p>
                </div>

                <ol className="mt-6 space-y-3 text-sm text-maroon-950">
                  {poolFacility?.policies?.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon-100 font-sans text-xs font-bold text-maroon-900">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ol>
              </article>

              {/* 2. Check-In & Check-Out Policy */}
              <article className="rounded-2xl border border-maroon-100 bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-maroon-900">
                  Check-in &amp; Check-out
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-cream p-4">
                    <p className="text-xs uppercase tracking-wider text-muted">Check-in Time</p>
                    <p className="mt-1 font-sans text-2xl font-bold text-maroon-900">{hotelPolicies.checkInTime}</p>
                    <p className="mt-1 text-xs text-muted">Early arrival luggage holding available</p>
                  </div>
                  <div className="rounded-xl bg-cream p-4">
                    <p className="text-xs uppercase tracking-wider text-muted">Check-out Time</p>
                    <p className="mt-1 font-sans text-2xl font-bold text-maroon-900">{hotelPolicies.checkOutTime}</p>
                    <p className="mt-1 text-xs text-muted">Late checkout subject to availability</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted">
                  A government-issued photo ID (Aadhaar, Passport, Voter ID or Driving Licence) is
                  mandatory for all adults at check-in.
                </p>
              </article>

              {/* 3. CP Plan (Breakfast) & Dining Policies */}
              <article className="rounded-2xl border border-maroon-100 bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-maroon-900">
                  CP Plan — Complimentary Breakfast
                </h2>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  Every booking at Hotel Amil is offered under the Continental Plan (CP Plan). Guests
                  enjoy a complimentary hot buffet breakfast served at Saffron Manor Restaurant.
                </p>
                <div className="mt-4 rounded-xl bg-gold-50 p-4 text-xs font-medium text-gold-900">
                  Breakfast Hours: {hotelPolicies.cpPlan.breakfastTime} daily at Saffron Manor.
                </div>
              </article>

              {/* 4. Children & Extra Person Policy */}
              <article className="rounded-2xl border border-maroon-100 bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-maroon-900">
                  Children &amp; Extra Guests
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm text-maroon-900">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold-500" />
                    Children below <strong>8 years</strong> stay completely free when sharing existing bedding.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold-500" />
                    Extra guest / bed charge: <strong>₹1,050 per person per night</strong> (includes CP breakfast).
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold-500" />
                    Maximum room occupancy guidelines must be strictly adhered to.
                  </li>
                </ul>
              </article>

              {/* 5. Cancellation Policy */}
              <article className="rounded-2xl border border-maroon-100 bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-maroon-900">
                  Cancellation &amp; Refund Terms
                </h2>
                <p className="mt-3 text-sm text-muted">
                  {hotelPolicies.cancellation.note}
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800">
                    <span>{hotelPolicies.cancellation.full.label}</span>
                    <strong className="font-semibold">{hotelPolicies.cancellation.full.refund}</strong>
                  </div>
                  <div className="flex justify-between rounded-lg bg-red-50 px-3 py-2 text-red-800">
                    <span>{hotelPolicies.cancellation.late.label}</span>
                    <strong className="font-semibold">{hotelPolicies.cancellation.late.refund}</strong>
                  </div>
                </div>
              </article>

              {/* 6. General House Rules & Bar Rules */}
              <article className="rounded-2xl border border-maroon-100 bg-white p-8 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-maroon-900">
                  General House Rules
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm text-maroon-900">
                  {hotelPolicies.rules.map((rule) => (
                    <li key={rule} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-maroon-700" />
                      {rule}
                    </li>
                  ))}
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-maroon-700" />
                    <strong>Kings Bar:</strong> {hotelPolicies.barRestriction} Valid age identification required.
                  </li>
                </ul>
              </article>
            </div>

            {/* Aside Contact */}
            <aside className="h-fit rounded-2xl border border-maroon-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h3 className="font-display text-xl font-semibold text-maroon-900">Need Assistance?</h3>
              <p className="mt-2 text-sm text-muted">
                Our front desk is available 24 hours a day to clarify any question regarding your stay.
              </p>
              <div className="mt-6 space-y-3">
                <a
                  href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`}
                  className="block rounded-xl bg-[#c0262d] py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#a51d23]"
                >
                  Call Front Desk
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-emerald-600 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-500"
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
