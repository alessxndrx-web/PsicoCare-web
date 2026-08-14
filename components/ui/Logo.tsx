import { cn } from "@/lib/cn";

/**
 * Marca de PsicoCare: un núcleo con dos arcos abiertos.
 * Lee a la vez como onda sonora (escuchar) y como capa de contención (límite).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-7 w-7", className)}
    >
      <defs>
        <linearGradient id="pc-mark" x1="4" y1="28" x2="28" y2="4">
          <stop offset="0%" stopColor="var(--color-brand-500)" />
          <stop offset="100%" stopColor="var(--color-spark-400)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14.25" stroke="url(#pc-mark)" strokeWidth="1.5" opacity="0.35" />
      <path
        d="M10.4 21.6a8 8 0 0 1 0-11.2"
        stroke="url(#pc-mark)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21.6 10.4a8 8 0 0 1 0 11.2"
        stroke="url(#pc-mark)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="16" cy="16" r="3.4" fill="url(#pc-mark)" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "text-[15px] font-semibold tracking-[-0.02em]",
          tone === "dark" ? "text-on-dark" : "text-on-light",
        )}
      >
        Psico<span className="text-spark-300">Care</span>
      </span>
    </span>
  );
}
