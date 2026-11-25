import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
/**
 * Crawling policy. Unchanged in substance: every crawler may read the public pages, including search
 * crawlers used by AI answer engines (OAI-SearchBot, PerplexityBot, Bingbot, Googlebot). Training
 * crawlers (GPTBot, Google-Extended, CCBot…) are also allowed today, as before; restricting them is an
 * owner decision documented in docs/SEO_GEO_20261124.md and is deliberately not changed here.
 * robots.txt is not access control: /admin and /api are protected on the server.
 */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] }, sitemap: absoluteUrl("/sitemap.xml") };
}
