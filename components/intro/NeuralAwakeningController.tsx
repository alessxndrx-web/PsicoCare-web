"use client";
import { useEffect } from "react";
import { INTRO_ATTRIBUTE, INTRO_DURATION_MS, INTRO_FLIGHT_DEADLINE_MS } from "@/lib/intro";

declare global { interface Window { __pcIntroStart?: number } }

const SKIP_FADE_MS = 220;
const IGNORED_KEYS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock"]);

/**
 * Adds what CSS alone cannot do to the Neural Awakening timeline:
 * - flight of the logo into the real navbar logo (a shared-element transition), measured live;
 * - skipping with any key, click, tap, wheel or the visible "Omitir introducción" button;
 * - cleanup, so the overlay leaves the DOM flow and the accessibility tree when it ends.
 * If this never runs, the CSS timeline still finishes by itself with a fade.
 */
export function NeuralAwakeningController() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute(INTRO_ATTRIBUTE) !== "play") return;
    const overlay = document.querySelector<HTMLElement>("[data-neural-intro]");
    if (!overlay) { root.setAttribute(INTRO_ATTRIBUTE, "done"); return; }
    // Measure the visible CSS timeline rather than the early boot script: slow mobile parsing must not consume the animation budget.
    const timeline = typeof overlay.getAnimations === "function" ? overlay.getAnimations()[0] : undefined;
    const elapsed = typeof timeline?.currentTime === "number" ? Math.max(0, timeline.currentTime) : 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let finished = false;
    const timers: number[] = [];

    const finish = () => {
      if (finished) return;
      finished = true;
      root.setAttribute(INTRO_ATTRIBUTE, "done");
      detach();
    };
    const skip = () => {
      if (finished || root.getAttribute(INTRO_ATTRIBUTE) !== "play") return;
      root.setAttribute(INTRO_ATTRIBUTE, "skip");
      timers.push(window.setTimeout(finish, SKIP_FADE_MS));
    };
    const onKey = (event: KeyboardEvent) => { if (!IGNORED_KEYS.has(event.key)) skip(); };
    const onEnd = (event: AnimationEvent) => { if (event.target === overlay && event.animationName === "ni-exit") finish(); };
    const events: [EventTarget, string, EventListener][] = [
      [window, "keydown", onKey as EventListener],
      [overlay, "pointerdown", skip],
      [window, "wheel", skip],
      [window, "touchmove", skip],
      [overlay, "animationend", onEnd as EventListener],
    ];
    events.forEach(([target, type, fn]) => target.addEventListener(type, fn, { passive: true }));
    function detach() {
      events.forEach(([target, type, fn]) => target.removeEventListener(type, fn));
      timers.forEach(clearTimeout);
    }

    // Shared-element flight: only when there is time left to set it up before phase 4 starts and the
    // navbar logo is actually laid out. Otherwise the CSS default (a gentle fade in place) is used.
    const logo = overlay.querySelector<HTMLElement>(".ni-logo");
    const target = document.querySelector<HTMLElement>(".site-header .brand-logo");
    if (!reduced && logo && target && elapsed < INTRO_FLIGHT_DEADLINE_MS) {
      const from = logo.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      if (from.width > 0 && to.width > 0 && to.bottom > 0 && to.top < window.innerHeight) {
        logo.style.setProperty("--fx", `${to.left + to.width / 2 - (from.left + from.width / 2)}px`);
        logo.style.setProperty("--fy", `${to.top + to.height / 2 - (from.top + from.height / 2)}px`);
        logo.style.setProperty("--fs", String(to.width / from.width));
        logo.style.setProperty("--fo", "1");
        overlay.classList.add("is-flying");
      }
    }
    // Safety net in case animationend never fires (for example a background tab).
    timers.push(window.setTimeout(finish, Math.max(0, INTRO_DURATION_MS + 150 - elapsed)));
    overlay.querySelector("[data-intro-skip]")?.addEventListener("click", skip);
    return () => { overlay.querySelector("[data-intro-skip]")?.removeEventListener("click", skip); detach(); };
  }, []);
  return null;
}
