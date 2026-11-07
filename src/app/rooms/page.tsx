import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PageHero } from "@/components/ui/PageHero";
import { AvailabilitySearch } from "@/components/booking/AvailabilitySearch";
import { hotelPolicies } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rooms & Suites | Hotel Amil, Rajapalayam",
  description:
    "Executive, Deluxe and Family rooms at Hotel Amil, Rajapalayam. Real-time availability, CP Plan with continental breakfast, free cancellation up to 7 days.",
};

export default function RoomsPage() {
  return (
    <main className="bg-[#FAF8F5] text-stone-900">
      <PageHero
        eyebrow="STAY WITH US"
        title="Rooms & Suites"
        description="Four thoughtfully designed room types with hill-view balconies, all modern comforts, and signature Hotel Amil hospitality in the heart of Rajapalayam."
        variant="rooms"
      />

      <section className="pt-8 sm:pt-10 pb-12 sm:pb-16 bg-[#FAF8F5]">
        <Container>
          <AvailabilitySearch />
        </Container>
      </section>

      <section className="bg-[#FAF8F5] py-16 border-t border-stone-200/80">
        <Container>
          <SectionTitle
            eyebrow="Good to know"
            title="What your stay includes"
            align="left"
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs hover:border-[#382314]/40 hover:shadow-md transition-all duration-300">
              <h3 className="font-display text-lg font-medium tracking-tight text-[#1C1917]">{hotelPolicies.cpPlan.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 font-sans">{hotelPolicies.cpPlan.description}</p>
              <p className="mt-3 text-sm font-semibold text-[#382314]">Breakfast: {hotelPolicies.cpPlan.breakfastTime}</p>
            </div>
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs hover:border-[#382314]/40 hover:shadow-md transition-all duration-300">
              <h3 className="font-display text-lg font-medium tracking-tight text-[#1C1917]">All taxes included</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 font-sans">
                Every rate shown is per night including GST. Extra person
                accommodation is charged ₹1,050 per person per night.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs hover:border-[#382314]/40 hover:shadow-md transition-all duration-300">
              <h3 className="font-display text-lg font-medium tracking-tight text-[#1C1917]">Flexible cancellation</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 font-sans">{hotelPolicies.cancellation.note}</p>
            </div>
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-stone-700 md:grid-cols-2">
            {hotelPolicies.rules.map((rule) => (
              <li key={rule} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#382314]" />
                <span className="leading-relaxed font-sans">{rule}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  );
}