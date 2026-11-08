import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { RoomDetailClient } from "@/components/rooms/RoomDetailClient";
import { RoomCard } from "@/components/rooms/RoomCard";
import { PageHero } from "@/components/ui/PageHero";
import { getRoomBySlug, rooms, formatPrice } from "@/lib/rooms";

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
    <main className="bg-[#FAF8F5] text-stone-900">
      <PageHero
        eyebrow="ACCOMMODATION"
        title={room.name}
        description={`${room.type} Room · ${room.bed} · ${room.view} · ${formatPrice(room.price)} per night incl. GST`}
        variant="rooms"
        image={room.images[0] ? (room.images[0].startsWith("/") ? room.images[0] : `/images/${room.images[0]}`) : "/images/deluxe1.jpeg"}
        imageAlt={`Hotel Amil ${room.name}`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#room-booking"
            className="inline-flex items-center gap-2 rounded-full border border-[#D4A346] px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-[#F0DCBE] transition-all hover:border-[#E8B85A] hover:text-white active:scale-97 shadow-xs hover:shadow-md"
          >
            <span>Book This Room</span>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-[#D4A346]">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </a>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 font-sans text-xs font-medium text-[#F5EEE6] hover:bg-white/20 transition-all"
          >
            <span>← All Rooms</span>
          </Link>
        </div>
      </PageHero>

      <section id="room-booking" className="py-14 sm:py-16">
        <Container>
          <RoomDetailClient room={room} />
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