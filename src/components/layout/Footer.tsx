import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { siteConfig, hotelPolicies } from "@/lib/site";
import { brandLogo } from "@/lib/images";

const quickLinks = [
  { href: "/rooms", label: "Our Rooms" },
  { href: "/facilities", label: "Facilities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/attractions", label: "Nearby Attractions" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer className="bg-white text-stone-800 border-t border-stone-200">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="inline-flex">
              <Image
                src={brandLogo}
                alt="Hotel Amil logo"
                width={164}
                height={96}
                className="h-12 w-auto object-contain"
              />
            </span>
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              {siteConfig.tagline}. {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-[#c0262d]">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-medium text-stone-700 transition-colors hover:text-[#c0262d]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-[#c0262d]">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-700">
              <li>{siteConfig.address}</li>
              {siteConfig.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-medium hover:text-[#c0262d]">
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <span className="text-stone-500">Grievance:</span>{" "}
                <a href={`tel:${siteConfig.grievancePhone.replace(/\s/g, "")}`} className="font-medium hover:text-[#c0262d]">
                  {siteConfig.grievancePhone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-[#c0262d]">Good to Know</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-700">
              <li>Check-in / Check-out: {hotelPolicies.checkInTime} – {hotelPolicies.checkOutTime}</li>
              <li>CP Plan: Complimentary breakfast {hotelPolicies.cpPlan.breakfastTime}</li>
              <li>Children below {siteConfig.freeChildAge} stay free</li>
              <li>Free ample car parking</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-6 text-center text-xs text-stone-500">
          Copyright © {new Date().getFullYear()} Hotel Amil, Rajapalayam, Tamil Nadu, India
        </div>
      </Container>
    </footer>
  );
}