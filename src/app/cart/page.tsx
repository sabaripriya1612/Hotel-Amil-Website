"use client";

import { useSyncExternalStore } from "react";
import { getCart, getCartServerSnapshot, removeFromCart, clearCart, subscribeCart } from "@/lib/cart";
import { formatCurrency, formatDate } from "@/lib/booking";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-white text-stone-900">
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gold-300 uppercase">Booking</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-white">
            Your booking cart
          </h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Review your selections before continuing to guest details.
          </p>
        </Container>
      </section>
      <section className="bg-white py-14">{children}</section>
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
                className="flex flex-col gap-4 rounded-2xl border border-maroon-100 bg-white p-4 shadow-sm sm:flex-row"
              >
                <ImagePlaceholder
                  name={item.roomSlug}
                  className="aspect-[4/3] w-full overflow-hidden rounded-xl sm:w-44 sm:shrink-0"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-maroon-900">
                        {item.roomName}
                      </h2>
                      <p className="text-sm text-muted">
                        {formatDate(item.checkIn)} → {formatDate(item.checkOut)} ·{" "}
                        {item.nights} night{item.nights > 1 ? "s" : ""}
                      </p>
                      <p className="mt-1 text-sm text-maroon-800">
                        {item.adults} adult{item.adults > 1 ? "s" : ""}
                        {item.children > 0 && `, ${item.children} child${item.children > 1 ? "ren" : ""}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 text-sm">
                    <span className="text-muted">
                      {formatCurrency(item.roomPrice)} × {item.nights}
                      {item.extraPersonTotal > 0 && " + extra persons"}
                    </span>
                    <span className="text-base font-bold text-maroon-900">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => clearCart()} className="text-sm text-maroon-600 underline">
              Clear all
            </button>
          </div>

          <aside className="h-fit rounded-2xl border border-maroon-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-semibold text-maroon-900">Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Rooms ({items.length})</dt>
                <dd className="font-medium text-maroon-900">{formatCurrency(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">GST</dt>
                <dd className="font-medium text-maroon-900">Included in price</dd>
              </div>
              <div className="flex justify-between border-t border-maroon-100 pt-3 text-base">
                <dt className="font-semibold text-maroon-900">Estimated Total</dt>
                <dd className="font-bold text-gold-600">{formatCurrency(total)}</dd>
              </div>
            </dl>
            <Button href="/checkout" size="lg" className="mt-6 w-full">
              Proceed to Guest Details
            </Button>
            <p className="mt-3 text-center text-xs text-muted">
              Free cancellation up to 7 days before check-in. GST included.
            </p>
          </aside>
        </div>
      </Container>
    </PageShell>
  );
}