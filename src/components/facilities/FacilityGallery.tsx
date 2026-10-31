"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

const INTERVAL_MS = 4500;

export function FacilityGallery({ name, slides }: { name: string; slides: string[] }) {
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length]
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (slides.length < 2) return;
    timer.current = setInterval(next, INTERVAL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [next, current, slides.length]);

  const restart = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(next, INTERVAL_MS);
  };

  if (slides.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Auto-rotating main photo */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
        {slides.map((src, i) => (
          <div
            key={src}
            aria-hidden={i === current ? undefined : true}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              i === current ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={src}
              alt={`${name} at Hotel Amil, Rajapalayam ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                prev();
                restart();
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-maroon-950/40 text-white backdrop-blur transition-colors hover:bg-maroon-900/70"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                next();
                restart();
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-maroon-950/40 text-white backdrop-blur transition-colors hover:bg-maroon-900/70"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
              {slides.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Show photo ${i + 1}`}
                  onClick={() => {
                    setCurrent(i);
                    restart();
                  }}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    i === current ? "w-7 bg-gold-400" : "w-2.5 bg-white/60 hover:bg-white"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {slides.length > 1 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {slides.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                setCurrent(i);
                restart();
              }}
              className={cn(
                "relative aspect-[2/1] overflow-hidden rounded-lg ring-2 transition-all",
                i === current ? "ring-gold-500" : "ring-transparent hover:ring-gold-300"
              )}
            >
              <Image
                src={src}
                alt={`${name} photo ${i + 1}`}
                fill
                sizes="200px"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}