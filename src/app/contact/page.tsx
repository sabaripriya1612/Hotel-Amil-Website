import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig, hotelPolicies } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us | Hotel Amil, Rajapalayam",
  description:
    "Reach Hotel Amil in Rajapalayam — phone, WhatsApp, address and directions. Reservations, restaurant, events and grievance contact details.",
};

const contactBlocks = [
  {
    title: "Reservations & Enquiries",
    lines: [
      { label: "Phone", value: siteConfig.phones[0] },
      { label: "Phone", value: siteConfig.phones[1] },
      { label: "Email", value: siteConfig.email },
    ],
  },
  {
    title: "Restaurant & Table Reservation",
    lines: [{ label: "Phone", value: siteConfig.foodDeliveryPhone }],
  },
  {
    title: "Grievance / Feedback",
    lines: [{ label: "Phone", value: siteConfig.grievancePhone }],
  },
];

export default function ContactPage() {
  return (
    <main className="bg-[#FAF8F5] text-stone-900">
      <PageHero
        eyebrow="RESERVATIONS & HOSPITALITY"
        title="We Would Love to Hear From You"
        description="Whether it is a room for tonight, a table for lunch or a grand celebration — our reservations desk and concierge in Rajapalayam are ready to assist 24/7."
        variant="contact"
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <ContactForm />

            <aside className="space-y-5">
              {contactBlocks.map((block) => (
                <div key={block.title} className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs">
                  <h3 className="font-display text-lg font-medium text-[#1C1917]">{block.title}</h3>
                  <ul className="mt-3.5 space-y-2.5 text-sm font-sans">
                    {block.lines.map((line) => (
                      <li key={line.value} className="flex items-baseline gap-2">
                        <span className="w-14 shrink-0 text-xs uppercase tracking-wider text-stone-500">
                          {line.label}
                        </span>
                        <a
                          href={`tel:${line.value.replace(/\s/g, "")}`}
                          className="font-semibold text-stone-800 hover:text-[#382314] transition-colors"
                        >
                          {line.value}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs">
                <h3 className="font-display text-lg font-medium text-[#1C1917]">Address</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600 font-sans">{siteConfig.address}</p>
                <p className="mt-2 text-xs text-stone-500 font-sans">
                  Check-in {hotelPolicies.checkInTime} · Check-out {hotelPolicies.checkOutTime} ·
                  Front desk open 24 hours · Free parking
                </p>
                <a
                  href={siteConfig.mapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#382314] hover:underline"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 11.5 7.3 11.8a1 1 0 0 0 1.4 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                  Get directions on Google Maps
                </a>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs text-stone-900">
                <h3 className="font-display text-lg font-medium text-[#1C1917]">Good to know</h3>
                <ul className="mt-3 space-y-2 text-sm text-stone-600 font-sans">
                  <li>• {hotelPolicies.freeChildNote}</li>
                  <li>• Free cancellation up to 7 days before check-in</li>
                  <li>• Amil Cafe open 24/7 for coffee &amp; snacks</li>
                  <li>• {hotelPolicies.barRestriction}</li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Embedded Google Map of the hotel location */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-6 py-4">
              <div>
                <p className="font-display text-lg font-medium text-[#1C1917]">
                  Find us on the map
                </p>
                <p className="mt-0.5 text-xs text-stone-500 font-sans">{siteConfig.address}</p>
              </div>
              <a
                href={siteConfig.mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-wider text-[#382314] hover:underline"
              >
                Get directions →
              </a>
            </div>
            <iframe
              title={`Map of ${siteConfig.name}, ${siteConfig.city}`}
              src={siteConfig.mapsEmbed}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full border-0 sm:h-96"
            />
          </div>
        </Container>
      </section>
    </main>
  );
}