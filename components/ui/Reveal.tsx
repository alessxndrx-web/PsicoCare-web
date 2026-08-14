"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT, fadeUp, stagger, VIEWPORT_SOFT } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: "div" | "section" | "li" | "article" | "header" | "figure";
};

/**
 * Aparición al entrar en viewport. Una sola vez, sin rebotes.
 *
 * El retardo se hornea dentro de la variante: pasarlo por la prop
 * `transition` reemplazaría la duración y el easing de la variante.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variants,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];

  const resolved: Variants =
    variants ??
    (delay
      ? {
          hidden: { opacity: 0, y: 22 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: EASE_OUT, delay },
          },
        }
      : fadeUp);

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_SOFT}
      variants={resolved}
    >
      {children}
    </MotionTag>
  );
}

type GroupProps = {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "dl";
};

/** Contenedor que escalona la entrada de sus hijos <RevealItem>. */
export function RevealGroup({
  children,
  className,
  gap = 0.08,
  delay = 0,
  as = "div",
}: GroupProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_SOFT}
      variants={stagger(gap, delay)}
    >
      {children}
    </MotionTag>
  );
}

type ItemProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "li" | "article";
};

export function RevealItem({
  children,
  className,
  variants = fadeUp,
  as = "div",
}: ItemProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={variants}>
      {children}
    </MotionTag>
  );
}
