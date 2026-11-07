"use client";

import { useState } from "react";
import type { Room } from "@/lib/rooms";
import { hotelPolicies } from "@/lib/site";
import { RoomAvailabilityCalendar } from "@/components/booking/RoomAvailabilityCalendar";

interface RoomDetailTabsProps {
  room: Room;
  onSelectDates?: (checkIn: string, checkOut: string) => void;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
}

export function RoomDetailTabs({
  room,
  onSelectDates,
  selectedCheckIn,
  selectedCheckOut,
}: RoomDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "calendar" | "amenities">("description");

  const tabs = [
    { id: "description" as const, label: "Description" },
    { id: "calendar" as const, label: "Booking Calendar" },
    { id: "amenities" as const, label: "Amenities" },
  ];

  return (
    <div className="space-y-6">
      {/* Horizontal Tabs Navigation matching the reference design */}
      <div className="border-b border-stone-200">
        <nav className="flex space-x-8" aria-label="Room details tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 text-sm sm:text-base font-medium transition-all relative cursor-pointer font-sans whitespace-nowrap ${
                  isActive
                    ? "text-[#1C1917] font-semibold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D8A34F] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab 1: Description ('About this room') */}
      {activeTab === "description" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="font-display text-2xl font-normal text-[#1C1917]">About this room</h2>
            <p className="mt-3.5 leading-relaxed text-stone-600 font-sans text-sm sm:text-base">
              {room.description}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Occupancy", value: `${room.maxGuests}+${room.maxExtraPersons} Persons` },
                { label: "Bed", value: room.bed },
                { label: "Size", value: room.size },
                { label: "View", value: room.view },
              ].map((d) => (
                <div key={d.label} className="rounded-xl border border-stone-200/80 bg-[#FAF8F5] p-3 text-center">
                  <dt className="text-xs uppercase tracking-wider text-stone-500">{d.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-[#1C1917]">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <h3 className="font-display text-xl font-normal text-[#1C1917]">Room Policies &amp; Inclusions</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-700 font-sans">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#382314]" />
                Check-in {hotelPolicies.checkInTime} · Check-out {hotelPolicies.checkOutTime}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#382314]" />
                {hotelPolicies.freeChildNote}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#382314]" />
                {hotelPolicies.cpPlan.description} ({hotelPolicies.cpPlan.breakfastTime})
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#382314]" />
                Extra person: ₹1,050 per person per night
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Booking Calendar */}
      {activeTab === "calendar" && (
        <div>
          <RoomAvailabilityCalendar
            room={room}
            selectedCheckIn={selectedCheckIn}
            selectedCheckOut={selectedCheckOut}
            onSelectRange={onSelectDates}
          />
        </div>
      )}

      {/* Tab 3: Amenities */}
      {activeTab === "amenities" && (
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="font-display text-2xl font-normal text-[#1C1917]">Amenities</h2>
          <p className="mt-1 text-xs text-stone-500 font-sans">
            Every guest at Hotel Amil enjoys full access to these premium room features and hotel services.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {room.amenities.map((a) => (
              <li key={a} className="flex items-center gap-2.5 text-sm text-stone-800">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#382314]/10 text-[#382314] font-bold text-xs">
                  ✓
                </span>
                <span className="font-sans">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

