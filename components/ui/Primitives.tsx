import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("container", className)}>{children}</div>;
}
export function ButtonLink({ href, children, variant = "primary", className }: { href: string; children: ReactNode; variant?: "primary" | "ghost" | "light"; className?: string }) {
  return <Link href={href} className={cn("button", "button-" + variant, className)}>{children}<Icon name="arrow" size={18} /></Link>;
}
export function Eyebrow({ children }: { children: ReactNode }) { return <p className="eyebrow">{children}</p>; }
export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return <div className="section-heading"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}
