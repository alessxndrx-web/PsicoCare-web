"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { technology } from "@/lib/content";
import { EASE_OUT, VIEWPORT_SOFT } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Capas que forman el núcleo de seguridad — se destacan en cian */
const SAFETY_LAYERS = new Set(["safety", "risk"]);

export function ArchitectureDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Espina dorsal con pulso descendente */}
      <div
        aria-hidden="true"
        className="absolute top-6 bottom-6 left-[29.5px] w-px bg-linear-to-b from-brand-500/40 via-spark-400/30 to-brand-500/10 md:left-[31.5px]"
      >
        <span className="animate-travel absolute -left-[3.5px] h-2 w-2 rounded-full bg-spark-300 shadow-[0_0_12px_2px_rgba(34,211,238,0.7)]" />
      </div>

      <ol className="relative space-y-2">
        {technology.layers.map((layer, i) => {
          const isSafety = SAFETY_LAYERS.has(layer.id);
          const isDimmed = hovered !== null && hovered !== layer.id;

          return (
            <motion.li
              key={layer.id}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT_SOFT}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.07 }}
            >
              <div
                onMouseEnter={() => setHovered(layer.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(layer.id)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                className={cn(
                  "group flex items-center gap-4 rounded-xl p-3 transition-all duration-300 md:gap-5",
                  isDimmed ? "opacity-45" : "opacity-100",
                  "hover:bg-white/[0.03] focus-visible:bg-white/[0.03]",
                )}
              >
                {/* Nodo */}
                <span
                  className={cn(
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[10px] transition-all duration-300 md:h-10 md:w-10",
                    isSafety
                      ? "bg-ink-950 text-spark-300 ring-1 ring-spark-400/45 group-hover:ring-spark-400"
                      : "bg-ink-950 text-on-dark-soft ring-1 ring-white/12 group-hover:ring-white/30",
                  )}
                >
                  {isSafety && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-spark-400/10 blur-[6px]"
                    />
                  )}
                  <span className="relative">{String(i + 1).padStart(2, "0")}</span>
                </span>

                <div className="min-w-0">
                  <h3
                    className={cn(
                      "text-[14.5px] leading-tight font-medium md:text-[15px]",
                      isSafety ? "text-spark-300" : "text-on-dark",
                    )}
                  >
                    {layer.label}
                  </h3>
                  <p className="mt-1 text-[13px] leading-snug text-on-dark-soft">
                    {layer.detail}
                  </p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
