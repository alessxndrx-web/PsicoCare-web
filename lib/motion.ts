import type { Variants } from "framer-motion";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE_OUT } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export const VIEWPORT = { once: true, amount: 0.25 } as const;
export const VIEWPORT_SOFT = { once: true, amount: 0.15 } as const;

/**
 * PRNG determinista (mulberry32) para posicionar partículas.
 *
 * Usa solo aritmética entera y operaciones bit a bit, exactamente
 * especificadas por ECMAScript, así que servidor y cliente producen
 * los mismos valores en cualquier motor. `Math.sin` no sirve aquí:
 * su último ulp varía entre motores y bastaría para desajustar la
 * hidratación al formatear los estilos en línea.
 *
 * @param index posición del elemento
 * @param salt entero que distingue una secuencia de otra
 */
export function seeded(index: number, salt = 1): number {
  let a = (Math.imul(index + 1, 0x9e3779b1) + Math.imul(salt, 0x85ebca6b)) | 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  // Redondear acota la precisión antes de cualquier cálculo posterior.
  return Math.round(r * 1e5) / 1e5;
}
