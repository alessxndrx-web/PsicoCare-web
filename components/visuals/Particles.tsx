import { seeded } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Partículas suaves de fondo.
 * Las posiciones vienen de un PRNG determinista para que el HTML del
 * servidor y el del cliente coincidan (sin desajustes de hidratación).
 */
export function Particles({
  count = 26,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const r2 = (n: number) => Math.round(n * 100) / 100;

  const dots = Array.from({ length: count }, (_, i) => ({
    left: r2(seeded(i, 1) * 100),
    top: r2(seeded(i, 2) * 100),
    size: r2(1 + seeded(i, 3) * 2.4),
    delay: r2(seeded(i, 4) * 9),
    duration: r2(7 + seeded(i, 5) * 8),
    opacity: r2(0.16 + seeded(i, 6) * 0.42),
  }));

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {dots.map((dot, i) => (
        <span
          key={i}
          className="animate-float absolute rounded-full bg-spark-300"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
            animationDelay: `${dot.delay}s`,
            animationDuration: `${dot.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
