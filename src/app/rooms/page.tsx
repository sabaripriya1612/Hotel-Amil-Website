import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AvailabilitySearch } from "@/components/booking/AvailabilitySearch";
import { hotelPolicies } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rooms & Suites | Hotel Amil, Rajapalayam",
  description:
    "Executive, Deluxe and Family rooms at Hotel Amil, Rajapalayam. Real-time availability, CP Plan with continental breakfast, free cancellation up to 7 days.",
};

export default function RoomsPage() {
  return (
    <main className="bg-white text-stone-900">
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gold-300 uppercase">
            Stay with us
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-white">
            Rooms &amp; Suites
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Four thoughtfully designed room types with hill-view balconies, all modern comforts,
            and the signature Hotel Amil hospitality in the heart of Rajapalayam.
          </p>
        </Container>
      </section>

      <section className="py-14 bg-white">
        <Container>
          <AvailabilitySearch />
        </Container>
      </section>

      <section className="bg-white py-14 border-t border-stone-200">
        <Container>
          <SectionTitle
            eyebrow="Good to know"
            title="What your stay includes"
            align="left"
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-stone-900">{hotelPolicies.cpPlan.label}</h3>
              <p className="mt-2 text-sm text-stone-600">{hotelPolicies.cpPlan.description}</p>
              <p className="mt-2 text-sm font-bold text-[#c0262d]">Breakfast: {hotelPolicies.cpPlan.breakfastTime}</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-stone-900">All taxes included</h3>
              <p className="mt-2 text-sm text-stone-600">
                Every rate shown is per night including GST. Extra person
                accommodation is charged ₹1,050 per person per night.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-stone-900">Flexible cancellation</h3>
              <p className="mt-2 text-sm text-stone-600">{hotelPolicies.cancellation.note}</p>
            </div>
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-stone-700 md:grid-cols-2">
            {hotelPolicies.rules.map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c0262d]" />
                {rule}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  );
}