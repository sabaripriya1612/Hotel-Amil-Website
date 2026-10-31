import Link from "next/link";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { formatPrice, type Room } from "@/lib/rooms";

export function RoomCard({
  room,
  availability,
  isBooked,
}: {
  room: Room;
  availability?: number;
  isBooked?: boolean;
}) {
  const booked = isBooked || availability === 0;

  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImagePlaceholder
          name={room.images[0]}
          label="Hotel Amil · Rajapalayam"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-[#c0262d] px-3 py-1 text-xs font-bold text-white shadow-md">
          {formatPrice(room.price)} / night
        </span>
        {room.maxGuests > 2 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-stone-900 shadow-sm border border-stone-200">
            {room.maxGuests}+{room.maxExtraPersons} Persons
          </span>
        )}

        {/* Live Booking & In-Service Status Indicator on Image */}
        {booked ? (
          <span className="absolute left-3 bottom-3 rounded-full bg-[#c0262d]/95 px-3 py-1 text-[11px] font-bold text-white shadow-lg backdrop-blur flex items-center gap-1.5 border border-red-400/40">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Already Booked · In Service
          </span>
        ) : availability !== undefined && availability > 0 ? (
          <span className="absolute left-3 bottom-3 rounded-full bg-emerald-800/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow backdrop-blur flex items-center gap-1.5 border border-emerald-400/30">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            {availability} Room{availability > 1 ? "s" : ""} Available · In Service
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-[#c0262d]">
          {room.type} Room
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold text-stone-900 group-hover:text-[#c0262d] transition-colors">
          {room.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">
          {room.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {room.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
          <span className="text-xs text-stone-500">
            Incl. tax · CP Plan · Cancellation friendly
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#c0262d] group-hover:text-[#a51d23]">
            View Room →
          </span>
        </div>
      </div>
    </Link>
  );
}