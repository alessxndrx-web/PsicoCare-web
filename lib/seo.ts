import type { Metadata } from "next";
import { androidDownload } from "@/lib/downloads";
import { site } from "@/lib/content";

/** Public production origin. SITE_URL wins; the fallback is the current public Vercel domain. */
export const DEFAULT_ORIGIN = "https://psico-care-web.vercel.app";
export function siteOrigin(): string {
  try { return new URL(process.env.SITE_URL ?? DEFAULT_ORIGIN).origin; } catch { return DEFAULT_ORIGIN; }
}
export const absoluteUrl = (path: string) => siteOrigin() + (path === "/" ? "" : path);

/** Brand spellings people actually search; the visible brand stays «Psico Care». */
export const BRAND_ALTERNATE_NAMES = ["PsicoCare", "Psico Care Nicaragua"] as const;

/**
 * Indexable public pages. The sitemap is generated from this list, so a page is only listed once it
 * exists with real content. `updated` is the real date of the last content change (YYYY-MM-DD).
 * Private routes (/admin, /api) and per-person flows are never listed.
 */
export type PublicRoute = { path: string; title: string; updated: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" };
export const publicRoutes: PublicRoute[] = [
  { path: "/", title: "Inicio", updated: "2026-11-24", priority: 1, changeFrequency: "weekly" },
  { path: "/neuroia", title: "NeuroIA", updated: "2026-11-24", priority: 0.9, changeFrequency: "monthly" },
  { path: "/educacion", title: "Psico Care Educación", updated: "2026-09-14", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tecnologia", title: "Tecnología", updated: "2026-11-24", priority: 0.7, changeFrequency: "monthly" },
  { path: "/investigacion", title: "Investigación", updated: "2026-11-24", priority: 0.7, changeFrequency: "monthly" },
  { path: "/seguridad", title: "Seguridad y privacidad", updated: "2026-11-24", priority: 0.7, changeFrequency: "monthly" },
  { path: "/nosotros", title: "Nosotros", updated: "2026-11-24", priority: 0.6, changeFrequency: "monthly" },
  { path: "/prensa", title: "Prensa", updated: "2026-11-24", priority: 0.5, changeFrequency: "monthly" },
  { path: "/encuestas", title: "Encuesta", updated: "2026-09-14", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacidad", title: "Datos y consentimiento", updated: "2026-11-07", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terminos", title: "Términos de uso", updated: "2026-10-09", priority: 0.2, changeFrequency: "yearly" },
  { path: "/aviso-legal", title: "Aviso legal", updated: "2026-10-09", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", title: "Política de cookies", updated: "2026-11-07", priority: 0.2, changeFrequency: "yearly" },
];

export const OG_IMAGE_ALT = "Psico Care. Tu bienestar importa. Un espacio para hablar, practicar y avanzar a tu ritmo.";
/** Unique title, description, canonical, Open Graph and X card for one page. */
export function pageMetadata({ title, description, path, absoluteTitle = false, type = "website" }: {
  title: string; description: string; path: string; absoluteTitle?: boolean; type?: "website" | "article";
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  // A page-level openGraph object replaces the inherited one, so the shared image (app/opengraph-image.tsx)
  // is referenced explicitly; otherwise subpages would be shared without a preview image.
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: OG_IMAGE_ALT };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path, siteName: site.name, locale: "es_NI", type, images: [image] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}

// ---------- Structured data (Schema.org JSON-LD). Only verifiable facts: no ratings, reviews,
// user counts, certifications, partnerships or clinical validation are declared anywhere. ----------
type Json = Record<string, unknown>;
const id = (fragment: string) => `${siteOrigin()}/#${fragment}`;

export function organizationSchema(): Json {
  return {
    "@type": "Organization", "@id": id("organization"),
    name: site.name, alternateName: [...BRAND_ALTERNATE_NAMES], url: siteOrigin() + "/",
    logo: { "@type": "ImageObject", url: absoluteUrl("/brand/psicocare-logo-512.png"), width: 512, height: 512 },
    description: "Equipo nicaragüense que desarrolla Psico Care, una aplicación de acompañamiento emocional para jóvenes con el asistente NeuroIA. No diagnostica ni sustituye la atención profesional.",
    email: site.email, telephone: site.phone,
    address: { "@type": "PostalAddress", addressCountry: "NI" },
    knowsLanguage: "es",
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: site.email, telephone: site.phone, availableLanguage: "es" },
  };
}
export function websiteSchema(): Json {
  return { "@type": "WebSite", "@id": id("website"), name: site.name, alternateName: [...BRAND_ALTERNATE_NAMES], url: siteOrigin() + "/", inLanguage: "es", publisher: { "@id": id("organization") } };
}
export function mobileApplicationSchema(): Json {
  return {
    "@type": "MobileApplication", "@id": id("android-app"),
    name: site.name, alternateName: "PsicoCare",
    description: "Aplicación Android de acompañamiento emocional para jóvenes: conversación con NeuroIA, diario emocional, respiración, práctica de conversaciones y exposición gradual. No diagnostica ni sustituye la atención profesional.",
    operatingSystem: androidDownload.requirements, applicationCategory: "HealthApplication",
    softwareVersion: androidDownload.version, downloadUrl: absoluteUrl(androidDownload.url), inLanguage: "es",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": id("organization") },
  };
}
export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Inicio", path: "/" }, ...items].map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}
export function webPageSchema({ path, name, description, type = "WebPage", updated }: { path: string; name: string; description: string; type?: "WebPage" | "AboutPage" | "ContactPage" | "FAQPage" | "CollectionPage"; updated?: string }): Json {
  return {
    "@type": type, "@id": absoluteUrl(path) + "#webpage", url: absoluteUrl(path), name, description, inLanguage: "es",
    isPartOf: { "@id": id("website") }, publisher: { "@id": id("organization") },
    ...(updated ? { dateModified: updated } : {}),
  };
}
export function faqSchema(items: { question: string; answer: string }[]): Json {
  return { "@type": "FAQPage", mainEntity: items.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };
}
/** Wraps one or more nodes in a single @graph document. */
export function jsonLd(...nodes: Json[]): string {
  // Escaping "<" keeps any string from closing the script element.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
}
export const routeUpdated = (path: string) => publicRoutes.find(r => r.path === path)?.updated;
