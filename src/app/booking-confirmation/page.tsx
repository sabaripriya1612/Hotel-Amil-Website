"use client";

import { useSyncExternalStore } from "react";
import {
  getBookings,
  getBookingsServerSnapshot,
  subscribeBookings,
  formatCurrency,
  formatDate,
} from "@/lib/booking";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

function bookingIdsFromUrl(): string[] {
  if (typeof window === "undefined") return [];
  const params = new URLSearchParams(window.location.search);
  return (params.get("ids") ?? "").split(",").filter(Boolean);
}

export default function BookingConfirmationPage() {
  const all = useSyncExternalStore(subscribeBookings, getBookings, getBookingsServerSnapshot);
  const ids = bookingIdsFromUrl();
  const isPaid = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("paid") === "true";
  const bookings = ids.length > 0 ? all.filter((b) => ids.includes(b.id)) : [];
  const total = bookings.reduce((sum, b) => sum + b.total, 0);
  const first = bookings[0];

  return (
    <main className="bg-white text-stone-900">
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container className="max-w-3xl">
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-white">Booking confirmation</h1>
        </Container>
      </section>
      <section className="bg-white py-14">
        <Container className="max-w-3xl">
        <div className="rounded-2xl border border-maroon-100 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-maroon-900">
            {isPaid ? "Payment Verified & Booking Confirmed!" : "Booking Received!"}
          </h1>
          <p className="mt-3 text-muted">
            Thank you, {first?.name ?? "guest"}. Your request has been noted and our front desk
            has secured your room reservation at Hotel Amil.
          </p>
        </div>

        {bookings.length > 0 && (
          <div className="mt-6 space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-2xl border border-maroon-100 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-maroon-900">{b.id}</h2>
                    <p className="text-sm text-muted">
                      {b.roomSlug} · {b.nights} night{b.nights > 1 ? "s" : ""} ·{" "}
                      {b.adults} adult{b.adults > 1 ? "s" : ""}
                      {b.children > 0 && `, ${b.children} child${b.children > 1 ? "ren" : ""}`}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                      b.paymentMethod === "online" || isPaid
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gold-400 text-maroon-950"
                    }`}
                  >
                    {b.paymentMethod === "online" || isPaid ? "Paid Online (Razorpay) ✓" : "Pay at Hotel"}
                  </span>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted">Dates</dt>
                    <dd className="font-medium text-maroon-900">
                      {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">Amount</dt>
                    <dd className="font-bold text-maroon-900">{formatCurrency(b.total)}</dd>
                  </div>
                  {b.specialRequests && (
                    <div className="sm:col-span-2">
                      <dt className="text-muted">Requests</dt>
                      <dd className="font-medium text-maroon-900">{b.specialRequests}</dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}

            <div className="rounded-2xl border border-maroon-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-muted">
                Total due at hotel if paying on arrival:{" "}
                <span className="font-bold text-maroon-900">{formatCurrency(total)}</span>
              </p>
              <p className="mt-2 text-xs text-muted">
                Check-in {siteConfig.checkIn} · Check-out {siteConfig.checkOut}. Free cancellation
                up to 7 days before check-in. Need help? Call{" "}
                <a className="font-medium text-gold-600" href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`}>
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