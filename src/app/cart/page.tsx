"use client";

import { useSyncExternalStore } from "react";
import { getCart, getCartServerSnapshot, removeFromCart, clearCart, subscribeCart } from "@/lib/cart";
import { formatCurrency, formatDate } from "@/lib/booking";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-[#FAF8F5] text-stone-900">
      <PageHero
        eyebrow="RESERVATION"
        title="Your Booking Cart"
        description="Review your selections before continuing to guest details and instant confirmation."
        variant="booking"
      />
      <section className="py-14 sm:py-16">{children}</section>
    </main>
  );
}

export default function CartPage() {
  const items = useSyncExternalStore(subscribeCart, getCart, getCartServerSnapshot);
  const total = items.reduce((sum, i) => sum + i.total, 0);

  if (items.length === 0) {
    return (
      <PageShell>
        <Container className="text-center">
          <p className="text-lg text-muted">Your cart is empty. Pick a room to get started.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href="/rooms">Browse Rooms</Button>
            <Button href="/" variant="outline">
              Back to Home
            </Button>
          </div>
        </Container>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs sm:flex-row"
              >
                <ImagePlaceholder
                  name={item.roomSlug}
                  className="aspect-[4/3] w-full overflow-hidden rounded-xl sm:w-44 sm:shrink-0"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-medium text-[#1C1917]">
                        {item.roomName}
                      </h2>
                      <p className="text-sm text-stone-500 font-sans">
                        {formatDate(item.checkIn)} → {formatDate(item.checkOut)} ·{" "}
                        {item.nights} night{item.nights > 1 ? "s" : ""}
                      </p>
                      <p className="mt-1 text-sm text-[#382314] font-medium font-sans">
                        {item.adults} adult{item.adults > 1 ? "s" : ""}
                        {item.children > 0 && `, ${item.children} child${item.children > 1 ? "ren" : ""}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 text-sm font-sans">
                    <span className="text-stone-500">
                      {formatCurrency(item.roomPrice)} × {item.nights}
                      {item.extraPersonTotal > 0 && " + extra persons"}
                    </span>
                    <span className="text-base font-bold text-[#1C1917]">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => clearCart()} className="text-sm text-stone-500 hover:text-stone-800 underline cursor-pointer">
              Clear all
            </button>
          </div>

          <aside className="h-fit rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-xs lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-medium text-[#1C1917]">Summary</h2>
            <dl className="mt-4 space-y-3 text-sm font-sans">
              <div className="flex justify-between">
                <dt className="text-stone-500">Rooms ({items.length})</dt>
                <dd className="font-medium text-stone-900">{formatCurrency(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">GST</dt>
                <dd className="font-medium text-stone-900">Included in price</dd>
              </div>
              <div className="flex justify-between border-t border-stone-100 pt-3 text-base">
                <dt className="font-semibold text-stone-900">Estimated Total</dt>
                <dd className="font-bold text-[#382314]">{formatCurrency(total)}</dd>
              </div>
            </dl>
            <Button href="/checkout" size="lg" className="mt-6 w-full">
              Proceed to Guest Details
            </Button>
            <p className="mt-3 text-center text-xs text-stone-500 font-sans">
              Free cancellation up to 7 days before check-in. GST included.
            </p>
          </aside>
        </div>
      </Container>
    </PageShell>
  );
}