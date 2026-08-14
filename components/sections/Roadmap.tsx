"use client";

import { motion } from "framer-motion";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { roadmap } from "@/lib/content";
import { EASE_OUT, VIEWPORT_SOFT } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function Roadmap() {
  return (
    <Section id="roadmap" tone="deep" labelledBy="roadmap-title">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
      />

      <Container>
        <SectionHeading
          id="roadmap-title"
          eyebrow={roadmap.eyebrow}
          title={roadmap.title}
          lede={roadmap.lede}
          maxWidth="max-w-2xl"
        />

        <div className="relative mt-16 lg:mt-20">
          {/* Rail: vertical en móvil, horizontal en escritorio */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7.5px] w-px bg-white/[0.09] lg:top-[7.5px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
          >
            <motion.span
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={VIEWPORT_SOFT}
              transition={{ duration: 1.4, ease: EASE_OUT }}
              style={{ transformOrigin: "top" }}
              className="block h-full w-px bg-linear-to-b from-spark-400/70 to-transparent lg:hidden"
            />
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT_SOFT}
              transition={{ duration: 1.4, ease: EASE_OUT }}
              style={{ transformOrigin: "left" }}
              className="hidden h-px w-full bg-linear-to-r from-spark-400/70 via-brand-500/40 to-transparent lg:block"
            />
          </div>

          <ol className="grid gap-10 lg:grid-cols-6 lg:gap-5">
            {roadmap.phases.map((phase, i) => {
              const isCurrent = phase.status === "En curso";
              return (
                <motion.li
                  key={phase.phase}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_SOFT}
                  transition={{ duration: 0.55, ease: EASE_OUT, delay: i * 0.09 }}
                  className="relative flex gap-5 lg:block"
                >
                  {/* Punto del rail */}
                  <span className="relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center lg:mt-0">
                    {isCurrent && (
                      <span
                        aria-hidden="true"
                        className="absolute h-4 w-4 animate-ping rounded-full bg-spark-400/35"
                      />
                    )}
                    <span
                      className={cn(
                        "relative h-[9px] w-[9px] rounded-full ring-4 ring-ink-950",
                        isCurrent
                          ? "bg-spark-400 shadow-[0_0_14px_2px_rgba(34,211,238,0.6)]"
                          : "bg-ink-600",
                      )}
                    />
                  </span>

                  <div className="lg:mt-6">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={cn(
                          "font-mono text-[10.5px] tracking-[0.16em] uppercase",
                          isCurrent ? "text-spark-300" : "text-on-dark-soft/75",
                        )}
                      >
                        {phase.phase}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9.5px] font-medium tracking-wide uppercase",
                          isCurrent
                            ? "bg-spark-400/12 text-spark-300 ring-1 ring-spark-400/25"
                            : "bg-white/[0.04] text-on-dark-soft/75 ring-1 ring-white/[0.07]",
                        )}
                      >
                        {phase.status}
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-[17px] font-medium text-on-dark">
                      {phase.name}
                    </h3>
                    <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-on-dark-soft lg:max-w-none">
                      {phase.body}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
