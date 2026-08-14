"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const ORBITS = [
  { r: 168, duration: 74, nodes: [12, 128, 246], opacity: 0.16 },
  { r: 126, duration: 54, nodes: [58, 190, 300], opacity: 0.2 },
  { r: 86, duration: 38, nodes: [96, 268], opacity: 0.26 },
];

const BARS = [
  { x: 186, peak: 1.9, delay: 0 },
  { x: 194, peak: 2.9, delay: 0.18 },
  { x: 202, peak: 3.6, delay: 0.36 },
  { x: 210, peak: 2.4, delay: 0.54 },
  { x: 218, peak: 1.5, delay: 0.72 },
];

/**
 * Núcleo de IA: anillos concéntricos, nodos en órbita y una onda de voz
 * en el centro. Representa un sistema que escucha, no un cerebro literal.
 */
export function AiCore({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("relative aspect-square w-full", className)}>
      {/* Resplandor del núcleo */}
      <div
        aria-hidden="true"
        className="absolute inset-[26%] rounded-full bg-brand-500/22 blur-[70px]"
      />

      <svg
        viewBox="0 0 400 400"
        fill="none"
        role="img"
        aria-label="Representación abstracta del núcleo de inteligencia artificial de PsicoCare"
        className="relative h-full w-full"
      >
        <defs>
          <radialGradient id="core-fill" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#bfe9ff" />
            <stop offset="45%" stopColor="var(--color-spark-400)" />
            <stop offset="100%" stopColor="var(--color-brand-600)" />
          </radialGradient>
          <linearGradient id="ring-stroke" x1="0" y1="400" x2="400" y2="0">
            <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.05" />
            <stop offset="50%" stopColor="var(--color-spark-400)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0.05" />
          </linearGradient>
          <filter id="soft-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Anillo exterior punteado */}
        <motion.circle
          cx="200"
          cy="200"
          r="192"
          stroke="var(--color-spark-400)"
          strokeOpacity="0.14"
          strokeWidth="1"
          strokeDasharray="2 9"
          style={{ transformBox: "view-box", transformOrigin: "200px 200px" }}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 120, ease: "linear", repeat: Infinity }}
        />

        {ORBITS.map((orbit, i) => (
          <g key={orbit.r}>
            <circle
              cx="200"
              cy="200"
              r={orbit.r}
              stroke="url(#ring-stroke)"
              strokeWidth="1"
              opacity={0.5}
            />
            <motion.g
              style={{ transformBox: "view-box", transformOrigin: "200px 200px" }}
              animate={reduced ? undefined : { rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: orbit.duration, ease: "linear", repeat: Infinity }}
            >
              {orbit.nodes.map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 200 + orbit.r * Math.cos(rad);
                const cy = 200 + orbit.r * Math.sin(rad);
                return (
                  <g key={angle}>
                    <circle cx={cx} cy={cy} r="9" fill="var(--color-spark-400)" opacity="0.1" />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="3"
                      fill="var(--color-spark-300)"
                      filter="url(#soft-glow)"
                    />
                  </g>
                );
              })}
            </motion.g>
          </g>
        ))}

        {/* Líneas de conexión hacia el núcleo */}
        <g stroke="var(--color-spark-400)" strokeOpacity="0.13" strokeWidth="1">
          <path d="M200 200 L 79 118" />
          <path d="M200 200 L 330 142" />
          <path d="M200 200 L 128 316" />
          <path d="M200 200 L 296 310" />
        </g>

        {/* Ondas expansivas */}
        {!reduced &&
          [0, 1.5, 3].map((delay) => (
            <circle
              key={delay}
              cx="200"
              cy="200"
              r="52"
              stroke="var(--color-spark-400)"
              strokeWidth="1"
              className="animate-pulse-ring"
              style={{
                transformBox: "view-box",
                transformOrigin: "200px 200px",
                animationDelay: `${delay}s`,
              }}
            />
          ))}

        {/* Núcleo */}
        <circle cx="200" cy="200" r="46" fill="url(#core-fill)" opacity="0.16" />
        <circle
          cx="200"
          cy="200"
          r="40"
          fill="var(--color-ink-950)"
          stroke="var(--color-spark-400)"
          strokeOpacity="0.4"
          strokeWidth="1"
        />

        {/* Onda de voz dentro del núcleo */}
        <g>
          {BARS.map((bar) => (
            <motion.rect
              key={bar.x}
              x={bar.x}
              y={194}
              width="3"
              height="12"
              rx="1.5"
              fill="var(--color-spark-300)"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ scaleY: 1 }}
              animate={reduced ? undefined : { scaleY: [0.5, bar.peak, 0.8, bar.peak * 0.7, 0.5] }}
              transition={{
                duration: 2.6,
                ease: "easeInOut",
                repeat: Infinity,
                delay: bar.delay,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
