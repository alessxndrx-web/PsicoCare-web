"use client";

import { motion } from "framer-motion";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { mission, vision } from "@/lib/content";
import { EASE_OUT, VIEWPORT_SOFT } from "@/lib/motion";

export function Mission() {
  return (
    <Section id="mision" tone="white" labelledBy="mision-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-20">
          <Reveal>
            <Eyebrow tone="light">{mission.eyebrow}</Eyebrow>
            <h2
              id="mision-title"
              className="mt-5 text-[clamp(1.7rem,3.2vw,2.4rem)] font-semibold text-on-light lg:sticky lg:top-28"
            >
              {mission.title}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-[clamp(1.25rem,2.6vw,1.95rem)] leading-[1.32] font-medium text-balance text-on-light">
              {mission.body}
            </p>
            <p className="mt-8 max-w-lg border-l-2 border-brand-600/30 pl-5 text-[15px] leading-relaxed text-on-light-soft">
              {mission.support}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export function Vision() {
  return (
    <Section id="vision" tone="light" labelledBy="vision-title">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow tone="light" className="justify-center">
              {vision.eyebrow}
            </Eyebrow>
            <h2
              id="vision-title"
              className="mt-5 text-[clamp(1.7rem,3.2vw,2.4rem)] font-semibold text-on-light"
            >
              {vision.title}
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-[clamp(1.15rem,2.4vw,1.75rem)] leading-[1.35] font-medium text-balance text-on-light">
              {vision.body}
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <Bridge />
        </Reveal>
      </Container>
    </Section>
  );
}

/** El puente: de "sentirse solo" a "pedir ayuda" */
function Bridge() {
  return (
    <figure className="mx-auto max-w-3xl">
      <svg
        viewBox="0 0 720 150"
        fill="none"
        role="img"
        aria-label={`Un puente entre ${vision.bridgeFrom} y ${vision.bridgeTo}`}
        className="w-full"
      >
        <defs>
          <linearGradient id="bridge-arc" x1="60" y1="0" x2="660" y2="0">
            <stop offset="0%" stopColor="var(--color-on-light)" stopOpacity="0.22" />
            <stop offset="50%" stopColor="var(--color-brand-600)" />
            <stop offset="100%" stopColor="var(--color-spark-500)" />
          </linearGradient>
        </defs>

        {/* Pilares */}
        <line x1="60" y1="108" x2="60" y2="128" stroke="var(--color-on-light)" strokeOpacity="0.18" strokeWidth="1.5" />
        <line x1="660" y1="108" x2="660" y2="128" stroke="var(--color-on-light)" strokeOpacity="0.18" strokeWidth="1.5" />

        {/* Arco */}
        <motion.path
          d="M60 108 C 210 8, 510 8, 660 108"
          stroke="url(#bridge-arc)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={VIEWPORT_SOFT}
          transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.2 }}
        />

        {/* Extremos */}
        <circle cx="60" cy="108" r="5" fill="var(--color-on-light)" fillOpacity="0.3" />
        <motion.circle
          cx="660"
          cy="108"
          r="6"
          fill="var(--color-brand-600)"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={VIEWPORT_SOFT}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 1.5 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      </svg>

      <div className="mt-1 flex items-start justify-between gap-6">
        <span className="text-left text-[13px] text-on-light-soft sm:text-sm">
          {vision.bridgeFrom}
        </span>
        <span className="text-right text-[13px] font-medium text-brand-700 sm:text-sm">
          {vision.bridgeTo}
        </span>
      </div>
      <figcaption className="mt-7 text-center text-[15px] leading-snug text-balance text-on-light">
        {vision.bridgeCaption}
      </figcaption>
    </figure>
  );
}
