import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

export type HeroVariant =
  | "restaurant"
  | "rooms"
  | "facilities"
  | "attractions"
  | "contact"
  | "gallery"
  | "blog"
  | "policy"
  | "booking";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  variant?: HeroVariant;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  variant = "rooms",
  breadcrumbs,
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden text-white border-b border-[#29180C]/40 shadow-inner",
        className
      )}
      style={{
        background:
          "linear-gradient(110deg, #382314 0%, #4A301D 55%, #5B3B22 100%)",
      }}
    >
      {/* Subtle warm ambient radial highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D8A34F]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-[#E7B765]/10 blur-3xl"
      />

      {/* Thematic Decorative Illustration on the Right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 top-0 w-full sm:w-2/3 lg:w-1/2 flex items-end justify-end overflow-hidden select-none"
      >
        <HeroArt variant={variant} />
      </div>

      {/* Hero Content aligned to standard container */}
      <Container className="relative z-10 py-7 sm:py-8 lg:py-9">
        <div className="max-w-2xl">
          {/* Breadcrumbs if provided */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mb-3.5 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#F5EEE6]/75 font-sans"
            >
              {breadcrumbs.map((crumb, idx) => (
                <span key={crumb.label} className="flex items-center gap-2">
                  {idx > 0 && <span className="text-[#E7B765]/60">/</span>}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-white"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[#E7B765] font-semibold">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* Eyebrow Label */}
          {eyebrow && (
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#E7B765] font-sans">
              {eyebrow}
            </p>
          )}

          {/* Main Heading */}
          <h1 className="mt-2.5 font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-[1.15]">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-[#F5EEE6] font-sans max-w-xl">
              {description}
            </p>
          )}

          {/* Optional Actions / CTA */}
          {children && <div className="mt-5 sm:mt-6">{children}</div>}
        </div>
      </Container>
    </section>
  );
}

/**
 * Dedicated Thematic Vector Artworks for each page variant,
 * styled in Antique Gold (#D8A34F / #E7B765 / #C99745) tones
 * with varying opacities and gradients.
 */
