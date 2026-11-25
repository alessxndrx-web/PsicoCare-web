import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { INTRO_BOOT_SCRIPT, shouldPlayIntro, type IntroEnvironment } from "../lib/intro";

const base: IntroEnvironment = { pathname: "/", hash: "", alreadySeen: false, reducedMotion: false, saveData: false };

test("the intro only plays on a first homepage visit with motion allowed", () => {
  assert.equal(shouldPlayIntro(base), true);
  assert.equal(shouldPlayIntro({ ...base, pathname: "/neuroia" }), false);
  assert.equal(shouldPlayIntro({ ...base, hash: "#contacto" }), false);
  assert.equal(shouldPlayIntro({ ...base, alreadySeen: true }), false);
  assert.equal(shouldPlayIntro({ ...base, reducedMotion: true }), false);
  assert.equal(shouldPlayIntro({ ...base, saveData: true }), false);
  assert.equal(shouldPlayIntro({ ...base, deviceMemory: 1 }), false);
  assert.equal(shouldPlayIntro({ ...base, deviceMemory: 4 }), true);
});

/** Runs the real inline script against a fake browser, so it cannot drift from the rule above. */
function boot(env: IntroEnvironment & { storageThrows?: boolean }) {
  const attributes: Record<string, string> = {};
  const store = new Map<string, string>(env.alreadySeen ? [["pc-intro-seen", "1"]] : []);
  const sessionStorage = {
    getItem: (k: string) => { if (env.storageThrows) throw new Error("SecurityError"); return store.get(k) ?? null; },
    setItem: (k: string, v: string) => { store.set(k, v); },
  };
  const window: Record<string, unknown> = {};
  const context = vm.createContext({
    document: { documentElement: { setAttribute: (k: string, v: string) => { attributes[k] = v; } } },
    location: { pathname: env.pathname, hash: env.hash },
    navigator: { connection: { saveData: env.saveData }, deviceMemory: env.deviceMemory },
    sessionStorage, performance: { now: () => 1 }, window,
    matchMedia: () => ({ matches: env.reducedMotion }),
  });
  window.matchMedia = context.matchMedia;
  vm.runInContext(INTRO_BOOT_SCRIPT, context);
  return { played: attributes["data-intro"] === "play", remembered: store.get("pc-intro-seen") === "1" };
}

test("the inline boot script matches the rule in every case", () => {
  const cases: (IntroEnvironment & { storageThrows?: boolean })[] = [
    base, { ...base, pathname: "/educacion" }, { ...base, hash: "#app-movil" }, { ...base, alreadySeen: true },
    { ...base, reducedMotion: true }, { ...base, saveData: true }, { ...base, deviceMemory: 1 },
  ];
  for (const c of cases) assert.equal(boot(c).played, shouldPlayIntro(c), JSON.stringify(c));
});
test("a first homepage visit is remembered for the session even when motion is reduced", () => {
  assert.equal(boot(base).remembered, true);
  assert.equal(boot({ ...base, reducedMotion: true }).remembered, true);
});
test("a blocked sessionStorage means no intro instead of an error", () => {
  assert.deepEqual(boot({ ...base, storageThrows: true }), { played: false, remembered: false });
});
