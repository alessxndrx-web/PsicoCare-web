/** Decorative homepage introduction. No device, connection or storage eligibility checks. */
export const INTRO_ATTRIBUTE = "data-intro";
export const INTRO_DURATION_MS = 1800;
export const INTRO_FLIGHT_DEADLINE_MS = 1150;

export type IntroEnvironment = {
  pathname: string;
  hash: string;
  alreadySeen?: boolean;
  reducedMotion?: boolean;
  saveData?: boolean;
  deviceMemory?: number;
};

/** Every full homepage load plays; deep links remain immediately usable. */
export function shouldPlayIntro(env: IntroEnvironment): boolean {
  return env.pathname === "/" && !env.hash;
}

/** No storage access. CSS handles the reduced-motion presentation and normal exit.
 * Independent watchdog starts after parsing, even if React hydration never succeeds.
 */
export const INTRO_BOOT_SCRIPT = `(function(){var d=document.documentElement,l=location,a="${INTRO_ATTRIBUTE}";if(l.pathname!=="/"||l.hash)return;window.__pcIntroStart=performance.now();d.setAttribute(a,"play");function clean(){setTimeout(function(){if(d.getAttribute(a)==="play"||d.getAttribute(a)==="skip")d.setAttribute(a,"done")},2500)}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",clean,{once:true});else clean()})();`;
