import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { publicRoutes } from "../../lib/seo";

const origin = "http://127.0.0.1:3100";
const introState = (page: Page) => page.evaluate(() => document.documentElement.getAttribute("data-intro"));
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  return errors;
}

test.describe("Neural Awakening", () => {
  test.use({ reducedMotion: "no-preference" });

  test("plays on a homepage load, ends in time and lands on the navbar logo", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    expect(await introState(page)).toBe("play");
    // The indexable content is in the DOM from the first byte, under the overlay.
    await expect(page.getByRole("heading", { level: 1, name: "Tu bienestar importa." })).toBeAttached();
    await expect(page.locator(".neural-intro")).toBeVisible();
    await expect(page.getByRole("button", { name: "Omitir introducción" })).toBeVisible();
    await page.waitForFunction(() => document.documentElement.getAttribute("data-intro") === "done", null, { timeout: 4000 });
    const doneAt = await page.evaluate(() => performance.now() - (window.__pcIntroStart ?? 0));
    expect(doneAt).toBeLessThan(2600); // 1800 ms timeline + cleanup margin for slow CI machines
    await expect(page.locator(".neural-intro")).toBeHidden();
    await expect(page.locator(".site-header .brand-logo")).toHaveCSS("opacity", "1");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("replays on reload but not internal navigation", async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => document.documentElement.getAttribute("data-intro") === "done", null, { timeout: 4000 });
    await page.reload();
    expect(await introState(page)).toBe("play");
    await page.waitForFunction(() => document.documentElement.getAttribute("data-intro") === "done", null, { timeout: 4000 });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator(".desktop-nav").getByRole("link", { name: "NeuroIA" }).click();
    await expect(page).toHaveURL(/\/neuroia$/);
    await page.getByRole("link", { name: "Psico Care — inicio" }).first().click();
    await expect(page).toHaveURL(origin + "/");
    expect(await introState(page)).not.toBe("play");
    await expect(page.locator(".neural-intro")).toBeHidden();
  });

  test("can be skipped with the keyboard or the visible button", async ({ browser }) => {
    for (const how of ["Escape", "button"] as const) {
      const context = await browser.newContext({ reducedMotion: "no-preference" });
      const page = await context.newPage();
      await page.goto(origin + "/");
      expect(await introState(page)).toBe("play");
      if (how === "Escape") await page.keyboard.press("Escape");
      else await page.getByRole("button", { name: "Omitir introducción" }).click();
      await page.waitForFunction(() => document.documentElement.getAttribute("data-intro") === "done", null, { timeout: 1000 });
      await expect(page.locator(".neural-intro")).toBeHidden();
      await context.close();
    }
  });

  test("shows static branding for reduced motion and skips section links", async ({ browser }) => {
    const reduced = await browser.newContext({ reducedMotion: "reduce" });
    const page = await reduced.newPage();
    await page.goto(origin + "/");
    expect(await introState(page)).toBe("play");
    await expect(page.locator(".neural-intro")).toBeVisible();
    await expect(page.locator(".ni-iso")).toHaveCSS("opacity", "1");
    await expect(page.locator(".ni-logo")).toHaveCSS("animation-name", "none");
    await page.waitForFunction(() => document.documentElement.getAttribute("data-intro") === "done", null, { timeout: 4000 });
    await expect(page.locator(".neural-intro")).toBeHidden();
    await reduced.close();
    const deep = await browser.newContext({ reducedMotion: "no-preference" });
    const deepPage = await deep.newPage();
    await deepPage.goto(origin + "/#contacto");
    expect(await introState(deepPage)).toBeNull();
    await deep.close();
  });

  test("mobile shows intro even with low memory, save data and blocked storage", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true, reducedMotion: "no-preference" });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "deviceMemory", { configurable: true, value: 1 });
      Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } });
      Object.defineProperty(window, "sessionStorage", { configurable: true, get() { throw new Error("blocked"); } });
    });
    const page = await context.newPage();
    await page.goto(origin + "/");
    expect(await introState(page)).toBe("play");
    await expect(page.locator(".neural-intro")).toBeVisible();
    await page.waitForFunction(() => document.documentElement.getAttribute("data-intro") === "done", null, { timeout: 4000 });
    await expect(page.locator(".neural-intro")).toBeHidden();
    await context.close();
  });

  test("without JavaScript the homepage is complete and the overlay never shows", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "no-preference" });
    const page = await context.newPage();
    await page.goto(origin + "/");
    await expect(page.getByRole("heading", { level: 1, name: "Tu bienestar importa." })).toBeVisible();
    await expect(page.locator(".neural-intro")).toBeHidden();
    await expect(page.locator(".site-header .brand-logo")).toBeVisible();
    expect(await page.locator('script[type="application/ld+json"]').count()).toBe(1);
    await context.close();
  });

  test("stays within time on a throttled CPU and slow network (Chromium only)", async ({ browser, browserName }) => {
    test.skip(browserName !== "chromium", "CPU and network throttling use the Chrome DevTools Protocol");
    const context = await browser.newContext({ reducedMotion: "no-preference", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 6 });
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 400, downloadThroughput: 400 * 1024 / 8, uploadThroughput: 400 * 1024 / 8 });
    const errors = trackErrors(page);
    await page.goto(origin + "/", { timeout: 60000 });
    await page.waitForFunction(() => document.documentElement.getAttribute("data-intro") !== "play", null, { timeout: 8000 });
    await expect(page.locator(".neural-intro")).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
    await context.close();
  });
});

