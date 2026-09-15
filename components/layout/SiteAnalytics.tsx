"use client";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { publicEvent } from "@/lib/analytics";

/** Audience measurement for public pages only; the internal panel loads nothing. */
export function SiteAnalytics() {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return null;
  return <Analytics beforeSend={publicEvent}/>;
}
