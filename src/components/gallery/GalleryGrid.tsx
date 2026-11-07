"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryItems, galleryCategories, type GalleryItem } from "@/lib/gallery";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/cn";

export function GalleryGrid() {
  const [active, setActive] = useState<(typeof galleryCategories)[number]>("All");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filtered = active === "All" ? galleryItems : galleryItems.filter((i) => i.category === active);

  return (
    <div>
      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {galleryCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xs",
              active === cat
                ? "bg-[#382314] text-white shadow-sm ring-1 ring-[#382314]"
                : "bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Authentic Photos in Neat 4:3 Proportion */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const imageSrc = resolveImage(item.src) || "/images/frontimpoo.jpeg";
          return (
            <figure
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-[#382314]/40 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                <Image
                  src={imageSrc}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
                
                {/* Always-visible luxury badge */}
                <span className="absolute top-3 left-3 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-[#D8A34F] backdrop-blur-sm border border-white/10">
                  {item.category}
                </span>

                {/* Captions */}
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="font-display text-lg font-semibold leading-tight text-white group-hover:text-gold-300 transition-colors">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-white/80 line-clamp-1">{item.description}</p>
                </figcaption>
              </div>
            </figure>
          );
        })}
      </div>

      {/* High-Resolution Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl bg-stone-950 border border-[#D8A34F]/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-[88vw] max-w-3xl max-h-[70vh]">
              <Image
                src={resolveImage(selectedPhoto.src) || "/images/frontimpoo.jpeg"}
                alt={selectedPhoto.title}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center justify-between border-t border-white/10 bg-stone-900/95 p-5 text-white">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D8A34F]">
                  {selectedPhoto.category}
                </span>
                <h3 className="font-display text-xl font-medium text-white">
                  {selectedPhoto.title}
                </h3>
                <p className="mt-1 text-xs text-white/80">{selectedPhoto.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close photo preview"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}