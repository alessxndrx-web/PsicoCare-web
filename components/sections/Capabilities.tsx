"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { capabilities, type Capability } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function Capabilities() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = capabilities[activeIndex];

  const focusTab = (index: number) => {
    const next = (index + capabilities.length) % capabilities.length;
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusTab(activeIndex + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusTab(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(capabilities.length - 1);
        break;
    }
  };

  return (
    <Section id="capacidades" tone="mist" labelledBy="capacidades-title">
      <Container>
        <SectionHeading
          id="capacidades-title"
          eyebrow="03 — Qué puede hacer PsicoCare"
          title="Un ecosistema, no un chatbot"
          lede="Siete capacidades que se apoyan entre sí: conversar, practicar, subir la dificultad de a poco, reflexionar y —cuando haga falta— dar el paso hacia una persona."
          tone="light"
        />

        <div className="mt-14 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(260px,340px)_1fr] lg:gap-12">
          {/* Lista de capacidades */}
          <div
            role="tablist"
            aria-label="Capacidades de PsicoCare"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="scrollbar-none -mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {capabilities.map((cap, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={cap.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${cap.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${cap.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "group relative flex shrink-0 snap-start items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors duration-300 lg:w-full lg:shrink",
                    isActive
                      ? "bg-white text-on-light shadow-[0_12px_36px_-22px_rgba(8,16,31,0.5)]"
                      : "text-on-light-soft hover:bg-white/60 hover:text-on-light",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="cap-active-bar"
                      aria-hidden="true"
                      className="absolute top-3 bottom-3 left-0 hidden w-[2.5px] rounded-full bg-linear-to-b from-brand-600 to-spark-500 lg:block"
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                    />
                  )}
                  <span
                    className={cn(
                      "font-mono text-[10.5px] transition-colors",
                      isActive ? "text-brand-700" : "text-on-light-soft",
                    )}
                  >
                    {cap.index}
                  </span>
                  <span className="text-[14.5px] font-medium whitespace-nowrap lg:whitespace-normal">
                    {cap.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel de detalle */}
          <div className="relative min-h-[26rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                role="tabpanel"
                id={`panel-${active.id}`}
                aria-labelledby={`tab-${active.id}`}
                tabIndex={0}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="h-full rounded-2xl bg-white p-7 shadow-[0_30px_70px_-45px_rgba(8,16,31,0.55)] ring-1 ring-on-light/[0.06] md:p-10"
              >
                <span className="font-mono text-[10.5px] tracking-[0.18em] text-brand-700 uppercase">
                  {active.index} — {active.name}
                </span>
                <h3 className="mt-4 text-[clamp(1.4rem,2.4vw,1.85rem)] leading-tight font-semibold text-on-light">
                  {active.headline}
                </h3>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-on-light-soft">
                  {active.body}
                </p>

                <div className="mt-8">
                  <p className="font-mono text-[10.5px] tracking-[0.18em] text-on-light-soft uppercase">
                    {active.detailLabel}
                  </p>
                  <div className="mt-4">
                    <CapabilityDetail capability={active} />
                  </div>
                </div>

                {active.note && (
                  <p className="mt-8 flex gap-3 border-t border-on-light/[0.08] pt-5 text-[13px] leading-relaxed text-on-light-soft">
                    <InfoIcon />
                    <span>{active.note}</span>
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Renderizadores específicos por capacidad
 * ------------------------------------------------------------------ */
function CapabilityDetail({ capability }: { capability: Capability }) {
  switch (capability.id) {
    case "exposicion":
      return <LevelLadder levels={capability.details} />;
    case "deteccion":
      return <AttentionScale signals={capability.details} />;
    case "conexion":
      return <ConsentChain steps={capability.details} />;
    default:
      return <ChipList items={capability.details} />;
  }
}

function ChipList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE_OUT }}
          className="rounded-lg bg-mist-100 px-3.5 py-2 text-[13.5px] text-on-light ring-1 ring-on-light/[0.05]"
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

/** Escalera de exposición progresiva: la barra crece con el nivel */
function LevelLadder({ levels }: { levels: string[] }) {
  return (
    <ul className="space-y-2.5">
      {levels.map((level, i) => (
        <li key={level} className="flex items-center gap-4">
          <span className="w-[9.5rem] shrink-0 text-[13.5px] text-on-light sm:w-auto sm:min-w-[13rem]">
            {level}
          </span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist-200">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${((i + 1) / levels.length) * 100}%` }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.08 * i }}
              className="block h-full rounded-full bg-linear-to-r from-brand-600 to-spark-500"
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Señales observadas + escala de atención discreta (sin porcentajes) */
function AttentionScale({ signals }: { signals: string[] }) {
  const scale = ["Base", "Atención", "Elevado", "Escalamiento"];
  return (
    <div className="space-y-6">
      <ChipList items={signals} />
      <div className="rounded-xl bg-mist-100 p-5 ring-1 ring-on-light/[0.05]">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10.5px] tracking-[0.16em] text-on-light-soft uppercase">
            Nivel de atención sugerido
          </p>
          <span className="font-mono text-[10px] text-on-light-soft">
            Ejemplo ilustrativo
          </span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {scale.map((step, i) => (
            <div key={step}>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.07 * i }}
                style={{ transformOrigin: "left" }}
                className={cn(
                  "block h-1.5 rounded-full",
                  i === 0 ? "bg-linear-to-r from-brand-600 to-spark-500" : "bg-mist-300",
                )}
              />
              <span
                className={cn(
                  "mt-2 block text-[11px]",
                  i === 0 ? "font-medium text-brand-700" : "text-on-light-soft",
                )}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Cadena de escalamiento con el consentimiento como compuerta explícita */
function ConsentChain({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => {
        const isGate = i === 2;
        const isLast = i === steps.length - 1;
        return (
          <motion.li
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.09 * i }}
            className="relative flex items-center gap-4 pb-6 last:pb-0"
          >
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute top-7 left-[13px] h-[calc(100%-1.75rem)] w-px bg-on-light/12"
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium",
                isGate
                  ? "bg-linear-to-br from-brand-600 to-spark-500 text-white"
                  : "bg-mist-100 text-on-light-soft ring-1 ring-on-light/10",
              )}
            >
              {isGate ? <LockIcon /> : i + 1}
            </span>
            <span
              className={cn(
                "text-[14px]",
                isGate ? "font-medium text-brand-700" : "text-on-light",
              )}
            >
              {step}
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <circle cx="8" cy="8" r="6.4" />
      <path d="M8 7.2v3.6M8 5.2v.2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6.2" width="8" height="6" rx="1.4" />
      <path d="M4.9 6.2V4.6a2.1 2.1 0 0 1 4.2 0v1.6" />
    </svg>
  );
}
