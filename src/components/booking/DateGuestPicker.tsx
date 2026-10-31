"use client";

import { useCallback, useState } from "react";
import { todayISO, addDaysISO } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export type GuestSelection = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
};

export function DateGuestPicker({
  value,
  onChange,
  onSearch,
  compact = false,
  variant = "default",
}: {
  value: GuestSelection;
  onChange: (next: GuestSelection) => void;
  onSearch: () => void;
  compact?: boolean;
  variant?: "default" | "hero";
}) {
  const [error, setError] = useState("");

  const setCheckIn = (date: string) => {
    const next = { ...value, checkIn: date };
    if (next.checkOut && date >= next.checkOut) {
      next.checkOut = addDaysISO(date, 1);
    }
    setError("");
    onChange(next);
  };

  const setCheckOut = (date: string) => {
    setError("");
    onChange({ ...value, checkOut: date });
  };

  const handleSearch = useCallback(() => {
    if (!value.checkIn || !value.checkOut) {
      setError("Please choose check-in and check-out dates.");
      return;
    }
    if (value.checkOut <= value.checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }
    setError("");
    onSearch();
  }, [value, onSearch]);

  if (variant === "hero") {
    const formatDisplayDate = (iso: string) => {
      if (!iso) return { dateStr: "Select Date", dayStr: "" };
      const [yearStr, monthStr, dayStr] = iso.split("-");
      const d = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));
      const day = d.getDate();
      const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
      const year = d.getFullYear();
      return {
        dateStr: `${day} ${month}`,
        dayStr: `${weekday}, ${year}`,
      };
    };

    const checkInDisplay = formatDisplayDate(value.checkIn);
    const checkOutDisplay = formatDisplayDate(value.checkOut);

    return (
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2">
          {/* Check-in */}
          <div className="relative flex-1 min-w-[120px] px-2 sm:px-3 py-1 cursor-pointer group rounded-lg hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 shrink-0">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/70">
                  CHECK-IN
                </span>
                <span className="block text-xs sm:text-sm font-bold text-white leading-tight">
                  {checkInDisplay.dateStr}
                </span>
                <span className="block text-[10px] text-white/60">
                  {checkInDisplay.dayStr}
                </span>
              </div>
            </div>
            <input
              type="date"
              suppressHydrationWarning
              aria-label="Check-in date"
              min={todayISO()}
              value={value.checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full [color-scheme:dark]"
            />
          </div>

          <div className="hidden sm:block h-9 w-px bg-white/20 self-center" />

          {/* Check-out */}
          <div className="relative flex-1 min-w-[120px] px-2 sm:px-3 py-1 cursor-pointer group rounded-lg hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 shrink-0">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/70">
                  CHECK-OUT
                </span>
                <span className="block text-xs sm:text-sm font-bold text-white leading-tight">
                  {checkOutDisplay.dateStr}
                </span>
                <span className="block text-[10px] text-white/60">
                  {checkOutDisplay.dayStr}
                </span>
              </div>
            </div>
            <input
              type="date"
              suppressHydrationWarning
              aria-label="Check-out date"
              min={value.checkIn ? addDaysISO(value.checkIn, 1) : todayISO()}
              value={value.checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full [color-scheme:dark]"
            />
          </div>

          <div className="hidden sm:block h-9 w-px bg-white/20 self-center" />

          {/* Guests */}
          <div className="relative flex-1 min-w-[140px] px-2 sm:px-3 py-1 cursor-pointer group rounded-lg hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 shrink-0">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/70">
                  GUESTS
                </span>
                <span className="block text-xs sm:text-sm font-bold text-white leading-tight">
                  {value.adults} Adults · {value.children} Children
                </span>
                <span className="block text-[10px] text-white/60">
                  1 Room <span className="text-[9px]">▾</span>
                </span>
              </div>
            </div>
            <select
              aria-label="Guests"
              value={`${value.adults}-${value.children}`}
              onChange={(e) => {
                const [a, c] = e.target.value.split("-").map(Number);
                onChange({ ...value, adults: a, children: c });
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full [color-scheme:dark]"
            >
              <option value="1-0" className="bg-slate-900 text-white">1 Adult · 0 Children</option>
              <option value="2-0" className="bg-slate-900 text-white">2 Adults · 0 Children</option>
              <option value="2-1" className="bg-slate-900 text-white">2 Adults · 1 Child</option>
              <option value="2-2" className="bg-slate-900 text-white">2 Adults · 2 Children</option>
              <option value="3-0" className="bg-slate-900 text-white">3 Adults · 0 Children</option>
              <option value="3-1" className="bg-slate-900 text-white">3 Adults · 1 Child</option>
              <option value="4-0" className="bg-slate-900 text-white">4 Adults · 0 Children</option>
              <option value="4-2" className="bg-slate-900 text-white">4 Adults · 2 Children</option>
            </select>
          </div>

          {/* Search CTA */}
          <div className="shrink-0 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={handleSearch}
              className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-xl bg-[#c0262d] hover:bg-[#a51d23] active:scale-[0.98] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>CHECK RATES</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-xs font-medium text-amber-300">{error}</p>}
      </div>
    );
  }

  const inputCls = compact
    ? "w-full rounded-xl border border-stone-300 bg-white px-2.5 py-1 text-xs text-stone-900 outline-none transition-colors focus:border-[#c0262d] font-medium h-[34px]"
    : "w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition-colors focus:border-[#c0262d]";

  const labelCls = compact
    ? "mb-1 block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#c0262d]"
    : "mb-1 block text-xs font-bold uppercase tracking-wider text-[#c0262d]";

  return (
    <div className={compact ? "" : "rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"}>
      {/* Compact mode: 2 cols on mobile, 4 on tablet, 5-col single row on desktop */}
      <div
        className={
          compact
            ? "grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-4 lg:grid-cols-5 items-end"
            : "grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end"
        }
      >
        <div>
          <label className={labelCls}>
            CHECK-IN
          </label>
          <input
            type="date"
            suppressHydrationWarning
            min={todayISO()}
            value={value.checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>
            CHECK-OUT
          </label>
          <input
            type="date"
            suppressHydrationWarning
            min={value.checkIn ? addDaysISO(value.checkIn, 1) : todayISO()}
            value={value.checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>
            ADULTS
          </label>
          <select
            value={value.adults}
            onChange={(e) => onChange({ ...value, adults: Number(e.target.value) })}
            className={inputCls}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Adult" : "Adults"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>
            CHILDREN
          </label>
          <select
            value={value.children}
            onChange={(e) => onChange({ ...value, children: Number(e.target.value) })}
            className={inputCls}
          >
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Child" : "Children"}
              </option>
            ))}
          </select>
        </div>
        <div className={compact ? "col-span-2 md:col-span-4 lg:col-span-1" : ""}>
          <button
            type="button"
            onClick={handleSearch}
            className={
              compact
                ? "w-full h-[34px] rounded-xl bg-[#c0262d] hover:bg-[#a51d23] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all shadow cursor-pointer flex items-center justify-center px-4"
                : "w-full rounded-xl bg-[#c0262d] hover:bg-[#a51d23] active:scale-[0.98] text-white font-bold py-2.5 text-sm uppercase tracking-wider transition-all shadow cursor-pointer flex items-center justify-center"
            }
          >
            <span>Check Availability</span>
          </button>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
      <p className="mt-2 text-[10px] sm:text-[11px] text-stone-500 leading-normal">
        Check-in {siteConfig.checkIn} · Check-out {siteConfig.checkOut} · Children below{" "}
        {siteConfig.freeChildAge} stay free · CP Plan (breakfast {siteConfig.breakfastTime}) included
      </p>
    </div>
  );
}