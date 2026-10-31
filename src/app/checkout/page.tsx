"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCart,
  getCartServerSnapshot,
  clearCart,
  subscribeCart,
} from "@/lib/cart";
import { createBookingAsync, formatCurrency } from "@/lib/booking";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useSyncExternalStore(subscribeCart, getCart, getCartServerSnapshot);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    paymentMethod: "pay_at_hotel" as "online" | "pay_at_hotel",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.total, 0), [items]);
  const gstVisible = useMemo(() => items.reduce((sum, i) => sum + i.gst * i.nights, 0), [items]);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please enter your full name.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email.";
    if (!form.phone.trim() || !/^[+\d][\d\s-]{8,}$/.test(form.phone)) next.phone = "Please enter a valid phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeBooking = async () => {
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
    if (!validate()) return;

    setPlacing(true);
    setPaymentNotice(null);

    // Flow 1: Online Payment via Razorpay
    if (form.paymentMethod === "online") {
      try {
        const firstItem = items[0];
        // 1. Create Order on Server
        const orderRes = await fetch("/api/payments/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomSlug: firstItem.roomSlug,
            checkIn: firstItem.checkIn,
            checkOut: firstItem.checkOut,
            adults: firstItem.adults,
            children: firstItem.children,
            childrenUnder8: firstItem.childrenUnder8,
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.success) {
          setPaymentNotice(orderData.error || "Unable to initiate payment order.");
          setPlacing(false);
          return;
        }

        // 2. Load Razorpay Client SDK
        const scriptLoaded = await loadRazorpayScript();

        // 3. Handle Live / Test Razorpay Modal
        if (scriptLoaded && window.Razorpay && !orderData.isMock) {
          const rzp = new window.Razorpay({
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency || "INR",
            name: "Hotel Amil",
            description: `Room Reservation (${firstItem.roomName || firstItem.roomSlug})`,
            order_id: orderData.orderId,
            prefill: {
              name: form.name.trim(),
              email: form.email.trim(),
              contact: form.phone.trim(),
            },
            theme: { color: "#7b1626" },
            handler: async function (response: any) {
              // 4. Cryptographic Verification
              const verifyRes = await fetch("/api/payments/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  booking: {
                    roomSlug: firstItem.roomSlug,
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    checkIn: firstItem.checkIn,
                    checkOut: firstItem.checkOut,
                    adults: firstItem.adults,
                    children: firstItem.children,
                    childrenUnder8: firstItem.childrenUnder8,
                    specialRequests: form.specialRequests.trim() || undefined,
                  },
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                clearCart();
                router.push(`/booking-confirmation?ids=${verifyData.booking.id}&paid=true`);
              } else {
                setPaymentNotice(verifyData.error || "Payment verification failed.");
                setPlacing(false);
              }
            },
            modal: {
              ondismiss: () => setPlacing(false),
            },
          });

          rzp.open();
          return;
        }

        // 4. Developer / Sandbox Simulation Mode (when real merchant keys not yet added)
        const simPaymentId = `pay_sim_${Date.now()}`;
        const simSig = `sig_sim_${Date.now()}`;

        const verifyRes = await fetch("/api/payments/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: simPaymentId,
            razorpay_signature: simSig,
            booking: {
              roomSlug: firstItem.roomSlug,
              name: form.name.trim(),
              email: form.email.trim(),
              phone: form.phone.trim(),
              checkIn: firstItem.checkIn,
              checkOut: firstItem.checkOut,
              adults: firstItem.adults,
              children: firstItem.children,
              childrenUnder8: firstItem.childrenUnder8,
              specialRequests: form.specialRequests.trim() || undefined,
            },
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          clearCart();
          router.push(`/booking-confirmation?ids=${verifyData.booking.id}&paid=true`);
        } else {
          setPaymentNotice(verifyData.error || "Simulated payment verification failed.");
          setPlacing(false);
        }
      } catch (err: any) {
        setPaymentNotice(err.message || "Failed to process online payment.");
        setPlacing(false);
      }
      return;
    }

    // Flow 2: Pay on Arrival (Pay at Hotel)
    const ids: string[] = [];

    for (const item of items) {
      const res = await createBookingAsync({
        roomSlug: item.roomSlug,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        checkIn: item.checkIn,
        checkOut: item.checkOut,
        adults: item.adults,
        children: item.children,
        childrenUnder8: item.childrenUnder8,
        specialRequests: form.specialRequests.trim() || undefined,
        paymentMethod: "pay_at_hotel",
      });
      if (res.ok && res.booking) ids.push(res.booking.id);
    }

    clearCart();
    if (ids.length > 0) {
      router.push(`/booking-confirmation?ids=${ids.join(",")}`);
    } else {
      setPlacing(false);
    }
  };

  const fieldCls =
    "w-full rounded-xl border border-maroon-800/15 bg-white px-4 py-3 text-sm text-maroon-900 outline-none transition-colors focus:border-gold-500";

  if (items.length === 0) {
    return (
      <main className="bg-white text-stone-900">
        <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
          <Container>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-white">Guest details</h1>
          </Container>
        </section>
        <section className="bg-white py-14">
          <Container className="text-center">
            <p className="text-lg text-stone-600">Nothing to check out — your cart is empty.</p>
            <div className="mt-8 flex justify-center">
              <Button href="/rooms">Browse Rooms</Button>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white text-stone-900">
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gold-300 uppercase">Booking</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-white">
            Guest details &amp; payment
          </h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Complete these details and we will hold your room on arrival.
          </p>
        </Container>
      </section>
      <section className="bg-white py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <form
            className="space-y-6 rounded-2xl border border-maroon-100 bg-white p-6 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              placeBooking();
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-maroon-900">Full name *</label>
                <input
                  className={fieldCls}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="As per government ID"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-maroon-900">Email *</label>
                <input
                  type="email"
                  className={fieldCls}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-maroon-900">Mobile number *</label>
                <input
                  type="tel"
                  className={fieldCls}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-maroon-900">Special requests (optional)</label>
                <textarea
                  className={`${fieldCls} min-h-24 resize-y`}
                  value={form.specialRequests}
                  onChange={(e) => set("specialRequests", e.target.value)}
                  placeholder="Early arrival, extra pillows, celebration, etc."
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-maroon-900">How would you like to pay?</p>
              <div className="grid gap-3 sm:grid-cols-2">
{(
                  [
                    {
                      value: "pay_at_hotel",
                      label: "Pay at Hotel",
                      desc: "Pay on arrival at the front desk via Cash, Card, or UPI QR code.",
                      badge: "Recommended",
                    },
                    {
                      value: "online",
                      label: "Pay Online (UPI / Cards)",
                      desc: "Google Pay, PhonePe, Paytm, Cards & NetBanking via Razorpay secure checkout.",
                      badge: "Instant Confirmation",
                    },
                  ] as { value: "pay_at_hotel" | "online"; label: string; desc: string; badge?: string }[]
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("paymentMethod", opt.value)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      form.paymentMethod === opt.value
                        ? "border-gold-500 bg-gold-400/10 shadow-sm"
                        : "border-maroon-100 hover:border-maroon-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-maroon-900">{opt.label}</span>
                      {opt.badge && (
                        <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold uppercase text-maroon-950">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {paymentNotice && (
              <div className="rounded-xl border border-red-500/30 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
                {paymentNotice}
              </div>
            )}

            <Button type="submit" size="lg" disabled={placing} className="w-full">
              {placing
                ? "Processing your reservation…"
                : form.paymentMethod === "online"
                ? `Pay Online Now · ${formatCurrency(total)}`
                : `Confirm Booking · ${formatCurrency(total)}`}
            </Button>
            <p className="text-center text-xs text-muted">
              Reservations are instantly registered and confirmed. Choose UPI/Card for fast confirmation or pay at front desk on arrival.
            </p>
          </form>

          <aside className="h-fit rounded-2xl border border-maroon-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-semibold text-maroon-900">Your stay</h2>
            <ul className="mt-4 space-y-4">
              {items.map((item) => (
                <li key={item.id} className="border-b border-maroon-100 pb-3 text-sm">
                  <p className="font-semibold text-maroon-900">{item.roomName}</p>
                  <p className="text-muted">
                    {item.nights} night{item.nights > 1 ? "s" : ""} · {item.adults} adult{item.adults > 1 ? "s" : ""}
                    {item.children > 0 && `, ${item.children} child${item.children > 1 ? "ren" : ""}`}
                  </p>
                  <div className="mt-1 flex justify-between">
                    <span className="text-muted">Room + extras</span>
                    <span className="font-semibold text-maroon-900">{formatCurrency(item.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">GST</dt>
                <dd className="font-medium text-maroon-900">Included ({formatCurrency(gstVisible)})</dd>
              </div>
              <div className="flex justify-between border-t border-maroon-100 pt-3 text-base">
                <dt className="font-semibold text-maroon-900">Total</dt>
                <dd className="font-bold text-gold-600">{formatCurrency(total)}</dd>
              </div>
            </dl>
            <Link href="/cart" className="mt-4 block text-center text-sm text-gold-600 hover:underline">
              ← Back to cart
            </Link>
          </aside>
        </div>
      </Container>
      </section>
    </main>
  );
}