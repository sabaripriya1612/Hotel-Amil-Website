"use client";

"use client";

import { useState } from "react";
import { rooms } from "@/lib/rooms";
import { getAvailableRoomsForDates, roomsLeftForDates } from "@/lib/booking";
import { addToCart } from "@/lib/cart";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Button } from "@/components/ui/Button";
import { DateGuestPicker, type GuestSelection } from "./DateGuestPicker";
import { todayISO, addDaysISO } from "@/lib/format";

function queryDefaults(): GuestSelection {
  let checkIn = todayISO();
  let checkOut = addDaysISO(todayISO(), 1);
  let adults = 2;
  let children = 0;
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const ci = params.get("checkIn");
    const co = params.get("checkOut");
    if (ci && co && co > ci) {
      checkIn = ci;
      checkOut = co;
    }
    const a = Number(params.get("adults"));
    const c = Number(params.get("children"));
    if (a >= 1 && a <= 5) adults = a;
    if (c >= 0 && c <= 3) children = c;
  }
  return { checkIn, checkOut, adults, children };
}

export function AvailabilitySearch() {
  const [selection, setSelection] = useState<GuestSelection>(queryDefaults);
  const [results, setResults] = useState<{ available: string[]; unavailable: string[] } | null>(null);
  const [serverCounts, setServerCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const handleSearch = async () => {
    if (!selection.checkIn || !selection.checkOut) return;
    if (selection.checkOut <= selection.checkIn) {
      setNotice("Check-out must be after check-in.");
      setResults(null);
      return;
    }

    setLoading(true);
    setNotice("");

    try {
      const res = await fetch(
        `/api/rooms/availability?checkIn=${selection.checkIn}&checkOut=${selection.checkOut}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.rooms && Array.isArray(data.rooms)) {
          const counts: Record<string, number> = {};
          const avail: string[] = [];
          const unavail: string[] = [];

          for (const item of data.rooms) {
            counts[item.roomSlug] = item.availableRooms;
            if (item.isAvailable) {
              avail.push(item.roomSlug);
            } else {
              unavail.push(item.roomSlug);
            }
          }

          setServerCounts(counts);
          setResults({ available: avail, unavailable: unavail });
          setLoading(false);
          setAdded(null);
          return;
        }
      }
    } catch {
      // Fallback to local computation if offline
    }

    const available = getAvailableRoomsForDates(selection.checkIn, selection.checkOut).map((r) => r.slug);
    const unavailable = rooms.filter((r) => !available.includes(r.slug)).map((r) => r.slug);
    setResults({ available, unavailable });
    setLoading(false);
    setAdded(null);
  };

  const handleAdd = (roomSlug: string) => {
    const room = rooms.find((r) => r.slug === roomSlug);
    if (!room) return;
    const res = addToCart({
      roomSlug,
      checkIn: selection.checkIn,
      checkOut: selection.checkOut,
      adults: selection.adults,
      children: selection.children,
      childrenUnder8: 0,
      roomPrice: room.price,
      gst: room.gst,
      extraPersonTotal: 0,
    });
    if (res.ok) {
      setAdded(roomSlug);
      setTimeout(() => setAdded(null), 2500);
    } else if (res.error) {
      setNotice(res.error);
    }
  };

  const shown = results ? roomSlugsToSorted([...results.available, ...results.unavailable]) : rooms;

  return (
    <div className="space-y-8">
      <DateGuestPicker value={selection} onChange={setSelection} onSearch={handleSearch} />

      {notice && <p className="text-sm text-red-600">{notice}</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((room) => {
          const availability =
            serverCounts[room.slug] !== undefined
              ? serverCounts[room.slug]
              : roomsLeftForDates(room.slug, selection.checkIn, selection.checkOut);
          const isUnavailable = results ? !results.available.includes(room.slug) : false;
          return (
            <div key={room.slug} className="flex flex-col gap-3">
              <div className={isUnavailable ? "opacity-80" : ""}>
                <RoomCard
                  room={room}
                  availability={availability}
                  isBooked={isUnavailable || availability === 0}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                {availability === 0 || isUnavailable ? (
                  <div className="rounded-xl border border-red-200 bg-red-50/95 px-3 py-2 text-xs font-medium text-red-800 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
                    <span>Already Booked · Currently in service for these dates</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        availability <= 3 ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {availability} room{availability > 1 ? "s" : ""} available · In Service
                    </span>
                    {results && availability > 0 && (
                      <Button size="sm" onClick={() => handleAdd(room.slug)}>
                        {added === room.slug ? "Added to Cart ✓" : "Add to Cart"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {results && (
        <p className="text-sm text-muted">
          Showing availability for {selection.checkIn} → {selection.checkOut}.
          <span className="mx-2">·</span>
          <a href="/cart" className="font-medium text-gold-600 hover:underline">
            View cart →
          </a>
        </p>
      )}
    </div>
  );
}

function roomSlugsToSorted(slugs: string[]) {
  return rooms.filter((r) => slugs.includes(r.slug));
}