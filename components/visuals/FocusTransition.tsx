"use client";

import { motion, useReducedMotion } from "framer-motion";
import { seeded, EASE_OUT, VIEWPORT_SOFT } from "@/lib/motion";
import { problem } from "@/lib/content";

const W = 920;
const H = 240;
const TARGET = { x: 812, y: H / 2 };
const NODE_COUNT = 22;

/**
 * Transición visual: un campo disperso de tareas ("IA para todo") que
 * converge en un solo punto ("IA diseñada para acompañar mejor").
 */
export function FocusTransition() {
  const reduced = useReducedMotion();

  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
    x: 40 + seeded(i, 11) * 250,
    y: 26 + seeded(i, 12) * (H - 52),
    r: 1.4 + seeded(i, 13) * 2.2,
  }));

  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        role="img"
        aria-label={`Transición de ${problem.transition.from} a ${problem.transition.to}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="ft-line" x1="0" y1="0" x2={W} y2="0">
            <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.05" />
            <stop offset="55%" stopColor="var(--color-spark-400)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-spark-300)" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="ft-target" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="var(--color-spark-300)" />
            <stop offset="100%" stopColor="var(--color-brand-600)" />
          </radialGradient>
        </defs>

        {/* Trayectorias convergentes */}
        <g>
          {nodes.map((node, i) => {
            const c1x = node.x + 190;
            const c1y = node.y;
            const c2x = TARGET.x - 230;
            const c2y = TARGET.y + (node.y - TARGET.y) * 0.14;
            const d = `M ${node.x} ${node.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${TARGET.x} ${TARGET.y}`;
            return (
              <motion.path
                key={i}
                d={d}
                stroke="url(#ft-line)"
                strokeWidth="1"
                initial={reduced ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.55 }}
                viewport={VIEWPORT_SOFT}
                transition={{
                  duration: 1.5,
                  ease: EASE_OUT,
                  delay: 0.2 + seeded(i, 14) * 0.6,
                }}
              />
            );
          })}
        </g>

        {/* Campo disperso */}
        <g>
          {nodes.map((node, i) => (
            <motion.circle
              key={i}
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="var(--color-brand-400)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={VIEWPORT_SOFT}
              transition={{ duration: 0.6, delay: seeded(i, 15) * 0.5 }}
            />
          ))}
        </g>

        {/* Punto de convergencia */}
        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT_SOFT}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 1.1 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx={TARGET.x} cy={TARGET.y} r="42" fill="var(--color-spark-400)" opacity="0.08" />
          <circle cx={TARGET.x} cy={TARGET.y} r="24" fill="var(--color-spark-400)" opacity="0.14" />
          <circle cx={TARGET.x} cy={TARGET.y} r="9" fill="url(#ft-target)" />
          {!reduced && (
            <circle
              cx={TARGET.x}
              cy={TARGET.y}
              r="24"
              stroke="var(--color-spark-400)"
              strokeWidth="1"
              className="animate-pulse-ring"
              style={{
                transformBox: "view-box",
                transformOrigin: `${TARGET.x}px ${TARGET.y}px`,
              }}
            />
          )}
        </motion.g>
      </svg>

      {/* Etiquetas */}
      <div className="mt-2 flex items-center justify-between gap-6 md:mt-0">
        <span className="font-mono text-[10.5px] tracking-[0.18em] text-on-dark-soft/80 uppercase md:text-[11px]">
          {problem.transition.from}
        </span>
        <span className="text-right font-mono text-[10.5px] tracking-[0.18em] text-spark-300 uppercase md:text-[11px]">
          {problem.transition.to}
        </span>
      </div>
    </div>
  );
}
