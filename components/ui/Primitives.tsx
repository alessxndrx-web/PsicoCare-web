import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ *
 * Etiqueta superior de sección — mono, pequeña, con guía luminosa
 * ------------------------------------------------------------------ */
export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase",
        tone === "dark" ? "text-spark-300" : "text-brand-700",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-px w-8",
          tone === "dark"
            ? "bg-linear-to-r from-spark-400/70 to-transparent"
            : "bg-linear-to-r from-brand-600/60 to-transparent",
        )}
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Contenedor de ancho máximo consistente
 * ------------------------------------------------------------------ */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1180px] px-6 md:px-10", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Envoltura de sección con superficie clara u oscura
 * ------------------------------------------------------------------ */
/**
 * Cada superficie es una variante explícita: pasar un `bg-*` por
 * className dependería del orden del CSS generado, no del orden de clases.
 */
const SURFACES = {
  deep: "bg-ink-950 text-on-dark",
  dark: "bg-ink-900 text-on-dark",
  white: "bg-white text-on-light",
  light: "bg-mist-50 text-on-light",
  mist: "bg-mist-100 text-on-light",
} as const;

export function Section({
  id,
  tone = "dark",
  children,
  className,
  labelledBy,
}: {
  id?: string;
  tone?: keyof typeof SURFACES;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  const surface = SURFACES[tone];

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative isolate scroll-mt-24 overflow-hidden py-24 md:py-32",
        surface,
        className,
      )}
    >
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Botones
 * ------------------------------------------------------------------ */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  tone = "dark",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  tone?: "dark" | "light";
  className?: string;
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-out will-change-transform";

  const styles =
    variant === "primary"
      ? "bg-linear-to-r from-brand-600 to-spark-500 text-white shadow-[0_14px_40px_-14px_rgba(37,99,235,0.9)] hover:shadow-[0_18px_50px_-12px_rgba(34,211,238,0.65)] hover:-translate-y-0.5"
      : tone === "dark"
        ? "text-on-dark ring-1 ring-white/15 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.07] hover:ring-white/25 hover:-translate-y-0.5"
        : "text-on-light ring-1 ring-on-light/15 bg-white hover:ring-on-light/30 hover:-translate-y-0.5";

  return (
    <a href={href} className={cn(base, styles, className)}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
      </svg>
    </a>
  );
}

/* ------------------------------------------------------------------ *
 * Chip informativo
 * ------------------------------------------------------------------ */
export function Pill({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light" | "accent";
  className?: string;
}) {
  const styles =
    tone === "accent"
      ? "bg-spark-400/10 text-spark-300 ring-spark-400/25"
      : tone === "light"
        ? "bg-white text-on-light-soft ring-on-light/10"
        : "bg-white/[0.04] text-on-dark-soft ring-white/10";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset",
        styles,
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Encabezado de sección reutilizable
 * ------------------------------------------------------------------ */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lede,
  tone = "dark",
  align = "left",
  className,
  maxWidth = "max-w-3xl",
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
  maxWidth?: string;
}) {
  return (
    <div
      className={cn(maxWidth, align === "center" && "mx-auto text-center", className)}
    >
      {eyebrow && (
        <Eyebrow
          tone={tone}
          className={align === "center" ? "justify-center" : undefined}
        >
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        id={id}
        className={cn(
          "mt-5 text-[clamp(1.85rem,4.2vw,3.2rem)] leading-[1.08] font-semibold",
          tone === "dark" ? "text-on-dark" : "text-on-light",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-6 text-[clamp(1rem,1.4vw,1.125rem)] leading-relaxed",
            tone === "dark" ? "text-on-dark-soft" : "text-on-light-soft",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Resplandor ambiental de fondo
 * ------------------------------------------------------------------ */
export function Aurora({
  className,
  intensity = "medium",
}: {
  className?: string;
  intensity?: "soft" | "medium" | "strong";
}) {
  const opacity =
    intensity === "strong"
      ? "opacity-70"
      : intensity === "soft"
        ? "opacity-25"
        : "opacity-45";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10", opacity, className)}
    >
      <div className="animate-drift absolute top-[-18%] left-[8%] h-[46rem] w-[46rem] rounded-full bg-brand-600/25 blur-[140px]" />
      <div className="absolute right-[2%] bottom-[-22%] h-[38rem] w-[38rem] rounded-full bg-spark-500/18 blur-[130px]" />
    </div>
  );
}
