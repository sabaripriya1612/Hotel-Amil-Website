"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { brandLogo } from "@/lib/images";
import { siteConfig } from "@/lib/site";
import { cartCount, subscribeCart, getCartCountServerSnapshot } from "@/lib/cart";

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
    label: "Saffron Restaurant",
    desc: "Multi-cuisine dining & outdoor catering",
  },
  {
    href: "/menu",
    label: "Food Menu",
    desc: "Breakfast, lunch, dinner & starters",
  },
  {
    href: "/facilities/swimming-pool",
    label: "Swimming Pool",
    desc: "Crystal-clear pool with deck",
  },
  {
    href: "/facilities/amil-cafe",
    label: "Amil Café Shop",
    desc: "In-house café serving fresh beverages & quick bites",
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
  { href: "/contact", label: "CONTACT" },
];

const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/facilities/saffron-manor-restaurant", label: "Dining" },
  { href: "/menu", label: "Food Menu" },
  { href: "/facilities", label: "Facilities" },
  { href: "/facilities/banquet-hall", label: "Banquet Hall" },
  { href: "/facilities/celebrations", label: "Celebrations & Parties" },
  { href: "/attractions", label: "Nearby Attractions" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/cart", label: "Cart" },
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
        "relative py-1 px-1 font-display text-sm xl:text-base font-medium tracking-wide transition-colors",
        isActive
          ? "text-[#382314] font-semibold"
          : "text-stone-700 hover:text-[#382314]"
      )}
    >
      {label}
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#382314]"
        />
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);
  const cartItemsCount = useSyncExternalStore(
    subscribeCart,
    cartCount,
    getCartCountServerSnapshot
  );
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
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#382314]/10 shadow-xs transition-all duration-300">
      <nav className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-9 flex-1 justify-end pr-7 lg:pr-9">
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
                "relative flex items-center gap-1.5 py-1 px-1 font-display text-sm xl:text-base font-semibold tracking-wider transition-colors cursor-pointer",
                isFacilitiesActive
                  ? "text-[#382314]"
                  : "text-stone-700 hover:text-[#382314]"
              )}
            >
              <span>FACILITIES</span>
              <svg
                viewBox="0 0 12 12"
                className={cn(
                  "h-3 w-3 text-stone-500 transition-transform duration-200",
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
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#382314]"
                />
              )}
            </button>

            {facilitiesOpen && (
              <div
                id="facilities-dropdown"
                className="animate-fade-in absolute left-1/2 -translate-x-1/2 top-full z-50 w-80 rounded-2xl border border-stone-200/90 bg-[#FAF7F2]/98 p-2.5 shadow-2xl backdrop-blur-md ring-1 ring-black/5"
              >
                <div className="max-h-[380px] overflow-y-auto space-y-1">
                  {facilityDropdownItems.map((f) => (
                    <Link
                      key={f.href}
                      href={f.href}
                      onClick={closeMenus}
                      className="block rounded-xl px-3.5 py-2 transition-colors hover:bg-stone-50 group"
                    >
                      <p className="text-xs font-semibold text-stone-800 group-hover:text-[#382314]">
                        {f.label}
                      </p>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{f.desc}</p>
                    </Link>
                  ))}
                </div>
                <div className="mt-2 border-t border-stone-100 pt-2">
                  <Link
                    href="/facilities"
                    onClick={closeMenus}
                    className="block rounded-xl bg-[#FAF8F5] px-3.5 py-2 text-center text-xs font-semibold uppercase tracking-wider text-[#382314] transition-colors hover:bg-[#F2EFE9]"
                  >
                    Explore All Facilities & Timings →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Logo (Slightly increased in size for enhanced elegance) */}
        <div className="flex items-center justify-center shrink-0 px-2">
          <Link
            href="/"
            onClick={closeMenus}
            aria-label="Hotel Amil Home"
            className="flex items-center transition-transform hover:scale-105"
          >
            <Image
              src={brandLogo}
              alt="Hotel Amil logo"
              width={190}
              height={95}
              priority
              className="h-10 sm:h-11 lg:h-12 w-auto object-contain transition-all duration-300"
            />
          </Link>
        </div>

        {/* Right Navigation Links, Cart & Book Now Button (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-start pl-7 lg:pl-9">
          {navLinksRight.map((link) => (
            <NavItem
              key={link.href}
              {...link}
              pathname={pathname}
              onNavigate={closeMenus}
            />
          ))}

          {/* Cart Link (Text only, no logo) */}
          <Link
            href="/cart"
            onClick={closeMenus}
            aria-label={`Booking cart with ${cartItemsCount} items`}
            className={cn(
              "relative flex items-center gap-1.5 py-1 px-1 font-display text-sm xl:text-base font-medium tracking-wide transition-colors",
              pathname === "/cart"
                ? "text-[#382314] font-semibold"
                : "text-stone-700 hover:text-[#382314]"
            )}
          >
            <span>CART</span>
            {cartItemsCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#382314] px-1.5 text-[10px] font-bold text-[#E7B765] shadow-xs">
                {cartItemsCount}
              </span>
            )}
            {pathname === "/cart" && (
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#382314]"
              />
            )}
          </Link>

          {/* Book Now Button: Dark Espresso Enamel with Antique Gold Rim */}
          <Link
            href="/rooms"
            onClick={closeMenus}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4.5 py-1.5 sm:px-5 sm:py-2 font-display text-xs sm:text-[12.5px] font-semibold uppercase tracking-[0.16em] text-[#F0DCBE] transition-all duration-300 ease-out cursor-pointer select-none active:scale-97 shrink-0 border-[1.5px] border-[#D4A346] hover:border-[#E8B85A] hover:text-[#FFF6E9] shadow-[0_2px_8px_rgba(20,10,5,0.3),inset_0_1px_1px_rgba(255,235,180,0.18)] hover:shadow-[0_4px_14px_rgba(30,16,8,0.45),inset_0_1px_1.5px_rgba(255,235,180,0.28)]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 25%, #3E2716 0%, #25160C 65%, #150B05 100%)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 fill-[#D4A346] transition-transform duration-300 group-hover:scale-105 group-hover:fill-[#E8B85A]"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm14 6H4v12h16V8zm-13 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"
                />
              </svg>
              <span>BOOK NOW</span>
            </span>
          </Link>
        </div>

        {/* Mobile Actions: Cart, Quick Book & Hamburger */}
        <div className="flex items-center gap-2 lg:hidden ml-auto">
          {/* Mobile Cart Button (Text only) */}
          <Link
            href="/cart"
            onClick={closeMenus}
            aria-label={`Booking cart with ${cartItemsCount} items`}
            className={cn(
              "relative flex items-center gap-1 px-2 py-1 font-display text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-[#382314] transition-colors rounded-lg",
              pathname === "/cart" && "text-[#382314] font-bold"
            )}
          >
            <span>CART</span>
            {cartItemsCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#382314] px-1 text-[9px] font-bold text-[#E7B765]">
                {cartItemsCount}
              </span>
            )}
          </Link>

          <Link
            href="/rooms"
            onClick={closeMenus}
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F0DCBE] transition-all shrink-0 border-[1.5px] border-[#D4A346] shadow-xs active:scale-97 hover:border-[#E8B85A] hover:text-[#FFF6E9]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 25%, #3E2716 0%, #25160C 65%, #150B05 100%)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 shrink-0 fill-[#D4A346] group-hover:fill-[#E8B85A]"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm14 6H4v12h16V8zm-13 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"
              />
            </svg>
            <span>BOOK NOW</span>
          </Link>
          <button
            type="button"
            className="p-2 text-stone-800 hover:text-[#382314] transition-colors cursor-pointer"
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
          className="animate-fade-in max-h-[calc(100dvh_-_4.5rem)] overflow-y-auto overscroll-contain border-t border-stone-200/90 bg-[#FAF7F2] px-6 py-6 lg:hidden"
        >
          <div className="space-y-1">
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
                    "block rounded-xl px-4 py-2.5 text-sm font-medium tracking-wide transition-colors hover:bg-stone-50",
                    isActive ? "bg-[#382314]/10 text-[#382314] font-semibold" : "text-stone-800"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-5 border-t border-stone-200 space-y-3">
              <a
                href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 px-3 text-sm font-medium text-stone-700"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#382314]" aria-hidden>
                  <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
                </svg>
                <span>{siteConfig.phones[0]}</span>
              </a>

              <Link
                href="/rooms"
                onClick={closeMenus}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full py-2.5 px-5 font-display text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#F0DCBE] transition-all border-[1.5px] border-[#D4A346] shadow-md active:scale-98 hover:border-[#E8B85A] hover:text-[#FFF6E9]"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 25%, #3E2716 0%, #25160C 65%, #150B05 100%)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 fill-[#D4A346] group-hover:fill-[#E8B85A]"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm14 6H4v12h16V8zm-13 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"
                  />
                </svg>
                <span>BOOK NOW</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
