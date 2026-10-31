"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import type { Room } from "@/lib/rooms";
import {
  calcPriceBreakdown,
  isRoomAvailable,
  roomsLeftForDates,
  formatCurrency,
} from "@/lib/booking";
import { addToCart } from "@/lib/cart";
import { todayISO, addDaysISO } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export function BookingWidget({ room }: { room: Room }) {
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(addDaysISO(todayISO(), 1));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenUnder8, setChildrenUnder8] = useState(0);
  const [added, setAdded] = useState(false);
  const [notice, setNotice] = useState("");
  const [serverLeft, setServerLeft] = useState<number | null>(null);

  const { breakdown, error } = useMemo(
    () => calcPriceBreakdown(room, checkIn, checkOut, adults, children, childrenUnder8),
    [room, checkIn, checkOut, adults, children, childrenUnder8]
  );

  // Live server-side inventory query
  useEffect(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return;
    let active = true;

    fetch(`/api/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}&roomSlug=${room.slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.availability) {
          setServerLeft(data.availability.availableRooms);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [checkIn, checkOut, room.slug]);

  const localLeft = roomsLeftForDates(room.slug, checkIn, checkOut);
  const effectiveLeft = serverLeft !== null ? serverLeft : localLeft;
  const available = !!(checkIn && checkOut) && checkOut > checkIn && effectiveLeft > 0;
  const left = effectiveLeft;

  const setCheckInSafe = (date: string) => {
    setNotice("");
    setAdded(false);
    setCheckIn(date);
    if (checkOut && date >= checkOut) setCheckOut(addDaysISO(date, 1));
  };
  const setCheckOutSafe = (date: string) => {
    setNotice("");
    setAdded(false);
    setCheckOut(date);
  };

  const clampUnder8 = (next: number) => {
    setChildrenUnder8(Math.min(next, children <= 0 ? 0 : Math.max(0, Math.min(next, children))));
    setAdded(false);
  };

  const handleAdd = () => {
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setNotice("Please choose valid dates.");
      return;
    }
    if (error) {
      setNotice(error);
      return;
    }
    const res = addToCart({
      roomSlug: room.slug,
      checkIn,
      checkOut,
      adults,
      children,
      childrenUnder8,
      roomPrice: room.price,
      gst: room.gst,
      extraPersonTotal: breakdown.extraPersonTotal,
    });
    if (res.ok) {
      setAdded(true);
      setNotice("");
    } else {
      setNotice(res.error ?? "Could not add to cart.");
    }
  };

  const fieldCls =
    "w-full rounded-xl border border-maroon-800/15 bg-white px-3 py-2.5 text-sm text-maroon-900 outline-none transition-colors focus:border-gold-500";

  return (
    <div className="rounded-2xl border border-maroon-100 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Per night · CP Plan
            </span>
            <span className="rounded bg-gold-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-800">
              Breakfast Incl.
            </span>
          </div>
          <p className="mt-1 font-sans text-3xl font-extrabold tracking-tight text-maroon-950 tabular-nums">
            {formatCurrency(room.price)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            left === 0 ? "bg-red-100 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {left === 0 ? "Already Booked · In Service" : `${left} rooms available`}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-maroon-800">Check-in</label>
          <input type="date" min={todayISO()} value={checkIn} onChange={(e) => setCheckInSafe(e.target.value)} className={fieldCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-maroon-800">Check-out</label>
          <input type="date" min={checkIn ? addDaysISO(checkIn, 1) : todayISO()} value={checkOut} onChange={(e) => setCheckOutSafe(e.target.value)} className={fieldCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-maroon-800">Adults</label>
          <select value={adults} onChange={(e) => { setAdults(Number(e.target.value)); setAdded(false); }} className={fieldCls}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-maroon-800">Children</label>
          <select value={children} onChange={(e) => { setChildren(Number(e.target.value)); setAdded(false); }} className={fieldCls}>
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {children > 0 && (
        <div className="mt-3 rounded-xl bg-maroon-50 p-3">
          <label className="block text-xs font-semibold text-maroon-800">
            Children below {siteConfig.freeChildAge} (stay free)
          </label>
          <div className="mt-2 flex items-center gap-3">
            <button onClick={() => clampUnder8(childrenUnder8 - 1)} className="h-8 w-8 rounded-full border border-maroon-300 text-maroon-800">
              −
            </button>
            <span className="w-6 text-center font-semibold text-maroon-900">{childrenUnder8}</span>
            <button onClick={() => clampUnder8(childrenUnder8 + 1)} className="h-8 w-8 rounded-full border border-maroon-300 text-maroon-800">
              +
            </button>
            <span className="text-xs text-muted">of {children} child(ren)</span>
          </div>
        </div>
      )}

      {checkIn && checkOut && (
        <dl className="mt-5 space-y-2 border-t border-maroon-100 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">{breakdown.nights} night{breakdown.nights !== 1 ? "s" : ""} × {formatCurrency(room.price)}</dt>
            <dd className="font-medium text-maroon-900">{formatCurrency(breakdown.baseTotal)}</dd>
          </div>
          {breakdown.extraPersons > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Extra person{breakdown.extraPersons > 1 ? "s" : ""} ({breakdown.extraPersons})</dt>
              <dd className="font-medium text-maroon-900">{formatCurrency(breakdown.extraPersonTotal)}</dd>
            </div>
          )}
          {breakdown.freeChildren > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Child(ren) below {siteConfig.freeChildAge}</dt>
              <dd className="font-medium text-emerald-600">FREE</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">
              GST included ({room.price > 7500 ? "18%" : "12%"} · SAC 9963)
            </dt>
            <dd className="font-medium text-maroon-900">{breakdown.gstTotal ? formatCurrency(breakdown.gstTotal) : "—"}</dd>
          </div>
          <div className="flex justify-between border-t border-maroon-100 pt-2 text-base">
            <dt className="font-semibold text-maroon-900">Total</dt>
            <dd className="font-bold text-gold-600">{formatCurrency(breakdown.total)}</dd>
          </div>
        </dl>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {notice && <p className="mt-3 text-sm text-red-600">{notice}</p>}

      {!available && checkIn && checkOut && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 leading-relaxed">
          <strong>Notice:</strong> This room category is currently booked and in service for the dates {checkIn} to {checkOut}. Please select different dates or explore other available room categories.
        </div>
      )}

      <Button onClick={handleAdd} disabled={!available} className="mt-5 w-full" size="lg">
        {added ? "Added to Cart ✓" : available ? "Add to Booking Cart" : "Already Booked · Currently in Service"}
      </Button>

      {added && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm">
          <span className="text-emerald-700">Added to your cart.</span>
          <Link href="/cart" className="font-semibold text-emerald-700 underline">
            Review &amp; Book →
          </Link>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Incl. GST · Continental breakfast ({siteConfig.breakfastTime}) · Free cancellation up to 7
        days before check-in.
      </p>
    </div>
  );
}