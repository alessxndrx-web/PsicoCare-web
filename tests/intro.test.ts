import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { INTRO_BOOT_SCRIPT, shouldPlayIntro, type IntroEnvironment } from "../lib/intro";

const base: IntroEnvironment = { pathname: "/", hash: "" };
const cases: IntroEnvironment[] = [
  base, { ...base, alreadySeen: true }, { ...base, saveData: true },
  { ...base, deviceMemory: 1 }, { ...base, reducedMotion: true },
  { ...base, pathname: "/neuroia" }, { ...base, hash: "#contacto" },
];
function boot(env: IntroEnvironment) {
  const attributes: Record<string, string> = {};
  const callbacks: (() => void)[] = [];
  const context = vm.createContext({
    document: { readyState: "complete", documentElement: {
      setAttribute: (k: string, v: string) => { attributes[k] = v; },
      getAttribute: (k: string) => attributes[k],
    } },
    location: { pathname: env.pathname, hash: env.hash },
    navigator: { connection: { saveData: env.saveData }, deviceMemory: env.deviceMemory },
    performance: { now: () => 1 }, window: {},
    setTimeout: (fn: () => void) => { callbacks.push(fn); },
  });
  Object.defineProperty(context, "sessionStorage", { get() { throw new Error("blocked"); } });
  vm.runInContext(INTRO_BOOT_SCRIPT, context);
  return { attributes, callbacks };
}
test("homepage intro is independent of device, data saver, motion and storage", () => {
  for (const c of cases) {
    assert.equal(boot(c).attributes["data-intro"] === "play", shouldPlayIntro(c));
  }
});
test("watchdog clears the overlay even without hydration", () => {
  const { attributes, callbacks } = boot(base);
  assert.equal(attributes["data-intro"], "play");
  callbacks.forEach(fn => fn());
  assert.equal(attributes["data-intro"], "done");
});
