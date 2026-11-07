"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Slide = { src: string; alt: string };

const INTERVAL_MS = 4500;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function HeroSlider({
  slides,
  dotsClassName,
}: {
  slides: Slide[];
  dotsClassName?: string;
}) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => setCurrent(clamp(i, 0, slides.length - 1)),
    [slides.length]
  );
  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    timer.current = setInterval(next, INTERVAL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [next, current]);

  const restart = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(next, INTERVAL_MS);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#140E0C] via-[#1E1614] to-[#100B09]">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i === current ? undefined : true}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1000ms] ease-in-out",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          )}
        >
          {/* Extended full-bleed hero image spanning edge-to-edge */}
          <img
            src={slide.src}
            alt={slide.alt}
            className="h-full w-full object-cover object-center"
          />
        </div>
      ))}

      {/* Arrows matching luxury theme */}
      <button
        type="button"
        onClick={() => {
          prev();
          restart();
        }}
        aria-label="Previous photo"
        className="absolute left-3 sm:left-6 top-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-all hover:bg-black/70 hover:scale-105 cursor-pointer shadow-lg"
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
        className="absolute right-3 sm:right-6 top-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-all hover:bg-black/70 hover:scale-105 cursor-pointer shadow-lg"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dots indicator with a dark frosted pill for contrast against all photo backgrounds */}
      <div
        className={cn(
          "absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 transition-all",
          dotsClassName || "bottom-16 sm:bottom-20"
        )}
      >
        <div className="flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 backdrop-blur-md border border-white/15 shadow-md">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => {
                goTo(i);
                restart();
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current
                  ? "w-6 bg-[#D8A34F]"
                  : "w-2 bg-white/60 hover:bg-white"
              )}
            />
          ))}
        </div>
      </div>

      {/* Touch swipe */}
      <div
        className="absolute inset-0 z-10"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 40) {
            if (dx < 0) next();
            else prev();
            restart();
          }
          touchStartX.current = null;
        }}
      />
    </div>
  );
}