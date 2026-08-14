"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Turn = { from: "user" | "ai"; text: string };

/** Intercambio ilustrativo. No es una transcripción real. */
const TURNS: Turn[] = [
  { from: "user", text: "Mañana tengo una entrevista y no sé cómo empezar." },
  {
    from: "ai",
    text: "Podemos practicarla ahora. ¿Prefieres empezar con preguntas suaves o con presión desde el inicio?",
  },
  { from: "user", text: "Suaves, por ahora." },
];

const BASE_DELAY = 0.55;

export function ConversationPanel({ className }: { className?: string }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.35 }}
      className={cn(
        "w-full rounded-2xl bg-ink-950/72 p-4 ring-1 ring-white/10 backdrop-blur-xl",
        "shadow-[0_30px_80px_-40px_rgba(0,0,0,0.95)]",
        className,
      )}
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-spark-400" />
          <span className="font-mono text-[10px] tracking-[0.16em] text-on-dark-soft uppercase">
            Modo simulación
          </span>
        </div>
        <span className="rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-on-dark-soft">
          Nivel 1
        </span>
      </div>

      <div className="space-y-2.5 py-4">
        {TURNS.map((turn, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: BASE_DELAY + i * 0.55 }}
            className={cn("flex", turn.from === "user" ? "justify-end" : "justify-start")}
          >
            <p
              className={cn(
                "max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug",
                turn.from === "user"
                  ? "rounded-br-md bg-white/[0.07] text-on-dark"
                  : "rounded-bl-md bg-linear-to-br from-brand-600/22 to-spark-500/12 text-on-dark ring-1 ring-spark-400/18",
              )}
            >
              {turn.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Estado del sistema */}
      <motion.figcaption
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: BASE_DELAY + TURNS.length * 0.55 }}
        className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] pt-3"
      >
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-spark-300 uppercase">
          <ShieldIcon />
          Safety layer activa
        </span>
        <span className="font-mono text-[10px] text-on-dark-soft/75">
          Ejemplo ilustrativo
        </span>
      </motion.figcaption>
    </motion.figure>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-hidden="true"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 1.5 2.5 3.3v3.4c0 2.6 1.8 4.9 4.5 5.8 2.7-.9 4.5-3.2 4.5-5.8V3.3L7 1.5Z" />
      <path d="m5.2 7 1.3 1.3 2.4-2.6" />
    </svg>
  );
}
