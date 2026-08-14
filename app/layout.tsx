import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono-jb",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  keywords: [
    "PsicoCare",
    "inteligencia artificial",
    "salud mental",
    "psicología",
    "Hackathon Nicaragua 2026",
    "acompañamiento",
    "jóvenes",
  ],
  authors: [{ name: `Equipo ${site.name}` }],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: "website",
    locale: "es_NI",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04070f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="antialiased">
        <a
          href="#contenido"
          className="sr-only rounded-full bg-ink-800 px-5 py-3 text-sm text-on-dark focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