function HeroArt({ variant }: { variant: HeroVariant }) {
  switch (variant) {
    case "restaurant":
      // The authentic culinary botanical / leaf branch requested by the user
      return (
        <svg
          viewBox="0 0 420 340"
          className="h-full w-auto max-h-[340px] opacity-80 sm:opacity-90 transform translate-x-6 sm:translate-x-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="leafGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C99745" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#D8A34F" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F2D18B" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A8732E" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#C99745" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#E7B765" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="stemGrad" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#8C5E28" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#C99745" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F5D491" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Central Stem */}
          <path
            d="M380 340 C360 260, 310 160, 210 60 C180 30, 150 15, 125 5"
            stroke="url(#stemGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Secondary Stem Offshoot */}
          <path
            d="M290 190 C250 170, 200 160, 150 155"
            stroke="url(#stemGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Leaf 1 - Bottom Right Large Leaf */}
          <path
            d="M365 290 C395 270, 420 220, 395 190 C365 210, 345 250, 365 290 Z"
            fill="url(#leafGrad1)"
          />
          <path
            d="M365 290 C375 250, 385 220, 395 190"
            stroke="#FFE6A8"
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />

          {/* Leaf 2 - Bottom Left Leaf */}
          <path
            d="M335 255 C290 265, 255 240, 260 205 C295 215, 325 235, 335 255 Z"
            fill="url(#leafGrad2)"
          />
          <path
            d="M335 255 C305 235, 280 220, 260 205"
            stroke="#FFE6A8"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />

          {/* Leaf 3 - Mid Right Upward Leaf */}
          <path
            d="M305 180 C345 160, 375 115, 360 85 C325 105, 295 145, 305 180 Z"
            fill="url(#leafGrad1)"
          />
          <path
            d="M305 180 C325 145, 345 115, 360 85"
            stroke="#FFE6A8"
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />

          {/* Leaf 4 - Mid Left Branch Leaf */}
          <path
            d="M255 145 C210 140, 175 110, 185 80 C215 95, 245 120, 255 145 Z"
            fill="url(#leafGrad2)"
          />
          <path
            d="M255 145 C225 120, 205 100, 185 80"
            stroke="#FFE6A8"
            strokeWidth="1"
            strokeOpacity="0.5"
          />

          {/* Leaf 5 - Offshoot Leaf A */}
          <path
            d="M200 160 C160 170, 125 155, 125 130 C155 135, 185 148, 200 160 Z"
            fill="url(#leafGrad1)"
          />

          {/* Leaf 6 - Upper Right Leaf */}
          <path
            d="M225 95 C260 75, 280 35, 265 15 C235 30, 215 65, 225 95 Z"
            fill="url(#leafGrad1)"
          />
          <path
            d="M225 95 C240 65, 255 40, 265 15"
            stroke="#FFE6A8"
            strokeWidth="1"
            strokeOpacity="0.6"
          />

          {/* Leaf 7 - Upper Left Leaf */}
          <path
            d="M180 65 C145 55, 120 30, 130 10 C155 20, 175 45, 180 65 Z"
            fill="url(#leafGrad2)"
          />

          {/* Leaf 8 - Terminal Bud Leaves */}
          <path
            d="M135 15 C115 5, 95 0, 90 2 C100 10, 115 15, 135 15 Z"
            fill="url(#leafGrad1)"
          />
          <path
            d="M125 5 C110 -5, 80 -10, 85 -5 C95 0, 110 5, 125 5 Z"
            fill="url(#leafGrad2)"
          />

          {/* Delicate Culinary Garnish Dots / Spices */}
          <circle cx="215" cy="55" r="3.5" fill="#F5D491" fillOpacity="0.75" />
          <circle cx="280" cy="185" r="3" fill="#F5D491" fillOpacity="0.75" />
          <circle cx="355" cy="285" r="3" fill="#F5D491" fillOpacity="0.75" />
          <circle cx="160" cy="155" r="2.5" fill="#F5D491" fillOpacity="0.6" />
        </svg>
      );

    case "rooms":
      // Hillside Sanctuary & Luxury Room Balcony Motif
      return (
        <svg
          viewBox="0 0 420 340"
          className="h-full w-auto max-h-[340px] opacity-80 sm:opacity-90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="roomGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A8732E" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#D8A34F" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F5D491" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Western Ghats Hill Contours */}
          <path
            d="M120 340 C170 270, 240 250, 310 280 C360 300, 390 320, 420 340"
            stroke="#D8A34F"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            strokeDasharray="4 4"
          />
          <path
            d="M180 340 C230 230, 310 200, 380 240 C400 255, 415 275, 420 290"
            stroke="#E7B765"
            strokeWidth="2"
            strokeOpacity="0.4"
          />

          {/* Arched Window & Hillside Balcony Line Art */}
          <path
            d="M260 340 V150 C260 90, 350 90, 350 150 V340"
            stroke="url(#roomGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M272 340 V155 C272 105, 338 105, 338 155 V340"
            stroke="#D8A34F"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          {/* Balcony Railing Details */}
          <line
            x1="250"
            y1="270"
            x2="360"
            y2="270"
            stroke="#E7B765"
            strokeWidth="2"
            strokeOpacity="0.6"
          />
          <line
            x1="250"
            y1="310"
            x2="360"
            y2="310"
            stroke="#E7B765"
            strokeWidth="2"
            strokeOpacity="0.6"
          />
          {[265, 285, 305, 325, 345].map((x) => (
            <line
              key={x}
              x1={x}
              y1="270"
              x2={x}
              y2="310"
              stroke="#D8A34F"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
          ))}

          {/* Serene Crescent Moon & Sanctuary Star */}
          <path
            d="M305 60 C320 60, 330 75, 325 90 C310 88, 300 78, 305 60 Z"
            fill="#F5D491"
            fillOpacity="0.75"
          />
          <circle cx="345" cy="55" r="2.5" fill="#FFE6A8" fillOpacity="0.8" />

          {/* Graceful Palm Frond Overhanging */}
          <path
            d="M420 40 C350 60, 270 50, 190 100"
            stroke="#D8A34F"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          <path
            d="M260 60 C240 85, 230 115, 235 130 C245 110, 260 85, 260 60 Z"
            fill="url(#roomGrad)"
          />
          <path
            d="M290 55 C280 80, 275 110, 285 125 C290 100, 300 75, 290 55 Z"
            fill="url(#roomGrad)"
          />
          <path
            d="M325 50 C325 80, 325 110, 335 120 C340 95, 340 70, 325 50 Z"
            fill="url(#roomGrad)"
          />
          <path
            d="M360 45 C370 70, 380 95, 395 105 C390 85, 380 65, 360 45 Z"
            fill="url(#roomGrad)"
          />
        </svg>
      );

    case "facilities":
      // Resort Lotus & Sparkling Ripple Pavilion
      return (
        <svg
          viewBox="0 0 420 340"
          className="h-full w-auto max-h-[340px] opacity-80 sm:opacity-90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lotusGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#A8732E" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#D8A34F" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFE6A8" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Water Ripple Rings */}
          <ellipse
            cx="300"
            cy="270"
            rx="110"
            ry="28"
            stroke="#D8A34F"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          <ellipse
            cx="300"
            cy="270"
            rx="75"
            ry="18"
            stroke="#E7B765"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <ellipse
            cx="300"
            cy="270"
            rx="40"
            ry="10"
            stroke="#FFE6A8"
            strokeWidth="1.5"
            strokeOpacity="0.65"
          />

          {/* Center Lotus Blossom */}
          {/* Center Petal */}
          <path
            d="M300 260 C290 210, 290 170, 300 140 C310 170, 310 210, 300 260 Z"
            fill="url(#lotusGrad)"
          />
          {/* Inner Petals */}
          <path
            d="M300 260 C280 220, 260 190, 275 160 C290 185, 300 225, 300 260 Z"
            fill="url(#lotusGrad)"
            fillOpacity="0.85"
          />
          <path
            d="M300 260 C320 220, 340 190, 325 160 C310 185, 300 225, 300 260 Z"
            fill="url(#lotusGrad)"
            fillOpacity="0.85"
          />
          {/* Outer Petals */}
          <path
            d="M300 260 C270 235, 235 215, 245 190 C265 205, 285 235, 300 260 Z"
            fill="url(#lotusGrad)"
            fillOpacity="0.7"
          />
          <path
            d="M300 260 C330 235, 365 215, 355 190 C335 205, 315 235, 300 260 Z"
            fill="url(#lotusGrad)"
            fillOpacity="0.7"
          />

          {/* Architectural Heritage Pavilion Arch Frame */}
          <path
            d="M210 340 V170 C210 110, 260 80, 300 60 C340 80, 390 110, 390 170 V340"
            stroke="#D8A34F"
            strokeWidth="2"
            strokeOpacity="0.4"
          />
          <circle cx="300" cy="50" r="4" fill="#FFE6A8" fillOpacity="0.9" />
        </svg>
      );

    case "attractions":
      // Sacred Heritage Temple (Srivilliputhur Andal Gopuram & Theppakulam) in Antique Gold Etching
      return (
        <div className="relative h-full w-full flex items-end justify-end select-none pointer-events-none">
          <Image
            src="/images/attractions/temple-golden-etching@2x.png"
            alt="Srivilliputhur Andal Temple & Andal Thirukkulam sacred heritage architecture"
            width={948}
            height={464}
            priority
            className="h-full w-auto max-h-[300px] sm:max-h-[340px] lg:max-h-[380px] object-contain object-right-bottom opacity-80 sm:opacity-95 lg:opacity-100 transition-opacity duration-300"
          />
        </div>
      );

    case "contact":
      // Concierge Hospitality Crest & Lantern
      return (
        <svg
          viewBox="0 0 420 340"
          className="h-full w-auto max-h-[340px] opacity-80 sm:opacity-90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE6A8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C99745" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Classic Royal Shield Outline */}
          <path
            d="M300 70 C340 70, 370 85, 370 120 C370 200, 300 250, 300 270 C300 250, 230 200, 230 120 C230 85, 260 70, 300 70 Z"
            stroke="url(#crestGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M300 85 C330 85, 355 98, 355 125 C355 190, 300 235, 300 250 C300 235, 245 190, 245 125 C245 98, 270 85, 300 85 Z"
            stroke="#D8A34F"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />

          {/* Letter "A" monogram inside shield */}
          <path
            d="M300 110 L280 180 M300 110 L320 180 M286 160 H314"
            stroke="#FFE6A8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Symmetrical Laurel Sprigs Embracing Shield */}
          <path
            d="M210 230 C200 170, 215 110, 250 70"
            stroke="#D8A34F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
          <path
            d="M390 230 C400 170, 385 110, 350 70"
            stroke="#D8A34F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />

          {/* Welcoming Lantern Light Rays */}
          <circle cx="300" cy="50" r="3.5" fill="#FFE6A8" />
          <line x1="300" y1="35" x2="300" y2="42" stroke="#FFE6A8" strokeWidth="1.5" />
          <line x1="285" y1="50" x2="292" y2="50" stroke="#FFE6A8" strokeWidth="1.5" />
          <line x1="308" y1="50" x2="315" y2="50" stroke="#FFE6A8" strokeWidth="1.5" />
        </svg>
      );

    case "gallery":
      // Artistic Aperture & Botanical Flourish
      return (
        <svg
          viewBox="0 0 420 340"
          className="h-full w-auto max-h-[340px] opacity-80 sm:opacity-90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concentric Golden Viewfinder Rings */}
          <circle
            cx="310"
            cy="170"
            r="90"
            stroke="#D8A34F"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          <circle
            cx="310"
            cy="170"
            r="65"
            stroke="#E7B765"
            strokeWidth="2"
            strokeOpacity="0.6"
          />
          <circle
            cx="310"
            cy="170"
            r="38"
            stroke="#FFE6A8"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />

          {/* Viewfinder Corner Framing Brackets */}
          <path
            d="M190 80 H215 V105"
            stroke="#FFE6A8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M400 80 H375 V105"
            stroke="#FFE6A8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M190 260 H215 V235"
            stroke="#FFE6A8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M400 260 H375 V235"
            stroke="#FFE6A8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Dynamic Lens Aperture Blades */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line
              key={angle}
              x1="310"
              y1="170"
              x2={310 + 65 * Math.cos((angle * Math.PI) / 180)}
              y2={170 + 65 * Math.sin((angle * Math.PI) / 180)}
              stroke="#D8A34F"
              strokeWidth="1.2"
              strokeOpacity="0.4"
            />
          ))}
        </svg>
      );

    case "blog":
      // Literary Quill & Editorial Laurel
      return (
        <svg
          viewBox="0 0 420 340"
          className="h-full w-auto max-h-[340px] opacity-80 sm:opacity-90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Elegant Writer's Feather Quill */}
          <path
            d="M380 40 C340 70, 310 130, 270 210 L250 265 L275 255 C315 200, 350 120, 380 40 Z"
            fill="#D8A34F"
            fillOpacity="0.45"
            stroke="#FFE6A8"
            strokeWidth="1.5"
          />
          {/* Feather Quill Vane Details */}
          <path
            d="M380 40 L245 280"
            stroke="#FFE6A8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M245 280 L238 295"
            stroke="#FFE6A8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Open Journal / Chronicle Page Lines */}
          <path
            d="M170 300 C210 290, 250 295, 290 305 V215 C250 205, 210 200, 170 210 Z"
            stroke="#D8A34F"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <path
            d="M290 305 C330 295, 370 290, 410 300 V210 C370 200, 330 205, 290 215 Z"
            stroke="#D8A34F"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          {/* Editorial Writing Lines */}
          <line
            x1="190"
            y1="235"
            x2="265"
            y2="230"
            stroke="#E7B765"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          <line
            x1="190"
            y1="255"
            x2="265"
            y2="250"
            stroke="#E7B765"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          <line
            x1="190"
            y1="275"
            x2="245"
            y2="270"
            stroke="#E7B765"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
        </svg>
      );

    case "policy":
      // Luxury Hotel Seal & Safety Laurel
      return (
        <svg
          viewBox="0 0 420 340"
          className="h-full w-auto max-h-[340px] opacity-80 sm:opacity-90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Symmetrical Circular Security & Quality Seal */}
          <circle
            cx="300"
            cy="170"
            r="85"
            stroke="#D8A34F"
            strokeWidth="2"
            strokeOpacity="0.5"
          />
          <circle
            cx="300"
            cy="170"
            r="70"
            stroke="#E7B765"
            strokeWidth="1.5"
            strokeOpacity="0.7"
            strokeDasharray="6 4"
          />

          {/* Central 5-Point Quality Star */}
          <polygon
            points="300,125 308,150 335,150 313,165 321,190 300,175 279,190 287,165 265,150 292,150"
            fill="#FFE6A8"
            fillOpacity="0.75"
            stroke="#D8A34F"
            strokeWidth="1"
          />

          {/* Bottom Ribbon / Sash Banner */}
          <path
            d="M220 270 L260 250 L300 260 L340 250 L380 270 L350 290 L300 280 L250 290 Z"
            fill="#C99745"
            fillOpacity="0.5"
            stroke="#FFE6A8"
            strokeWidth="1.5"
          />
        </svg>
      );

    case "booking":
      // Vintage Brass Hotel Key & Royal Shield
      return (
        <svg
          viewBox="0 0 420 340"
          className="h-full w-auto max-h-[340px] opacity-80 sm:opacity-90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE6A8" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#D8A34F" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#8C5E28" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Ornate Key Bow / Head */}
          <circle
            cx="240"
            cy="120"
            r="35"
            stroke="url(#keyGrad)"
            strokeWidth="4"
          />
          <circle
            cx="240"
            cy="120"
            r="16"
            stroke="#FFE6A8"
            strokeWidth="2"
            strokeOpacity="0.8"
          />

          {/* Key Shaft extending downwards to the right */}
          <path
            d="M265 145 L360 240"
            stroke="url(#keyGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Key Bit / Teeth */}
          <path
            d="M340 220 L355 205 M350 230 L368 212 M358 238 L375 221"
            stroke="#FFE6A8"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Tassel / Ribbon flourishes */}
          <path
            d="M220 145 C190 180, 205 230, 185 270"
            stroke="#D8A34F"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeOpacity="0.5"
          />
        </svg>
      );
  }
}

