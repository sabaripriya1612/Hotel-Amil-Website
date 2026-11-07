import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
      />

      <section className="py-14 sm:py-16">
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