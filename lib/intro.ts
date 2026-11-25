/**
 * Neural Awakening — decides whether the homepage introduction may play.
 *
 * The decision runs as a tiny inline script before the first paint (see INTRO_BOOT_SCRIPT), so the
 * page never flashes without the overlay and then gets covered. Without JavaScript the attribute is
 * never set and the homepage renders exactly as before: the intro is an enhancement, not a gate.
 */
export const INTRO_STORAGE_KEY = "pc-intro-seen";
export const INTRO_ATTRIBUTE = "data-intro";
/** Total length of the CSS timeline in milliseconds. Keep in sync with neural-awakening.css. */
export const INTRO_DURATION_MS = 1800;
/** After this point the logo flight can no longer be set up without a visible jump. */
export const INTRO_FLIGHT_DEADLINE_MS = 1150;

export type IntroEnvironment = {
  pathname: string;
  hash: string;
  alreadySeen: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  /** navigator.deviceMemory in GB when the browser exposes it. */
  deviceMemory?: number;
};

/** Pure rule shared by the inline boot script and the unit tests. */
export function shouldPlayIntro(env: IntroEnvironment): boolean {
  if (env.pathname !== "/") return false; // only the homepage, never a deep page
  if (env.hash) return false; // a link to a section wants that section now
  if (env.alreadySeen) return false; // once per browser session; internal navigation never replays it
  if (env.reducedMotion) return false;
  if (env.saveData) return false;
  if (typeof env.deviceMemory === "number" && env.deviceMemory < 2) return false; // low-end devices
  return true;
}

/**
 * Inline, render-blocking but ~500 bytes. Mirrors shouldPlayIntro; any exception (for example a
 * blocked sessionStorage) simply means no intro. The flag is stored before playing, so a reload in
 * the middle of the animation does not replay it.
 */
export const INTRO_BOOT_SCRIPT = `(function(){try{var d=document.documentElement,l=location,n=navigator,c=n.connection,s=sessionStorage,k="${INTRO_STORAGE_KEY}";if(l.pathname!=="/"||l.hash||s.getItem(k))return;s.setItem(k,"1");if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(c&&c.saveData)return;if(n.deviceMemory&&n.deviceMemory<2)return;window.__pcIntroStart=performance.now();d.setAttribute("${INTRO_ATTRIBUTE}","play")}catch(e){}})();`;
