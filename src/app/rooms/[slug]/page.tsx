import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { RoomImage360 } from "@/components/rooms/RoomImage360";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { RoomCard } from "@/components/rooms/RoomCard";
import { getRoomBySlug, rooms, formatPrice } from "@/lib/rooms";
import { hotelPolicies } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }));
}

export function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return params.then(({ slug }) => {
    const room = getRoomBySlug(slug);
    if (!room) return {};
    return {
      title: `${room.name} | Hotel Amil, Rajapalayam`,
      description: room.shortDescription,
    };
  });
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) notFound();

  const others = rooms.filter((r) => r.slug !== room.slug).slice(0, 3);

  return (
    <main className="bg-white text-stone-900">
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container>
          <nav className="text-xs font-semibold uppercase tracking-widest text-white/75">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/rooms" className="hover:text-white transition-colors">Rooms</Link>
            <span className="mx-2">/</span>
            <span className="text-gold-300 font-bold">{room.name}</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl text-white">{room.name}</h1>
          <p className="mt-3 max-w-2xl text-white/90">
            {room.type} Room · {room.bed} · {room.view} · <span className="font-sans font-bold text-gold-300">{formatPrice(room.price)}</span> per night incl. GST
          </p>
        </Container>
      </section>

      <section className="py-12 bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            <div className="space-y-8">
              <RoomImage360
                roomName={room.name}
                imageKeys={room.images}
                panorama={room.panorama360}
              />

              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-stone-900">About this room</h2>
                <p className="mt-3 leading-relaxed text-stone-600">{room.description}</p>
                <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: "Occupancy", value: `${room.maxGuests}+${room.maxExtraPersons}` },
                    { label: "Bed", value: room.bed },
                    { label: "Size", value: room.size },
                    { label: "View", value: room.view },
                  ].map((d) => (
                    <div key={d.label} className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-center">
                      <dt className="text-xs uppercase tracking-wider text-stone-500">{d.label}</dt>
                      <dd className="mt-1 text-sm font-bold text-stone-900">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-stone-900">Amenities</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {room.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-stone-800">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#c0262d] font-bold text-xs">
                        ✓
                      </span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="font-display text-2xl font-semibold text-stone-900">Policies</h2>
                <ul className="mt-4 space-y-2 text-sm text-stone-700">
                  <li>Check-in {hotelPolicies.checkInTime} · Check-out {hotelPolicies.checkOutTime}</li>
                  <li>{hotelPolicies.freeChildNote}</li>
                  <li>{hotelPolicies.cpPlan.description} ({hotelPolicies.cpPlan.breakfastTime})</li>
                  <li>Extra person: ₹1,050 per person per night</li>
                  <li>{hotelPolicies.cancellation.note}</li>
                </ul>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <BookingWidget room={room} />
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 border-t border-stone-200">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-stone-900">Other rooms you may like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((r) => (
              <RoomCard key={r.slug} room={r} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}