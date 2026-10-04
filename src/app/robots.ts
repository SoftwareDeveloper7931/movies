import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/cron/", "/api/cron/*", "/api/dmca"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
