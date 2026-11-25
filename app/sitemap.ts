import type { MetadataRoute } from "next";
import { absoluteUrl, publicRoutes } from "@/lib/seo";
import { publishedPosts } from "@/lib/blog";
/** Generated from the registry of public pages and published articles only. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = publicRoutes.map(r => ({ url: absoluteUrl(r.path), lastModified: r.updated, changeFrequency: r.changeFrequency, priority: r.priority }));
  const posts = publishedPosts();
  const blog = posts.length ? [{ url: absoluteUrl("/blog"), lastModified: posts[0].updated, changeFrequency: "weekly" as const, priority: 0.6 }] : [];
  return [...pages, ...blog, ...posts.map(p => ({ url: absoluteUrl("/blog/" + p.slug), lastModified: p.updated, changeFrequency: "monthly" as const, priority: 0.6 }))];
}
