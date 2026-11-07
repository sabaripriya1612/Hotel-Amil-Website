"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/cn";

type AttractionDynamicScrollProps = {
  name: string;
  images: string[];
  categoryLabel?: string;
  distance?: string;
};

export function AttractionDynamicScroll({
  name,
  images,
}: AttractionDynamicScrollProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-scroll loop (faster speed as requested)
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    timerRef.current = setInterval(() => {
      next();
    }, 2400);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, next, images.length, currentIndex]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isPlaying && images.length > 1) {
      timerRef.current = setInterval(next, 2400);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distanceX = touchStartX.current - touchEndX.current;
    if (distanceX > 45) {
      next();
      resetTimer();
    } else if (distanceX < -45) {
      prev();
      resetTimer();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i + 1) % images.length);
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((i) => (i - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, images.length]);

  if (!images || images.length === 0) return null;

  const currentSrc = images[currentIndex];

  return (
    <div className="flex flex-col space-y-3">
      {/* Main Dynamic Scroll Viewer Frame */}
      <div
        className="group relative h-[380px] sm:h-[440px] md:h-[480px] w-full overflow-hidden rounded-2xl border border-stone-800/40 bg-gradient-to-b from-[#121E1C] via-[#29180C] to-[#0F1715] shadow-xl"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Soft Ambient Glow from Image (non-zoomed illusion, adds depth) */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 filter blur-3xl transition-all duration-700 scale-110"
          style={{ backgroundImage: `url("${encodeURI(currentSrc)}")` }}
          aria-hidden="true"
        />

        {/* Subtle Decorative Golden Border Accent */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#D8A34F]/20 z-20" />

        {/* Active Image (Preserves natural aspect ratio with object-contain - NO ZOOM!) */}
        <div className="relative z-10 flex h-full w-full items-center justify-center p-3 sm:p-5">
          <img
            key={currentSrc}
            src={currentSrc}
            alt={`${name} photo ${currentIndex + 1}`}
            className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] transition-all duration-500 animate-fade-in cursor-zoom-in"
            onClick={() => openLightbox(currentIndex)}
            title="Click to view full screen"
          />
        </div>

        {/* Prev / Next Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                prev();
                resetTimer();
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#29180C]/80 text-white backdrop-blur-md border border-[#D8A34F]/30 transition-all duration-200 hover:scale-105 hover:bg-[#382314] hover:border-[#D8A34F]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                next();
                resetTimer();
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#29180C]/80 text-white backdrop-blur-md border border-[#D8A34F]/30 transition-all duration-200 hover:scale-105 hover:bg-[#382314] hover:border-[#D8A34F]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* Bottom Floating Bar with Slide Counter and Dynamic Progress Dots */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto rounded-full bg-black/75 px-3 py-1 text-xs font-semibold tracking-wide text-gold-300 backdrop-blur-md border border-gold-400/20">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  aria-label={`Jump to photo ${i + 1}`}
                  onClick={() => {
                    setCurrentIndex(i);
                    resetTimer();
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === currentIndex
                      ? "w-6 bg-gold-400 shadow-[0_0_8px_rgba(212,174,88,0.7)]"
                      : "w-2 bg-white/40 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Lightbox Modal for Uncompromised High-Res Viewing */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg animate-fade-in p-4 sm:p-8"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close fullscreen view"
            className="absolute top-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-[#382314] hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Lightbox Caption */}
          <div className="absolute top-5 left-5 z-50 flex items-center gap-3 text-white">
            <span className="rounded-full bg-[#29180C] px-3.5 py-1 text-xs font-semibold text-[#D8A34F] border border-[#D8A34F]/30">
              {name}
            </span>
            <span className="text-xs text-white/70">
              Photo {lightboxIndex + 1} of {images.length}
            </span>
          </div>

          {/* Lightbox Image (100% natural, fitted perfectly, never cropped) */}
          <div
            className="relative flex h-[80vh] w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex]}
              alt={`${name} full view`}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all"
            />

            {/* Lightbox Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex(
                      (i) => (i - 1 + images.length) % images.length
                    )
                  }
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-[#29180C]/80 text-white border border-[#D8A34F]/40 hover:bg-[#382314] hover:border-[#D8A34F] transition-all"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((i) => (i + 1) % images.length)
                  }
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-[#29180C]/80 text-white border border-[#D8A34F]/40 hover:bg-[#382314] hover:border-[#D8A34F] transition-all"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Lightbox Thumbnails at bottom */}
          {images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className={cn(
                    "h-14 w-18 shrink-0 overflow-hidden rounded-md border-2 bg-stone-900 transition-all",
                    i === lightboxIndex
                      ? "border-gold-400 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={src}
                    alt={`thumb ${i + 1}`}
                    className="h-full w-full object-contain p-0.5"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
