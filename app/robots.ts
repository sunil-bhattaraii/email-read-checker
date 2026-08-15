import type { MetadataRoute } from "next";

const siteUrl =
  process.env.APP_URL ?? "https://readmail.sunil-bhattarai.com.np";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
