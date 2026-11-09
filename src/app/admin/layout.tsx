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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {children}
    </div>
  );
}
