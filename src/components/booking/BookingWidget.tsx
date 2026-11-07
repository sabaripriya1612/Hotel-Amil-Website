"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import type { Room } from "@/lib/rooms";
import {
  calcPriceBreakdown,
  roomsLeftForDates,
  formatCurrency,
} from "@/lib/booking";
import { addToCart } from "@/lib/cart";
import { todayISO, addDaysISO } from "@/lib/format";
import { siteConfig } from "@/lib/site";

interface BookingWidgetProps {
  room: Room;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

export function BookingWidget({
  room,
  initialCheckIn,
  initialCheckOut,
}: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState(initialCheckIn || todayISO());
  const [checkOut, setCheckOut] = useState(
    initialCheckOut || addDaysISO(todayISO(), 1)
  );
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenUnder8, setChildrenUnder8] = useState(0);
  const [added, setAdded] = useState(false);
  const [notice, setNotice] = useState("");
  const [serverLeft, setServerLeft] = useState<number | null>(null);

  // Sync external date selection from Calendar tab
  useEffect(() => {
    if (initialCheckIn) setCheckIn(initialCheckIn);
    if (initialCheckOut) setCheckOut(initialCheckOut);
  }, [initialCheckIn, initialCheckOut]);

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
      setNotice("Please choose valid check-in and check-out dates.");
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
      setNotice(res.error ?? "Could not add room to cart.");
    }
  };

  return (
    <div className="rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-sm">
      {/* 1. Clear Luxury Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88438]">
              Hotel Amil · CP Plan
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-sans text-3xl font-bold tracking-tight text-[#1C1917] tabular-nums">
                {formatCurrency(room.price)}
              </span>
              <span className="text-xs text-stone-500 font-medium">/ night</span>
            </div>
          </div>

          {/* Real-time Category Inventory Badge */}
          <div className="text-right">
            {left === 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                Sold Out
              </span>
            ) : left <= 3 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Only {left} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {left} rooms available
              </span>
            )}
          </div>
        </div>

        <p className="mt-2 text-[11px] text-stone-500 font-sans">
          Includes GST &amp; hot buffet breakfast ({siteConfig.breakfastTime})
        </p>
      </div>

      {/* 2. Clear Date Selectors */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
            Check-In
          </label>
          <input
            type="date"
            suppressHydrationWarning
            min={todayISO()}
            value={checkIn}
            onChange={(e) => setCheckInSafe(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-white focus:bg-white px-3 py-2 text-xs sm:text-sm text-stone-900 outline-none transition-all focus:border-[#382314] focus:ring-1 focus:ring-[#382314]/20 font-medium cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
            Check-Out
          </label>
          <input
            type="date"
            suppressHydrationWarning
            min={checkIn ? addDaysISO(checkIn, 1) : todayISO()}
            value={checkOut}
            onChange={(e) => setCheckOutSafe(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-white focus:bg-white px-3 py-2 text-xs sm:text-sm text-stone-900 outline-none transition-all focus:border-[#382314] focus:ring-1 focus:ring-[#382314]/20 font-medium cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Guests Selector */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
            Adults
          </label>
          <select
            value={adults}
            onChange={(e) => {
              setAdults(Number(e.target.value));
              setAdded(false);
            }}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-white focus:bg-white px-3 py-2 text-xs sm:text-sm text-stone-900 outline-none transition-all focus:border-[#382314] focus:ring-1 focus:ring-[#382314]/20 font-medium cursor-pointer"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Adult" : "Adults"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
            Children
          </label>
          <select
            value={children}
            onChange={(e) => {
              setChildren(Number(e.target.value));
              setAdded(false);
            }}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-white focus:bg-white px-3 py-2 text-xs sm:text-sm text-stone-900 outline-none transition-all focus:border-[#382314] focus:ring-1 focus:ring-[#382314]/20 font-medium cursor-pointer"
          >
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Child" : "Children"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Children Under 8 Selector */}
      {children > 0 && (
        <div className="mt-3 rounded-xl bg-stone-50 p-2.5 border border-stone-200/80 flex items-center justify-between">
          <span className="text-xs text-stone-700 font-medium">
            Below {siteConfig.freeChildAge} yrs (stay free):
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => clampUnder8(childrenUnder8 - 1)}
              className="h-6 w-6 rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold text-xs"
            >
              −
            </button>
            <span className="w-5 text-center font-bold text-xs text-stone-900">
              {childrenUnder8}
            </span>
            <button
              type="button"
              onClick={() => clampUnder8(childrenUnder8 + 1)}
              className="h-6 w-6 rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold text-xs"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* 4. Elegant Price Summary */}
      {checkIn && checkOut && (
        <dl className="mt-4 space-y-1.5 border-t border-stone-100 pt-3 text-xs font-sans">
          <div className="flex justify-between text-stone-600">
            <dt>{breakdown.nights} night{breakdown.nights !== 1 ? "s" : ""} × {formatCurrency(room.price)}</dt>
            <dd className="font-semibold text-stone-900">{formatCurrency(breakdown.baseTotal)}</dd>
          </div>
          {breakdown.extraPersons > 0 && (
            <div className="flex justify-between text-stone-600">
              <dt>Extra Person ({breakdown.extraPersons} × ₹1,050)</dt>
              <dd className="font-semibold text-stone-900">{formatCurrency(breakdown.extraPersonTotal)}</dd>
            </div>
          )}
          <div className="flex justify-between text-stone-500 pt-1 border-t border-stone-100">
            <dt>Included GST (SAC 9963)</dt>
            <dd className="font-medium text-stone-700">{formatCurrency(breakdown.gstTotal)}</dd>
          </div>
          <div className="flex items-baseline justify-between pt-1.5 border-t border-stone-200">
            <dt className="text-sm font-bold text-stone-900">Total Price</dt>
            <dd className="text-lg font-bold text-[#382314]">{formatCurrency(breakdown.total)}</dd>
          </div>
        </dl>
      )}

      {/* Errors & Notices */}
      {error && <p className="mt-2.5 text-xs text-red-600 font-medium">{error}</p>}
      {notice && <p className="mt-2.5 text-xs text-red-600 font-medium">{notice}</p>}

      {!available && checkIn && checkOut && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-800 leading-snug">
          <strong>Notice:</strong> All physical rooms in this category are occupied for these dates. Please choose different dates or select another category.
        </div>
      )}

      {/* 5. Luxury Golden Button matching the golden illustration */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={!available}
        className={`mt-4 w-full h-11 sm:h-12 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 border ${
          added
            ? "bg-emerald-600 border-emerald-700 text-white"
            : available
            ? "bg-gradient-to-r from-[#D8A34F] via-[#E7B765] to-[#D8A34F] hover:from-[#C99745] hover:via-[#D8A34F] hover:to-[#C99745] active:scale-[0.98] text-[#29180C] border-[#FFE6A8]/50 shadow-md"
            : "bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed"
        }`}
      >
        {added ? (
          <span>Added to Cart ✓</span>
        ) : available ? (
          <>
            <span>ADD TO BOOKING CART</span>
            <span aria-hidden="true" className="text-[#382314]">→</span>
          </>
        ) : (
          <span>Sold Out for Selected Dates</span>
        )}
      </button>

      {/* Added to Cart Success Banner */}
      {added && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs border border-emerald-200">
          <span className="font-semibold text-emerald-800">Room added to cart.</span>
          <Link href="/cart" className="font-bold text-emerald-900 underline hover:text-emerald-700">
            View Cart &amp; Book →
          </Link>
        </div>
      )}

      {/* 6. Clean Guarantee Points */}
      <div className="mt-4 border-t border-stone-100 pt-3 space-y-1 text-[11px] text-stone-500 font-sans">
        <p className="flex items-center gap-1.5">
          <span className="text-emerald-600 font-bold">✓</span> Free cancellation up to 7 days before check-in
        </p>
        <p className="flex items-center gap-1.5">
          <span className="text-emerald-600 font-bold">✓</span> Complimentary hot breakfast ({siteConfig.breakfastTime})
        </p>
        <p className="flex items-center gap-1.5">
          <span className="text-emerald-600 font-bold">✓</span> Hill view private balcony &amp; modern amenities
        </p>
      </div>
    </div>
  );
}
