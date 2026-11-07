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
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-[#382314]/40 hover:shadow-xl h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 shrink-0">
        <ImagePlaceholder
          name={room.images[0]}
          alt={room.name}
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-[#382314] px-3.5 py-1 text-xs font-semibold text-[#F5EEE6] shadow-sm border border-[#D8A34F]/40 backdrop-blur-xs">
          {formatPrice(room.price)} / night
        </span>
        {booked ? (
          <span className="absolute left-3 top-3 rounded-full bg-red-600/95 backdrop-blur-xs px-3 py-1 text-xs font-semibold text-white shadow-xs">
            Booked
          </span>
        ) : room.maxGuests > 2 ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1 text-xs font-medium text-stone-800 shadow-xs border border-stone-200/80">
            {room.maxGuests}+{room.maxExtraPersons} Persons
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-[#1C1917] group-hover:text-[#382314] transition-colors line-clamp-1">
            {room.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600 min-h-[2.5rem]">
            {room.shortDescription}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5 min-h-[3.25rem] content-start">
            {room.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-[#FAF8F5] px-2.5 py-1 text-xs font-medium text-stone-600 border border-stone-200/70"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
          <span className="text-xs text-stone-500">
            Incl. tax · CP Plan · Free Cancellation
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#382314] group-hover:text-[#4A301D] inline-flex items-center gap-1.5 transition-colors shrink-0 ml-2">
            <span>View Room</span>
            <span aria-hidden="true" className="text-[#D8A34F] transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}