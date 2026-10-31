import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Front Desk & Admin Portal | Hotel Amil Rajapalayam",
  description: "Administrative command center and reservation management for Hotel Amil front-desk staff.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 antialiased">
      {children}
    </div>
  );
}
