"use client";

import { useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import {
  getBookings,
  getBookingsServerSnapshot,
  subscribeBookings,
  formatDate,
  formatCurrency,
} from "@/lib/booking";
import { siteConfig } from "@/lib/site";

function bookingIdsFromUrl(): string[] {
  if (typeof window === "undefined") return [];
  const p = new URLSearchParams(window.location.search).get("ids");
  if (!p) return [];
  return p.split(",").map((s) => s.trim()).filter(Boolean);
}

export default function BookingConfirmationPage() {
  const all = useSyncExternalStore(subscribeBookings, getBookings, getBookingsServerSnapshot);
  const ids = bookingIdsFromUrl();
  const isPaid = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("paid") === "true";
  const bookings = ids.length > 0 ? all.filter((b) => ids.includes(b.id)) : [];
  const total = bookings.reduce((sum, b) => sum + b.total, 0);
  const first = bookings[0];

  return (
    <main className="bg-[#FAF8F5] text-stone-900 min-h-screen">
      <PageHero
        eyebrow="RESERVATION CONFIRMED"
        title="Booking Confirmation"
        description="Your room reservation at Hotel Amil has been recorded. Our front desk looks forward to welcoming you."
        variant="booking"
      />

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          <div className="rounded-2xl border border-stone-200/80 bg-white p-8 text-center shadow-sm">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-600">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="mt-5 font-display text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              {isPaid ? "Payment Verified & Booking Confirmed!" : "Booking Received!"}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
              Thank you, {first?.name ?? "guest"}. Your request has been recorded and our front desk
              has secured your room reservation at Hotel Amil.
            </p>
          </div>

          {bookings.length > 0 && (
            <div className="mt-6 space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-[#1C1917]">{b.id}</h3>
                      <p className="text-sm text-stone-500 font-sans mt-0.5">
                        {b.roomSlug} · {b.nights} night{b.nights > 1 ? "s" : ""} ·{" "}
                        {b.adults} adult{b.adults > 1 ? "s" : ""}
                        {b.children > 0 && `, ${b.children} child${b.children > 1 ? "ren" : ""}`}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                        b.paymentMethod === "online" || isPaid
                          ? "bg-emerald-50 border border-emerald-200/60 text-emerald-800"
                          : "bg-[#FAF8F5] border border-stone-200 text-stone-800"
                      }`}
                    >
                      {b.paymentMethod === "online" || isPaid ? "Paid Online (Razorpay) ✓" : "Pay at Hotel"}
                    </span>
                  </div>
                  <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 border-t border-stone-100 pt-4">
                    <div>
                      <dt className="text-xs text-stone-500 uppercase tracking-wider">Dates</dt>
                      <dd className="font-medium text-[#1C1917] mt-0.5">
                        {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-stone-500 uppercase tracking-wider">Amount</dt>
                      <dd className="font-bold text-[#382314] mt-0.5">{formatCurrency(b.total)}</dd>
                    </div>
                    {b.specialRequests && (
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-stone-500 uppercase tracking-wider">Requests</dt>
                        <dd className="font-medium text-stone-700 mt-0.5">{b.specialRequests}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))}

              <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
                <p className="text-sm text-stone-600">
                  Total due at hotel if paying on arrival:{" "}
                  <span className="font-bold text-[#382314] text-base">{formatCurrency(total)}</span>
                </p>
                <p className="mt-2 text-xs text-stone-500 leading-relaxed">
                  Check-in {siteConfig.checkIn} · Check-out {siteConfig.checkOut}. Free cancellation
                  up to 7 days before check-in. Need help? Call{" "}
                  <a className="font-medium text-[#382314] hover:underline" href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`}>
                    {siteConfig.phones[0]}
                  </a>
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/rooms">Book Another Room</Button>
            <Button href="/" variant="outline">
              Back to Home
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
