import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookiePreferences } from "@/components/layout/CookiePreferences";
import { site } from "@/lib/content";
import { INTRO_BOOT_SCRIPT } from "@/lib/intro";
import { siteOrigin } from "@/lib/seo";
import "@fontsource-variable/montserrat";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-400-italic.css";
import "./globals.css";

// Search engine ownership tokens are only rendered when the owner provides them; none is invented.
const verificationOther: Record<string, string> = {};
if (process.env.BING_SITE_VERIFICATION) verificationOther["msvalidate.01"] = process.env.BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  applicationName: site.name,
  title: { default: "Psico Care — Acompañamiento emocional para jóvenes", template: "%s | Psico Care" },
  description: site.description,
  openGraph: { title: "Psico Care — Tu bienestar importa.", description: site.description, type: "website", locale: "es_NI", siteName: site.name },
  twitter: { card: "summary_large_image", title: "Psico Care — Tu bienestar importa.", description: site.description },
  robots: { index: true, follow: true },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined, other: verificationOther },
};
export const viewport: Viewport = { themeColor: "#000022", colorScheme: "light dark" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The boot script may add data-intro to <html> before hydration, hence suppressHydrationWarning.
  return <html lang="es" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }}/></head><body><a href="#contenido" className="skip-link">Saltar al contenido</a><Navbar/><main id="contenido">{children}</main><Footer/><CookiePreferences/></body></html>;
}
