"use client";

import { useState } from "react";
import type { Room } from "@/lib/rooms";
import { RoomImage360 } from "@/components/rooms/RoomImage360";
import { RoomDetailTabs } from "@/components/rooms/RoomDetailTabs";
import { BookingWidget } from "@/components/booking/BookingWidget";

export function RoomDetailClient({ room }: { room: Room }) {
  const [selectedCheckIn, setSelectedCheckIn] = useState<string>("");
  const [selectedCheckOut, setSelectedCheckOut] = useState<string>("");

  const handleSelectDates = (checkIn: string, checkOut: string) => {
    setSelectedCheckIn(checkIn);
    setSelectedCheckOut(checkOut);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
      <div className="space-y-8">
        <RoomImage360
          roomName={room.name}
          imageKeys={room.images}
          panorama={room.panorama360}
        />

        {/* Tabs right below images: Description, Booking Calendar, Amenities */}
        <RoomDetailTabs
          room={room}
          onSelectDates={handleSelectDates}
          selectedCheckIn={selectedCheckIn}
          selectedCheckOut={selectedCheckOut}
        />
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <BookingWidget
          room={room}
          initialCheckIn={selectedCheckIn}
          initialCheckOut={selectedCheckOut}
        />
      </aside>
    </div>
  );
}

