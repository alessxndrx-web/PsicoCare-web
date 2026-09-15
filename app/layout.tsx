import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteAnalytics } from "@/components/layout/SiteAnalytics";
import { site } from "@/lib/content";
import "@fontsource-variable/montserrat";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-400-italic.css";
import "./globals.css";
const base = process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined;
export const metadata: Metadata = {
  metadataBase: base,
  title: { default: "Psico Care — Acompañamiento emocional para jóvenes", template: "%s | Psico Care" },
  description: site.description,
  openGraph: { title: "Psico Care — Tu bienestar importa.", description: site.description, type: "website", locale: "es_NI", siteName: site.name },
  twitter: { card: "summary_large_image", title: "Psico Care — Tu bienestar importa.", description: site.description },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#000022", colorScheme: "light dark" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><a href="#contenido" className="skip-link">Saltar al contenido</a><Navbar/><main id="contenido">{children}</main><Footer/><SiteAnalytics/></body></html>;
}
