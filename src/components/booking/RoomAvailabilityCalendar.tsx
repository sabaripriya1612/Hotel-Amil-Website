"use client";

import { useEffect, useState, useTransition, useMemo } from "react";
import type { Room } from "@/lib/rooms";
import { formatPrice } from "@/lib/rooms";
import { todayISO, addDaysISO } from "@/lib/format";

interface DayCalendarStatus {
  date: string;
  dayNumber: number;
  dayOfWeek: number;
  totalRooms: number;
  bookedRooms: number;
  availableRooms: number;
  isAvailable: boolean;
  isSoldOut: boolean;
  price: number;
  remainingLabel: string;
}

interface RoomAvailabilityCalendarProps {
  room: Room;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
  onSelectRange?: (checkIn: string, checkOut: string) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function RoomAvailabilityCalendar({
  room,
  selectedCheckIn,
  selectedCheckOut,
  onSelectRange,
}: RoomAvailabilityCalendarProps) {
  const today = todayISO();
  const initialIn = selectedCheckIn || today;
  const initialOut = selectedCheckOut || addDaysISO(today, 1);

  // Reference date for the 2-month view
  const initialDateObj = new Date(initialIn || today);
  const [currentYear, setCurrentYear] = useState(initialDateObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDateObj.getMonth() + 1); // 1-12
  const [, startTransition] = useTransition();

  // Selection state
  const [checkIn, setCheckIn] = useState<string>(initialIn);
  const [checkOut, setCheckOut] = useState<string>(initialOut);

  useEffect(() => {
    if (selectedCheckIn) setCheckIn(selectedCheckIn);
    if (selectedCheckOut) setCheckOut(selectedCheckOut);
  }, [selectedCheckIn, selectedCheckOut]);

  // Second month calculations
  const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

  // Monthly data states
  const [month1Days, setMonth1Days] = useState<DayCalendarStatus[]>([]);
  const [month2Days, setMonth2Days] = useState<DayCalendarStatus[]>([]);

  // Fetch month 1
  useEffect(() => {
    let active = true;
    const mStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    fetch(`/api/rooms/availability?roomSlug=${room.slug}&month=${mStr}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data && Array.isArray(data.days)) {
          setMonth1Days(data.days);
        } else {
          setMonth1Days(generateMonthDays(room, currentYear, currentMonth));
        }
      })
      .catch(() => {
        if (active) setMonth1Days(generateMonthDays(room, currentYear, currentMonth));
      });
    return () => {
      active = false;
    };
  }, [room.slug, room.totalRooms, room.price, currentYear, currentMonth]);

  // Fetch month 2
  useEffect(() => {
    let active = true;
    const mStr = `${nextMonthYear}-${String(nextMonth).padStart(2, "0")}`;
    fetch(`/api/rooms/availability?roomSlug=${room.slug}&month=${mStr}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data && Array.isArray(data.days)) {
          setMonth2Days(data.days);
        } else {
          setMonth2Days(generateMonthDays(room, nextMonthYear, nextMonth));
        }
      })
      .catch(() => {
        if (active) setMonth2Days(generateMonthDays(room, nextMonthYear, nextMonth));
      });
    return () => {
      active = false;
    };
  }, [room.slug, room.totalRooms, room.price, nextMonthYear, nextMonth]);

  // Navigate months
  const handlePrevMonth = () => {
    startTransition(() => {
      if (currentMonth === 1) {
        setCurrentYear((y) => y - 1);
        setCurrentMonth(12);
      } else {
        setCurrentMonth((m) => m - 1);
      }
    });
  };

  const handleNextMonth = () => {
    startTransition(() => {
      if (currentMonth === 12) {
        setCurrentYear((y) => y + 1);
        setCurrentMonth(1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
    });
  };

  // Day click logic
  const handleDaySelect = (day: DayCalendarStatus, isPast: boolean) => {
    if (isPast || day.isSoldOut) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Start a fresh selection
      setCheckIn(day.date);
      setCheckOut("");
    } else if (checkIn && !checkOut) {
      if (day.date > checkIn) {
        setCheckOut(day.date);
        if (onSelectRange) onSelectRange(checkIn, day.date);
      } else {
        setCheckIn(day.date);
        setCheckOut("");
      }
    }
  };

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return 1;
    const diff = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(1, diff);
  }, [checkIn, checkOut]);

  const handleContinueToBook = () => {
    if (checkIn && checkOut && onSelectRange) {
      onSelectRange(checkIn, checkOut);
    }
    // Scroll smoothly to the booking widget on the right
    const widget = document.querySelector("aside");
    if (widget) {
      widget.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Two Side-by-Side Monthly Calendars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* Month 1 */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer text-sm"
            >
              ←
            </button>
            <h4 className="font-display text-base sm:text-lg font-medium text-stone-900 text-center">
              {MONTH_NAMES[currentMonth - 1]} {currentYear}
            </h4>
            <div className="w-8 md:hidden">
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer text-sm"
              >
                →
              </button>
            </div>
            <div className="hidden md:block w-8" />
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-[11px] font-semibold text-stone-400 tracking-wider font-sans mb-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <MonthGrid
            days={month1Days}
            today={today}
            checkIn={checkIn}
            checkOut={checkOut}
            onSelect={handleDaySelect}
          />
        </div>

        {/* Month 2 */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8" />
            <h4 className="font-display text-base sm:text-lg font-medium text-stone-900 text-center">
              {MONTH_NAMES[nextMonth - 1]} {nextMonthYear}
            </h4>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer text-sm"
            >
              →
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-[11px] font-semibold text-stone-400 tracking-wider font-sans mb-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <MonthGrid
            days={month2Days}
            today={today}
            checkIn={checkIn}
            checkOut={checkOut}
            onSelect={handleDaySelect}
          />
        </div>
      </div>

      {/* 2. Selected Stay Dates Dark Bar matching the design */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#1C1512] px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white shadow-sm border border-[#382314]/40">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#E7B765]">
            SELECTED STAY DATES
          </span>
          <p className="font-sans text-sm sm:text-base font-bold text-white mt-0.5">
            {checkIn} → {checkOut || "(choose check-out)"} ({nights} Night{nights !== 1 ? "s" : ""})
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-5 self-end sm:self-auto">
          <div className="text-right">
            <span className="font-sans text-base sm:text-lg font-bold text-[#E7B765]">
              {formatPrice(room.price)}
            </span>
            <span className="text-xs text-stone-400 font-normal"> / night</span>
          </div>

          <button
            type="button"
            onClick={handleContinueToBook}
            className="rounded-full px-5 sm:px-6 py-2.5 bg-[#B32624] hover:bg-[#9B1E1C] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            Continue to Book →
          </button>
        </div>
      </div>

      {/* 3. Simple Legend matching the reference image */}
      <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-xs text-stone-600 font-sans pt-1">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border border-stone-300 bg-white" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-[#FDE8E8] border border-red-200" />
          <span className="text-[#B32624] font-medium">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-[#5A1C1A]" />
          <span>Selected Dates</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-stone-100 border border-stone-200" />
          <span className="text-stone-400">Past Date</span>
        </div>
      </div>
    </div>
  );
}

function MonthGrid({
  days,
  today,
  checkIn,
  checkOut,
  onSelect,
}: {
  days: DayCalendarStatus[];
  today: string;
  checkIn: string;
  checkOut: string;
  onSelect: (day: DayCalendarStatus, isPast: boolean) => void;
}) {
  const firstDayOfWeek = days.length > 0 ? days[0].dayOfWeek : 0;
  const blankDays = Array.from({ length: firstDayOfWeek });

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
      {blankDays.map((_, i) => (
        <div key={`blank-${i}`} className="h-10 sm:h-12 w-full" />
      ))}

      {days.map((day) => {
        const isPast = day.date < today;
        const isCheckIn = checkIn === day.date;
        const isCheckOut = checkOut === day.date;
        const isInRange = checkIn && checkOut && day.date > checkIn && day.date < checkOut;
        const isSoldOut = day.isSoldOut;

        let tileCls =
          "border border-stone-200/70 bg-white text-stone-800 hover:border-[#D8A34F] hover:bg-stone-50 cursor-pointer shadow-2xs";

        if (isPast) {
          tileCls = "bg-stone-50/70 border border-transparent text-stone-300 cursor-not-allowed";
        } else if (isCheckIn || isCheckOut) {
          tileCls =
            "bg-[#5A1C1A] border border-[#5A1C1A] text-white shadow-sm ring-1 ring-[#5A1C1A]/20 cursor-pointer";
        } else if (isInRange) {
          tileCls = "bg-[#FAF0E6] border border-[#D8A34F]/30 text-[#5A1C1A] font-semibold cursor-pointer";
        } else if (isSoldOut) {
          tileCls =
            "bg-[#FDE8E8] border border-red-200 text-[#B32624] cursor-not-allowed font-medium";
        }

        return (
          <div
            key={day.date}
            onClick={() => onSelect(day, isPast)}
            className={`h-10 sm:h-12 w-full rounded-xl flex flex-col items-center justify-center transition-all select-none ${tileCls}`}
          >
            <span
              className={`text-xs sm:text-sm font-semibold leading-none ${
                isPast ? "text-stone-300" : isCheckIn || isCheckOut ? "text-white" : ""
              }`}
            >
              {day.dayNumber}
            </span>

            {isCheckIn && (
              <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-tight text-white/90 leading-none mt-1">
                CHECK-IN
              </span>
            )}
            {isCheckOut && (
              <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-tight text-white/90 leading-none mt-1">
                CHECK-OUT
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function generateMonthDays(room: Room, year: number, month: number): DayCalendarStatus[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const list: DayCalendarStatus[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dateObj = new Date(year, month - 1, d);
    list.push({
      date: dateStr,
      dayNumber: d,
      dayOfWeek: dateObj.getDay(),
      totalRooms: room.totalRooms,
      bookedRooms: 0,
      availableRooms: room.totalRooms,
      isAvailable: true,
      isSoldOut: false,
      price: room.price,
      remainingLabel: `${room.totalRooms} available`,
    });
  }
  return list;
}
