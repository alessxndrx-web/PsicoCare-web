import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Acompañamiento emocional para jóvenes`, short_name: site.name, lang: "es",
    description: site.description, start_url: "/", display: "browser", background_color: "#000022", theme_color: "#000022",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
