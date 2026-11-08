import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Photo Gallery | Hotel Amil, Rajapalayam",
  description:
    "Browse photos of Hotel Amil, Rajapalayam — rooms, Saffron Manor Restaurant, Amil Cafe, swimming pool, banquet hall and more.",
};

export default function GalleryPage() {
  return (
    <main className="bg-[#FAF8F5] text-stone-900">
      <PageHero
        eyebrow="PHOTO GALLERY"
        title="Moments at Hotel Amil"
        description="A look at our executive rooms, Saffron Restaurant dining, swimming pool, and celebration spaces that make every stay memorable in Rajapalayam."
        variant="gallery"
        image="/images/loby.png"
        imageAlt="Hotel Amil Grand Lobby"
      />
      <section className="py-16 sm:py-20">
        <Container>
          <GalleryGrid />
        </Container>
      </section>
    </main>
  );
}