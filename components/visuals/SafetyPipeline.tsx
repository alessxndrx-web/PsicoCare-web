"use client";

import { motion } from "framer-motion";
import { safety } from "@/lib/content";
import { EASE_OUT, VIEWPORT_SOFT } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Recorrido de una conversación a través de las capas de seguridad.
 * Horizontal en escritorio, vertical en móvil.
 */
export function SafetyPipeline() {
  const steps = safety.pipeline;

  return (
    <div className="relative">
      {/* Rail horizontal (escritorio) */}
      <div
        aria-hidden="true"
        className="absolute top-[19px] right-[10%] left-[10%] hidden md:block"
      >
        <svg viewBox="0 0 100 2" preserveAspectRatio="none" className="h-0.5 w-full">
          <line
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            stroke="var(--color-spark-400)"
            strokeWidth="2"
            strokeOpacity="0.55"
            vectorEffect="non-scaling-stroke"
            className="animate-dash"
          />
        </svg>
      </div>

      {/* Rail vertical (móvil) */}
      <div
        aria-hidden="true"
        className="absolute top-4 bottom-8 left-[19px] w-px bg-linear-to-b from-spark-400/35 to-brand-500/20 md:hidden"
      />

      <ol className="relative grid gap-8 md:grid-cols-5 md:gap-4">
        {steps.map((step, i) => {
          const isTerminal = "terminal" in step && step.terminal;
          return (
            <motion.li
              key={step.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_SOFT}
              transition={{ duration: 0.55, ease: EASE_OUT, delay: i * 0.12 }}
              className="flex items-start gap-4 md:block"
            >
              <span
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-[11px] md:mx-auto",
                  isTerminal
                    ? "bg-linear-to-br from-brand-600 to-spark-500 text-white shadow-[0_0_28px_-6px_rgba(34,211,238,0.7)]"
                    : "bg-ink-950 text-spark-300 ring-1 ring-spark-400/35",
                )}
              >
                {isTerminal ? <HandIcon /> : String(i + 1).padStart(2, "0")}
              </span>

              <div className="md:mt-4 md:text-center">
                <h3
                  className={cn(
                    "text-[15px] leading-tight font-medium",
                    isTerminal ? "text-spark-300" : "text-on-dark",
                  )}
                >
                  {step.label}
                </h3>
                <p className="mt-1.5 text-[13px] leading-snug text-on-dark-soft md:mx-auto md:max-w-[15rem]">
                  {step.detail}
                </p>
                {isTerminal && (
                  <span className="mt-2.5 inline-block rounded-full bg-spark-400/10 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.14em] text-spark-300 uppercase ring-1 ring-spark-400/25">
                    Solo si es necesario
                  </span>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

function HandIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.6 8V4.2a1.1 1.1 0 0 1 2.2 0V8" />
      <path d="M7.8 7.4V3.4a1.1 1.1 0 0 1 2.2 0V8" />
      <path d="M10 8V5.4a1.1 1.1 0 0 1 2.2 0v4.2a4.2 4.2 0 0 1-4.2 4.2h-.6a3.6 3.6 0 0 1-3-1.7L2.9 9.6a1.1 1.1 0 0 1 1.7-1.4L5.6 9.4" />
    </svg>
  );
}
