"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { brandLogo } from "@/lib/images";
import { siteConfig } from "@/lib/site";

const navLinksLeft = [
  { href: "/", label: "HOME" },
  { href: "/rooms", label: "ROOMS" },
  { href: "/facilities/saffron-manor-restaurant", label: "DINING" },
];

const facilityDropdownItems = [
  {
    href: "/facilities/banquet-hall",
    label: "Events & Banquet Hall",
    desc: "150+ seating, stage & catering",
  },
  {
    href: "/facilities/celebrations",
    label: "Celebrations & Parties",
    desc: "Surprise birthdays, anniversaries & milestones",
  },
  {
    href: "/attractions",
    label: "Nearby Attractions",
    desc: "Andal Temple & Ayyanar Falls",
  },
  {
    href: "/facilities/saffron-manor-restaurant",
    label: "Saffron Manor Restaurant",
    desc: "Chettinad & multi-cuisine feasts",
  },
  {
    href: "/facilities/swimming-pool",
    label: "Swimming Pool",
    desc: "Crystal-clear pool with deck",
  },
  {
    href: "/facilities/amil-cafe",
    label: "Amil Cafe",
    desc: "Fresh coffee, tea & snacks",
  },
  {
    href: "/facilities/kings-bar",
    label: "Kings Bar",
    desc: "Premium spirits & relaxed lounge",
  },
  {
    href: "/facilities/car-parking",
    label: "Ample Car Parking",
    desc: "Secure 24/7 on-site parking",
  },
];

const navLinksRight = [
  { href: "/policy", label: "PRIVACY" },
  { href: "/contact", label: "CONTACT" },
];

const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/facilities/saffron-manor-restaurant", label: "Dining" },
  { href: "/facilities", label: "Facilities" },
  { href: "/facilities/banquet-hall", label: "Banquet Hall" },
  { href: "/facilities/celebrations", label: "Celebrations & Parties" },
  { href: "/attractions", label: "Nearby Attractions" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/policy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact" },
];