test.describe("SEO and crawlability", () => {
  test("every public page has a unique title, description, canonical, one h1 and valid JSON-LD", async ({ request, page }) => {
    const titles = new Set<string>(); const descriptions = new Set<string>();
    for (const route of publicRoutes) {
      const response = await page.goto(route.path);
      expect(response?.status(), route.path).toBe(200);
      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(titles.has(title), "duplicate title " + title).toBe(false); titles.add(title);
      expect(description && !descriptions.has(description), "duplicate description on " + route.path).toBeTruthy(); descriptions.add(description!);
      expect(description!.length, route.path).toBeGreaterThanOrEqual(70);
      expect(description!.length, route.path).toBeLessThanOrEqual(220);
      expect(title.length, route.path).toBeLessThanOrEqual(70);
      expect(canonical).toBe(origin + (route.path === "/" ? "" : route.path));
      expect(await page.locator("h1").count(), route.path).toBe(1);
      expect(await page.locator('meta[property="og:image"]').count(), route.path).toBeGreaterThan(0);
      for (const json of await page.locator('script[type="application/ld+json"]').allTextContents()) expect(() => JSON.parse(json)).not.toThrow();
      expect(await page.locator("img:not([alt])").count(), route.path).toBe(0);
    }
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const route of publicRoutes) expect(sitemap).toContain(`<loc>${origin}${route.path === "/" ? "" : route.path}</loc>`);
    expect(sitemap).not.toContain("/admin");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin/");
    expect(robots).toContain(`Sitemap: ${origin}/sitemap.xml`);
    for (const asset of ["/favicon.ico", "/manifest.webmanifest", "/llms.txt", "/apple-icon.png", "/brand/psicocare-logo-512.png"]) expect((await request.get(asset)).status(), asset).toBe(200);
    expect((await request.get("/blog")).status()).toBe(404);
    expect((await request.get("/blog/ia-acompanamiento-vs-atencion-psicologica")).status()).toBe(404);
    expect((await request.get("/pagina-que-no-existe")).status()).toBe(404);
    const redirect = await request.get("/instituciones", { maxRedirects: 0 });
    expect(redirect.status()).toBe(308);
  });

  test("there are no broken internal links on public pages", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const route of publicRoutes) {
      await page.goto(route.path);
      const hrefs = await page.locator("a[href]").evaluateAll(as => as.map(a => (a as HTMLAnchorElement).href));
      for (const href of hrefs) { const url = new URL(href); if (url.origin === origin) seen.add(url.pathname); }
    }
    const broken: string[] = [];
    for (const path of seen) { const r = await request.get(path, { maxRedirects: 5 }); if (r.status() >= 400) broken.push(`${path} → ${r.status()}`); }
    expect(broken).toEqual([]);
    expect(seen.size).toBeGreaterThan(15);
  });

  test("new pages meet automated accessibility checks and do not overflow", async ({ page }) => {
    for (const path of ["/neuroia", "/investigacion", "/prensa"]) {
      await page.goto(path);
      for (const width of [375, 768, 1100, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${path} overflows at ${width}`).toBe(true);
      }
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(result.violations, path).toEqual([]);
    }
  });

  test("private areas are not exposed to visitors", async ({ request }) => {
    const panel = await request.get("/admin/encuestas");
    const html = await panel.text();
    expect(html).not.toContain("contact_leads");
    expect(html).not.toMatch(/@psicocare\.test/);
    const api = await request.get("/api/admin/users");
    expect([401, 403, 405]).toContain(api.status());
  });
});
