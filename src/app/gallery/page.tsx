import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Photo Gallery | Hotel Amil, Rajapalayam",
  description:
    "Browse photos of Hotel Amil, Rajapalayam — rooms, Saffron Manor Restaurant, Amil Cafe, swimming pool, banquet hall and more.",
};

export default function GalleryPage() {
  return (
    <main className="bg-white text-stone-900">
      <section className="bg-[#c0262d] pt-24 sm:pt-28 pb-10 sm:pb-12 text-white border-b border-red-900/30 shadow-inner">
        <Container className="text-center">
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gold-300 uppercase">Gallery</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl text-white">
            Moments at Hotel Amil
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            A look at the rooms, dining, pool, and event spaces that make every stay memorable in
            Rajapalayam.
          </p>
        </Container>
      </section>
      <section className="py-14 bg-white">
        <Container>
          <GalleryGrid />
        </Container>
      </section>
    </main>
  );
}