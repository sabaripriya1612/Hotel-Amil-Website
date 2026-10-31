import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hotelamil.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/checkout", "/booking-confirmation"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
