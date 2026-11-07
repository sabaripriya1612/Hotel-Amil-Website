"use client";

import { useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { reviews } from "@/lib/reviews";

/** Google-style reviews widget: big rating summary on the left, Google-posted review
 *  cards in a horizontally scrollable carousel on the right (matches Google's layout). */

function RatingStars({ value, size }: { value: number; size: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          aria-hidden="true"
          fill={n <= value ? "#f4b400" : "#dadce0"}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" role="img" aria-label="Verified review">
      <path
        fill="#4285f4"
        d="M12 1.5l2.05 1.5 2.54-.29.98 2.39 2.39.98-.29 2.54L21.5 12l-1.5 2.05.29 2.54-2.39.98-.98 2.39-2.54-.29L12 22.5l-2.05-1.5-2.54.29-.98-2.39-2.39-.98.29-2.54L2.5 12l1.5-2.05-.29-2.54 2.39-.98.98-2.39 2.54.29z"
      />
      <path fill="#fff" d="M10.6 15.4l-2.9-2.9 1.2-1.2 1.7 1.7 4-4 1.2 1.2z" />
    </svg>
  );
}

export function GoogleReviews() {
  const trackRef = useRef<HTMLDivElement>(null);

  /** Advance one card; wrap back to the start when the end is reached. */
  const scrollNext = () => {
    const el = trackRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    el.scrollBy({ left: atEnd ? -el.scrollLeft : 336, behavior: "smooth" });
  };

  return (
    <section className="bg-[#FAF8F5] py-16 sm:py-20 border-t border-stone-200/80">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-14">
          {/* Rating summary */}
          <div>
            <p className="font-display text-4xl font-normal tracking-tight text-[#1C1917] sm:text-5xl">EXCELLENT</p>
            <div className="mt-4">
              <RatingStars value={4} size={36} />
            </div>
            <p className="mt-4 text-base text-stone-600 font-sans">
              Based on <span className="font-bold text-[#1C1917]">2,828+</span> verified guest reviews
            </p>
            <Image
              src="/images/google-logo.png"
              alt="Google"
              width={184}
              height={60}
              className="mt-6 h-7 w-auto"
            />
          </div>

          {/* Google-posted review cards */}
          <div className="relative min-w-0">
            <div
              ref={trackRef}
              className="flex snap-x gap-4 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="w-[300px] shrink-0 snap-start rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-[#382314]/30 hover:shadow-md sm:w-[320px]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#382314] text-sm font-semibold text-white">
                      {review.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-stone-900">{review.name}</p>
                      <p className="text-xs text-stone-500 font-sans">{review.date}</p>
                    </div>
                    <Image
                      src="/images/google-g.png"
                      alt="Posted on Google"
                      width={128}
                      height={128}
                      className="ml-auto h-5 w-5 shrink-0"
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <RatingStars value={review.rating} size={16} />
                    <VerifiedBadge />
                  </div>
                  <p className="mt-3.5 text-sm leading-relaxed text-stone-600 font-sans">{review.comment}</p>
                </article>
              ))}
            </div>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Show next reviews"
              className="absolute -right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#382314] text-white shadow-md transition-all hover:scale-105 hover:bg-[#4A301D] cursor-pointer border border-white/20"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-[#D8A34F]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
