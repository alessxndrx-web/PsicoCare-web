"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { nav } from "@/lib/content";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";

const SECTION_IDS = nav.map((item) => item.href.slice(1));

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Marca el enlace de la sección visible más cercana al tope */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* Bloquea el scroll de fondo mientras el menú móvil está abierto */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5">
        <motion.nav
          aria-label="Navegación principal"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 }}
          className={cn(
            "flex w-full max-w-[1180px] items-center justify-between gap-6 rounded-full py-2.5 pr-2.5 pl-5 transition-all duration-500",
            scrolled
              ? "bg-ink-950/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-xl"
              : "bg-ink-950/25 ring-1 ring-white/[0.06] backdrop-blur-md",
          )}
        >
          <a href="#inicio" aria-label="PsicoCare — ir al inicio" className="shrink-0">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const id = item.href.slice(1);
              const isActive = active === id;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-full px-3 py-1.5 text-[13px] transition-colors duration-300",
                      isActive
                        ? "text-on-dark"
                        : "text-on-dark-soft hover:text-on-dark",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-white/10"
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#cta"
              className="hidden rounded-full bg-linear-to-r from-brand-600 to-spark-500 px-4 py-2 text-[13px] font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 sm:inline-flex"
            >
              Conoce PsicoCare
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/12 transition-colors hover:bg-white/[0.06] lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-4 bg-current transition-all duration-300",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-4 bg-current transition-all duration-300",
                    open ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </span>
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <nav
              aria-label="Navegación móvil"
              className="flex h-full flex-col justify-center px-8"
            >
              <ul className="space-y-1">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.05, ease: EASE_OUT, duration: 0.5 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 border-b border-white/[0.06] py-4 text-2xl font-medium text-on-dark"
                    >
                      <span className="font-mono text-[11px] text-spark-400/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a
                href="#cta"
                onClick={() => setOpen(false)}
                className="mt-10 inline-flex justify-center rounded-full bg-linear-to-r from-brand-600 to-spark-500 px-6 py-3.5 font-medium text-white"
              >
                Conoce PsicoCare
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
