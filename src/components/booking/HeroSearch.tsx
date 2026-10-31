"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { todayISO, addDaysISO } from "@/lib/format";
import { DateGuestPicker, type GuestSelection } from "./DateGuestPicker";

export function HeroSearch() {
  const router = useRouter();
  const [selection, setSelection] = useState<GuestSelection>({
    checkIn: todayISO(),
    checkOut: addDaysISO(todayISO(), 1),
    adults: 2,
    children: 0,
  });

  const handleSearch = () => {
    if (!selection.checkIn || !selection.checkOut) return;
    const params = new URLSearchParams({
      checkIn: selection.checkIn,
      checkOut: selection.checkOut,
      adults: String(selection.adults),
      children: String(selection.children),
    });
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <div suppressHydrationWarning>
      <DateGuestPicker
        compact
        variant="default"
        value={selection}
        onChange={setSelection}
        onSearch={handleSearch}
      />
    </div>
  );
}