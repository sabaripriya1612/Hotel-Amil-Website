import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/chat/WhatsAppButton";
import { ChatWidget } from "@/components/chat/ChatWidget";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hotelamil.com"),
  title: {
    default: "Hotel Amil — 3-Star Luxury Hotel in Rajapalayam",
    template: "%s | Hotel Amil Rajapalayam",
  },
  description:
    "Hotel Amil is a premier 3-star hotel in Rajapalayam offering luxury executive & family rooms, multi-cuisine dining, outdoor swimming pool, and grand banquet halls.",
  keywords: [
    "hotel in Rajapalayam",
    "3 star hotel Rajapalayam",
    "Hotel Amil",
    "luxury rooms Rajapalayam",
    "banquet hall Rajapalayam",
    "swimming pool hotel Rajapalayam",
    "Saffron restaurant",
  ],
  openGraph: {
    title: "Hotel Amil — 3-Star Luxury Hotel in Rajapalayam",
    description:
      "Deluxe rooms, family rooms, swimming pool, banquet hall & multi-cuisine restaurant in Rajapalayam, Tamil Nadu.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#5c0f1c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased text-ink bg-cream selection:bg-gold-200 selection:text-maroon-900">
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <WhatsAppButton />
        <ChatWidget />
      </body>
    </html>
  );
}