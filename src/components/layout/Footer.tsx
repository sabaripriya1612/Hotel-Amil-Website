import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { siteConfig, hotelPolicies } from "@/lib/site";
import { brandLogo } from "@/lib/images";

const quickLinks = [
  { href: "/rooms", label: "Our Rooms" },
  { href: "/facilities/saffron-manor-restaurant", label: "Saffron Restaurant" },
  { href: "/facilities/amil-cafe", label: "Amil Café Shop" },
  { href: "/menu", label: "Food Menu" },
  { href: "/facilities", label: "Facilities & Experiences" },
  { href: "/attractions", label: "Nearby Attractions" },
  { href: "/gallery", label: "Photo Gallery" },
  { href: "/blog", label: "Travel Blog" },
  { href: "/contact", label: "Contact Us" },
];

const legalLinks = [
  { href: "/policy#privacy", label: "Privacy Policy" },
  { href: "/policy#terms", label: "Terms & Conditions" },
  { href: "/policy", label: "Hotel Policies & Rules" },
  { href: "/policy", label: "Swimming Pool Guidelines" },
  { href: "/policy", label: "Cancellation & Refunds" },
];

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden text-[#F5EEE6] border-t border-[#D8A34F]/30 shadow-2xl"
      style={{
        background:
          "linear-gradient(110deg, #382314 0%, #4A301D 55%, #5B3B22 100%)",
      }}
    >
      {/* Subtle warm ambient radial highlights matching luxury PageHero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D8A34F]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-[#E7B765]/10 blur-3xl"
      />

      <Container className="relative z-10 py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Introduction */}
          <div>
            <span className="inline-flex rounded-2xl bg-white/95 px-4 py-2.5 shadow-md">
              <Image
                src={brandLogo}
                alt="Hotel Amil logo"
                width={164}
                height={96}
                className="h-11 w-auto object-contain"
              />
            </span>
            <p className="mt-4 text-sm leading-relaxed text-[#F5EEE6]/80 font-sans">
              {siteConfig.tagline}. {siteConfig.description}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-px w-10 bg-[#D8A34F]/40" />
              <div className="h-1.5 w-1.5 rotate-45 bg-[#D8A34F]" />
              <div className="h-px w-10 bg-[#D8A34F]/40" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-medium tracking-tight text-white">
              Quick Links
            </h3>
            <div className="mt-2 mb-4 h-0.5 w-7 rounded-full bg-[#D8A34F]" />
            <ul className="space-y-2.5 font-sans">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-normal text-[#F5EEE6]/80 transition-colors hover:text-[#E7B765]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h3 className="font-display text-lg font-medium tracking-tight text-white">
              Policies &amp; Legal
            </h3>
            <div className="mt-2 mb-4 h-0.5 w-7 rounded-full bg-[#D8A34F]" />
            <ul className="space-y-2.5 font-sans">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-normal text-[#F5EEE6]/80 transition-colors hover:text-[#E7B765]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Essential Info */}
          <div>
            <h3 className="font-display text-lg font-medium tracking-tight text-white">
              Contact &amp; Timings
            </h3>
            <div className="mt-2 mb-4 h-0.5 w-7 rounded-full bg-[#D8A34F]" />
            <ul className="space-y-2.5 text-sm text-[#F5EEE6]/85 font-sans">
              <li className="leading-relaxed">{siteConfig.address}</li>
              {siteConfig.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="font-medium text-white hover:text-[#E7B765] transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li className="pt-1">
                <span className="text-[#E7B765] font-semibold">Grievance:</span>{" "}
                <a
                  href={`tel:${siteConfig.grievancePhone.replace(/\s/g, "")}`}
                  className="font-medium text-white hover:text-[#E7B765] transition-colors"
                >
                  {siteConfig.grievancePhone}
                </a>
              </li>
              <li className="pt-2 text-xs text-[#F5EEE6]/70 border-t border-[#D8A34F]/20">
                Check-in {hotelPolicies.checkInTime} · Check-out {hotelPolicies.checkOutTime}
              </li>
              <li className="text-xs text-[#F5EEE6]/70">
                CP Plan: Breakfast {hotelPolicies.cpPlan.breakfastTime}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="mt-12 border-t border-[#D8A34F]/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5EEE6]/65 font-sans">
          <p className="text-center sm:text-left">
            Copyright © {new Date().getFullYear()} Hotel Amil, Rajapalayam, Tamil Nadu, India · All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/policy#privacy"
              className="hover:text-[#E7B765] transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-[#D8A34F]/40">·</span>
            <Link
              href="/policy#terms"
              className="hover:text-[#E7B765] transition-colors"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}