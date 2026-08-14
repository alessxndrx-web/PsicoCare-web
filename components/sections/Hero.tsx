"use client";

import { motion, type Variants } from "framer-motion";
import { AiCore } from "@/components/visuals/AiCore";
import { ConversationPanel } from "@/components/visuals/ConversationPanel";
import { Particles } from "@/components/visuals/Particles";
import { ButtonLink, Container } from "@/components/ui/Primitives";
import { hero } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";

/* La orquestación vive en las variantes: la prop `transition` de un
   componente reemplazaría el easing en lugar de complementarlo. */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink-950 pt-32 pb-20 md:pt-40 md:pb-28"
    >
      {/* Capas de fondo */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <div className="bg-grid mask-fade absolute inset-0" />
        <div className="absolute top-[-30%] left-1/2 h-[52rem] w-[80rem] -translate-x-1/2 rounded-full bg-brand-700/16 blur-[150px]" />
        <div className="animate-drift absolute top-[8%] right-[6%] h-[30rem] w-[30rem] rounded-full bg-spark-500/12 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-ink-900" />
      </div>
      <Particles className="-z-10" count={22} />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* Columna de texto */}
          <motion.div initial="hidden" animate="show" variants={container}>
            <motion.div
              variants={rise}
              className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.04] py-1.5 pr-4 pl-2 ring-1 ring-white/10 backdrop-blur-sm"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-spark-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-spark-400" />
              </span>
              <span className="font-mono text-[10.5px] tracking-[0.16em] text-on-dark-soft uppercase">
                {hero.badge}
              </span>
            </motion.div>

            <motion.h1
              id="hero-title"
              variants={rise}
              className="mt-7 text-[clamp(2.3rem,5.4vw,4.15rem)] leading-[1.03] font-semibold"
            >
              <span className="block text-on-dark">{hero.titleLead}</span>
              <span className="text-gradient block">{hero.titleAccent}</span>
            </motion.h1>

            <motion.p
              variants={rise}
              className="mt-7 max-w-xl text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-on-dark-soft"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              variants={rise}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
              <ButtonLink href={hero.secondaryCta.href} variant="ghost">
                {hero.secondaryCta.label}
              </ButtonLink>
            </motion.div>

            {/* Los cuatro ejes: IA + psicología + jóvenes + seguridad */}
            <motion.ul
              variants={rise}
              className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] pt-6"
            >
              {hero.pillars.map((pillar, i) => (
                <li key={pillar} className="flex items-center gap-5">
                  {i > 0 && (
                    <span aria-hidden="true" className="h-3 w-px bg-white/12" />
                  )}
                  <span className="font-mono text-[11px] tracking-[0.14em] text-on-dark-soft uppercase">
                    {pillar}
                  </span>
                </li>
              ))}
            </motion.ul>

            <motion.p
              variants={rise}
              className="mt-5 max-w-lg text-[12.5px] leading-relaxed text-on-dark-soft/80"
            >
              {hero.disclaimer}
            </motion.p>
          </motion.div>

          {/* Columna visual — el panel se apila bajo el núcleo en móvil
              y pasa a superponerse a partir de sm */}
          <div className="relative mx-auto w-full max-w-[460px] lg:max-w-[520px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.1 }}
            >
              <AiCore />
            </motion.div>

            <ConversationPanel className="mt-4 sm:absolute sm:-bottom-6 sm:left-[-4%] sm:mt-0 sm:max-w-[320px] lg:max-w-[340px]" />

            <SignalChip />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Indicador abstracto de "nivel de atención" — sin porcentajes ni claims clínicos */
function SignalChip() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 1.1 }}
      className="absolute top-2 right-0 rounded-xl bg-ink-950/72 px-3.5 py-3 ring-1 ring-white/10 backdrop-blur-xl sm:top-4 sm:right-[-2%]"
    >
      <p className="font-mono text-[9.5px] tracking-[0.16em] text-on-dark-soft uppercase">
        Nivel de atención
      </p>
      <div className="mt-2 flex items-center gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={
              i === 0
                ? "h-1 w-7 rounded-full bg-spark-400"
                : "h-1 w-7 rounded-full bg-white/12"
            }
          />
        ))}
      </div>
      <p className="mt-2 text-[11px] text-on-dark">Base · conversación</p>
    </motion.div>
  );
}