function NavItem({
  href,
  label,
  pathname,
  onNavigate,
}: {
  href: string;
  label: string;
  pathname: string;
  onNavigate: () => void;
}) {
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative py-1 font-display text-sm xl:text-base font-semibold tracking-wide transition-all",
        isActive
          ? "text-[#c0262d] font-bold"
          : "text-black hover:text-[#c0262d]"
      )}
    >
      {label}
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#c0262d]"
        />
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);
  const facilitiesRef = useRef<HTMLDivElement>(null);
  const facilitiesBtnRef = useRef<HTMLButtonElement>(null);

  // Click outside & Escape support for Facilities dropdown
  useEffect(() => {
    if (!facilitiesOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFacilitiesOpen(false);
        facilitiesBtnRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (facilitiesRef.current && !facilitiesRef.current.contains(e.target as Node)) {
        setFacilitiesOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [facilitiesOpen]);

  const closeMenus = () => {
    setMenuOpen(false);
    setFacilitiesOpen(false);
  };

  const isFacilitiesActive = pathname.startsWith("/facilities") || pathname.startsWith("/attractions");

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm border-b border-maroon-100 transition-all duration-300">
      <nav className="mx-auto flex h-14 sm:h-15 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-6 flex-1 justify-end pr-4 xl:pr-6">
          {navLinksLeft.map((link) => (
            <NavItem
              key={link.href}
              {...link}
              pathname={pathname}
              onNavigate={closeMenus}
            />
          ))}

          {/* FACILITIES dropdown */}
          <div
            ref={facilitiesRef}
            className="relative py-1"
            onMouseEnter={() => setFacilitiesOpen(true)}
            onMouseLeave={() => setFacilitiesOpen(false)}
          >
            <button
              ref={facilitiesBtnRef}
              type="button"
              onClick={() => setFacilitiesOpen((v) => !v)}
              aria-expanded={facilitiesOpen}
              aria-controls="facilities-dropdown"
              aria-haspopup="true"
              className={cn(
                "relative flex items-center gap-1.5 py-1 font-display text-sm xl:text-base font-semibold tracking-wide transition-all cursor-pointer",
                isFacilitiesActive
                  ? "text-[#c0262d] font-bold"
                  : "text-black hover:text-[#c0262d]"
              )}
            >
              <span>FACILITIES</span>
              <svg
                viewBox="0 0 12 12"
                className={cn(
                  "h-3 w-3 text-black transition-transform duration-200",
                  facilitiesOpen && "rotate-180"
                )}
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 8.5 1.5 4h9z" />
              </svg>
              {isFacilitiesActive && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#c0262d]"
                />
              )}
            </button>

            {facilitiesOpen && (
              <div
                id="facilities-dropdown"
                className="animate-fade-in absolute left-1/2 -translate-x-1/2 top-full z-50 w-80 rounded-2xl border border-maroon-100/80 bg-white/95 p-2.5 shadow-2xl backdrop-blur-md ring-1 ring-black/5"
              >
                <div className="max-h-[380px] overflow-y-auto space-y-1">
                  {facilityDropdownItems.map((f) => (
                    <Link
                      key={f.href}
                      href={f.href}
                      onClick={closeMenus}
                      className="block rounded-xl px-3.5 py-2 transition-colors hover:bg-maroon-50 group"
                    >
                      <p className="text-xs font-bold text-maroon-900 group-hover:text-[#c0262d]">
                        {f.label}
                      </p>
                      <p className="text-[11px] text-muted line-clamp-1">{f.desc}</p>
                    </Link>
                  ))}
                </div>
                <div className="mt-2 border-t border-maroon-100 pt-2">
                  <Link
                    href="/facilities"
                    onClick={closeMenus}
                    className="block rounded-xl bg-gold-50/80 px-3.5 py-2 text-center text-xs font-bold uppercase tracking-wider text-maroon-900 transition-colors hover:bg-gold-100"
                  >
                    Explore All Facilities & Timings →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Logo */}
        <div className="flex items-center justify-center shrink-0">
          <Link
            href="/"
            onClick={closeMenus}
            aria-label="Hotel Amil Home"
            className="flex items-center transition-transform hover:scale-105"
          >
            <Image
              src={brandLogo}
              alt="Hotel Amil logo"
              width={180}
              height={90}
              priority
              className="h-8 sm:h-9 lg:h-10 w-auto object-contain transition-all duration-300"
            />
          </Link>
        </div>

        {/* Right Navigation Links & Book Now Button (Desktop) */}
        <div className="hidden lg:flex items-center gap-3.5 xl:gap-4.5 flex-1 justify-start pl-4 xl:pl-6">
          {navLinksRight.map((link) => (
            <NavItem
              key={link.href}
              {...link}
              pathname={pathname}
              onNavigate={closeMenus}
            />
          ))}

          <Link
            href="/rooms"
            onClick={closeMenus}
            className="flex items-center gap-1.5 rounded-md bg-[#c0262d] hover:bg-[#a51d23] active:scale-95 px-3 py-1.5 sm:px-3.5 sm:py-1.5 font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all shrink-0"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current shrink-0" aria-hidden>
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
            </svg>
            <span>BOOK NOW</span>
          </Link>
        </div>

        {/* Mobile Hamburger & Quick Book */}
        <div className="flex items-center gap-3 lg:hidden ml-auto">
          <Link
            href="/rooms"
            onClick={closeMenus}
            className="flex items-center gap-1.5 rounded-md bg-[#c0262d] px-3 py-1.5 text-xs font-bold uppercase text-white shadow-sm"
          >
            <span>BOOK NOW</span>
          </Link>
          <button
            type="button"
            className="p-2 text-black transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="animate-fade-in max-h-[calc(100dvh_-_4.5rem)] overflow-y-auto overscroll-contain border-t border-maroon-100 bg-white px-6 py-6 lg:hidden"
        >
          <div className="space-y-2">
            {mobileLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors hover:bg-maroon-50",
                    isActive ? "bg-maroon-50 text-[#c0262d]" : "text-maroon-900"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-maroon-100 space-y-3">
              <a
                href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`}
                className="flex items-center gap-2 px-3 text-sm font-semibold text-maroon-900"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-maroon-800" aria-hidden>
                  <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
                </svg>
                <span>{siteConfig.phones[0]}</span>
              </a>

              <Link
                href="/rooms"
                onClick={closeMenus}
                className="block rounded-lg bg-[#c0262d] px-5 py-3 text-center text-sm font-bold uppercase tracking-wider text-white shadow-md"
              >
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
