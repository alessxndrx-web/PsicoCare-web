import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";
import { initialSurvey } from "../../lib/surveys/initial-survey";
import { CONSENT_VERSION, SURVEY_SLUG } from "../../lib/surveys/types";
const endpoint = "/api/surveys/" + SURVEY_SLUG;
const origin = "http://127.0.0.1:3100";
async function begin(page: Page) {
  await page.goto("/encuestas");
  await expect(page.getByRole("heading", { name: "Antes de comenzar, tú decides." })).toBeVisible();
  await page.getByRole("checkbox", { name: /Confirmo que tengo 18/ }).check();
  await page.getByRole("checkbox", { name: /He leído esta información/ }).check();
  await page.getByRole("button", { name: "Comenzar encuesta" }).click();
  await expect(page.getByText("Pregunta 1 de 14", { exact: true })).toBeVisible();
}
test("homepage has no overflow at all requested widths and meets automated accessibility checks", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Tu bienestar importa.", exact: true })).toBeVisible();
  mkdirSync(".verification", { recursive: true });
  for (const width of [375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "Overflow at " + width).toBe(true);
    if (width === 390 || width === 1440) await page.screenshot({ path: ".verification/home-" + width + ".png", fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: ".verification/home-hero.png" });
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => getComputedStyle(document.querySelector(".hero-copy")!).animationName)).toBe("none");
});
test("mobile navigation supports selection and Escape, module tabs support keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Abrir menú" })).toBeFocused();
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page.locator("#mobile-menu").getByRole("link", { name: "Funciones" }).click();
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  const firstTab = page.getByRole("tab", { name: "Conversaciones guiadas" });
  await firstTab.focus(); await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("tab", { name: "Diario y reflexiones" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: "Diario y reflexiones" })).toBeVisible();
});
test("mobile demo completes onboarding, conversations, reflections, breathing and real local progress", async ({ page }) => {
  await page.goto("/#app-movil");
  const demo = page.locator("#app-movil");
  await demo.getByRole("button", { name: "Comenzar", exact: true }).click();
  await demo.getByRole("button", { name: "Tranquilo/a", exact: true }).click();
  await demo.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(demo.getByRole("heading", { name: /Hoy, a tu ritmo/ })).toBeVisible();
  await demo.locator(".app-module-grid").getByRole("button", { name: /Conversar/ }).click();
  await demo.getByRole("button", { name: "Preguntas sencillas", exact: true }).click();
  await demo.getByRole("button", { name: "Terminar esta práctica" }).click();
  await expect(demo.getByText("Dar este primer paso también cuenta.")).toBeVisible();
  await demo.locator(".demo-module-shortcuts").getByRole("button", { name: "Reflexiones", exact: true }).click();
  await demo.getByLabel("Mi reflexión").fill("Ejemplo de prueba: preparar una presentación.");
  await demo.getByRole("button", { name: "Guardar en este recorrido" }).click();
  await demo.locator(".demo-module-shortcuts").getByRole("button", { name: "Herramientas", exact: true }).click();
  await page.clock.install();
  await demo.getByRole("button", { name: "Comenzar la pausa" }).click();
  await page.clock.runFor(31000);
  await expect(demo.getByText(/Pausa completada. Gracias/)).toBeVisible();
  await demo.locator(".demo-module-shortcuts").getByRole("button", { name: "Progreso", exact: true }).click();
  await expect(demo.getByText("Conversación practicada", { exact: true })).toBeVisible();
  await expect(demo.getByText("Reflexión escrita", { exact: true })).toBeVisible();
  await expect(demo.getByText("Pausa completada", { exact: true })).toBeVisible();
  await page.reload();
  await demo.locator(".demo-module-shortcuts").getByRole("button", { name: "Progreso", exact: true }).click();
  await expect(demo.getByText(/Aún no hay actividades completadas/)).toBeVisible();
});
test("survey validates consent, saves and resumes a draft, submits once and supports withdrawal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/encuestas");
  await page.getByRole("button", { name: "Comenzar encuesta" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Confirma tu edad");
  await begin(page);
  await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Selecciona una respuesta");
  await page.getByRole("radio", { name: "18–20", exact: true }).check();
  await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect(page.getByText("Pregunta 2 de 14", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Continuar mi encuesta" }).click();
  await expect(page.getByText("Pregunta 2 de 14", { exact: true })).toBeVisible();
  for (let i = 1; i < 14; i++) {
    const fields = page.locator(".question-fieldset");
    if (await fields.getByRole("radio").count()) await fields.getByRole("radio").first().check();
    else if (await fields.getByRole("checkbox").count()) await fields.getByRole("checkbox").first().check();
    if (i === 12) await fields.getByRole("textbox").fill("Más ejemplos para practicar entrevistas.");
    await page.getByRole("button", { name: i === 13 ? "Revisar respuestas" : i === 12 ? "Siguiente" : "Siguiente", exact: true }).click();
    if (i < 13) await expect(page.getByText("Pregunta " + (i + 2) + " de 14", { exact: true })).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: "Revisa lo que nos quieres compartir." })).toBeVisible();
  await page.getByRole("button", { name: "Enviar mis respuestas" }).click();
  await expect(page.getByRole("heading", { name: "Gracias por ayudarnos a construir PsicoCare." })).toBeVisible();
  const stored = await (await page.request.get(endpoint)).json();
  expect(stored.response.completed).toBe(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Gracias por ayudarnos a construir PsicoCare." })).toBeVisible();
  await page.getByRole("button", { name: "Retirar mi participación y borrar respuestas" }).click();
  await page.getByRole("button", { name: "Eliminar mi participación" }).click();
  await expect(page.getByRole("heading", { name: "Tu participación fue retirada." })).toBeVisible();
  expect((await (await page.request.get(endpoint)).json()).response).toBeNull();
});
test("survey error state preserves current answer and retry works; minors cannot participate", async ({ page }) => {
  await begin(page);
  await page.getByRole("radio", { name: "18–20", exact: true }).check();
  await page.route("**/api/surveys/*", async route => {
    if (route.request().method() === "PUT") await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "No pudimos guardar. Inténtalo de nuevo." }) });
    else await route.continue();
  });
  await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("No pudimos guardar");
  await expect(page.getByRole("radio", { name: "18–20", exact: true })).toBeChecked();
  await page.unroute("**/api/surveys/*");
  await page.getByRole("radio", { name: "15–17", exact: true }).check();
  await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Gracias por tu interés." })).toBeVisible();
  expect((await (await page.request.get(endpoint)).json()).response).toBeNull();
});
test("survey is responsive and accessible; malicious APIs are rejected", async ({ page, request }) => {
  await begin(page);
  for (const width of [375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(axe.violations).toEqual([]);
  expect((await request.put(endpoint, { headers: { origin }, data: { version: 1, answers: {}, complete: true } })).status()).toBe(401);
  expect((await request.post(endpoint, { headers: { origin: "https://untrusted.example" }, data: {} })).status()).toBe(403);
  expect((await request.post(endpoint, { headers: { origin }, data: { consent: true, adult: false, consentVersion: CONSENT_VERSION } })).status()).toBe(400);
  expect((await page.request.put(endpoint, { headers: { origin }, data: { version: 1, answers: { age: "forged-option" }, complete: true } })).status()).toBe(400);
  expect((await request.get("/api/surveys/unknown")).status()).toBe(404);
});
test("contact submissions reach the private inbox and analytics show actual stored aggregates", async ({ page, playwright }) => {
  await page.goto("/#contacto");
  const form = page.locator(".contact-form");
  await form.getByLabel("Tu nombre", { exact: true }).fill("Prueba institucional");
  await form.getByLabel("Correo institucional", { exact: true }).fill("test@example.com");
  await form.getByLabel("¿Cómo te gustaría participar?", { exact: true }).fill("Mensaje sintético de prueba para verificar el buzón.");
  await form.getByRole("checkbox").check();
  const [submission] = await Promise.all([
    page.waitForResponse(response => response.url().endsWith("/api/contact") && response.request().method() === "POST"),
    form.getByRole("button", { name: "Enviar mensaje" }).click(),
  ]);
  expect(submission.ok()).toBe(true);
  await expect(page.getByRole("heading", { name: "Gracias por acercarte." })).toBeVisible();
  await page.goto("/admin/encuestas");
  await expect(page.getByRole("heading", { name: "Un espacio interno." })).toBeVisible();
  await expect(page.getByText("Mensaje sintético de prueba para verificar el buzón.")).toHaveCount(0);
  for (let i = 0; i < 5; i++) {
    const participant = await playwright.request.newContext({ baseURL: origin, extraHTTPHeaders: { origin } });
    expect((await participant.post(endpoint, { data: { consent: true, adult: true, consentVersion: CONSENT_VERSION } })).ok()).toBe(true);
    const answers = Object.fromEntries(initialSurvey.questions.map(q => [q.id, q.id === "age" ? "age-3" : q.type === "text" ? "" : q.type === "multiple" ? [q.options[0].id] : q.options.length ? q.options[0].id : q.config.max === 10 ? 8 : 4]));
    expect((await participant.put(endpoint, { data: { version: 1, complete: true, answers } })).ok()).toBe(true);
    await participant.dispose();
  }
  await page.getByLabel("Correo", { exact: true }).fill(process.env.PC_TEST_ADMIN_EMAIL!);
  await page.getByLabel("Contraseña", { exact: true }).fill(process.env.PC_TEST_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Escuchar para construir." })).toBeVisible();
  await expect(page.locator(".metric-card").filter({ hasText: "Disposición media" }).locator("strong")).toHaveText("4");
  await expect(page.locator(".metric-card").filter({ hasText: "Recomendación media" }).locator("strong")).toHaveText("8");
  await expect(page.getByText("Mensaje sintético de prueba para verificar el buzón.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "¿Qué funciones te parecen más valiosas?" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page.getByRole("heading", { name: "Un espacio interno." })).toBeVisible();
});
test("secondary pages, unknown pages, SEO image and security headers work", async ({ page, request }) => {
  for (const url of ["/nosotros", "/seguridad", "/privacidad", "/tecnologia", "/educacion"]) {
    await page.goto(url); await expect(page.locator("main h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  const response = await request.get("/seguridad");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  const image = await request.get("/opengraph-image");
  expect(image.status()).toBe(200); expect(image.headers()["content-type"]).toContain("image/png");
  await page.goto("/pagina-inexistente"); await expect(page.getByRole("heading", { name: "Este espacio no está aquí." })).toBeVisible();
});

test("education page separates the free product from the institutional layer", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/educacion");
  await expect(page.getByRole("heading", { name: "PsicoCare para tu comunidad educativa." })).toBeVisible();
  // The free-for-people promise must be stated, not implied.
  await expect(page.locator(".edu-promise")).toContainText("gratuito para las personas");
  await expect(page.locator(".compare-card.is-free")).toContainText("Siempre gratuito para usuarios individuales.");
  await expect(page.locator(".compare-card.is-free")).toContainText("Conversaciones guiadas");
  await expect(page.locator(".compare-card.is-institutional")).toContainText("Panel institucional");
  // Privacy is the commercial argument, so it has to be visible on the page.
  await expect(page.locator(".privacy-callout")).toContainText("La institución mide el programa");
  await expect(page.locator(".privacy-callout")).toContainText("no forman parte del panel institucional");
  // No invented pricing and no demo numbers presented as real metrics.
  await expect(page.locator(".plans-disclaimer")).toContainText("Todavía no publicamos precios cerrados");
  await expect(page.locator("body")).not.toContainText("US$");
  for (const badge of ["Ejemplo de programa", "Ejemplo de panel", "Ejemplo de configuración"]) {
    await expect(page.locator(".demo-badge").filter({ hasText: badge }).first()).toBeVisible();
  }
  await expect(page.locator(".metric-placeholder").first()).toContainText("Sin datos todavía");
  // Commercial cards and collaboration tracks are presented as different categories.
  for (const plan of ["Piloto de validación", "PsicoCare Educación", "Programa a medida"]) {
    await expect(page.locator(".plan-card").filter({ has: page.getByRole("heading", { name: plan, exact: true }) })).toHaveCount(1);
  }
  await expect(page.locator(".collab-card")).toHaveCount(2);
  const education = page.locator(".plan-card").filter({ has: page.getByRole("heading", { name: "PsicoCare Educación", exact: true }) });
  await expect(education.getByRole("link", { name: /Conocer PsicoCare Educación/ })).toHaveAttribute("href", "/#contacto");
  const pilot = page.locator(".plan-card").filter({ has: page.getByRole("heading", { name: "Piloto de validación", exact: true }) });
  await expect(pilot.getByRole("link", { name: /Solicitar piloto/ })).toBeVisible();
  for (const [width, height] of [[375, 812], [390, 844], [430, 932], [768, 1024], [1366, 768], [1440, 900], [1536, 864], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "Overflow at " + width).toBe(true);
  }
  await page.setViewportSize({ width: 1366, height: 768 });
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.goto("/");
  await expect(page.locator(".audience-institutions").getByRole("link", { name: /Conocer PsicoCare Educación/ })).toHaveAttribute("href", "/educacion");
  await expect(page.getByRole("navigation").getByRole("link", { name: "Educación", exact: true }).first()).toBeVisible();
});
test("email opt-in is optional, reversible and visible to the internal panel", async ({ page }) => {
  const answers = Object.fromEntries(initialSurvey.questions.map(q => [q.id, q.id === "age" ? "age-3" : q.type === "text" ? "" : q.type === "multiple" ? [q.options[0].id] : q.options.length ? q.options[0].id : q.config.max === 10 ? 8 : 4]));
  await page.goto("/encuestas");
  expect((await page.request.post(endpoint, { data: { consent: true, adult: true, consentVersion: CONSENT_VERSION }, headers: { origin } })).ok()).toBe(true);
  expect((await page.request.put(endpoint, { data: { version: 1, complete: true, answers }, headers: { origin } })).ok()).toBe(true);
  await page.goto("/encuestas");
  await expect(page.getByRole("heading", { name: "Gracias por ayudarnos a construir PsicoCare." })).toBeVisible();
  // Completing the survey must not have stored any address on its own.
  expect((await (await page.request.get(endpoint)).json()).participant).toBeNull();
  await page.getByRole("button", { name: /¿Quieres enterarte cuando PsicoCare/ }).click();
  await page.getByLabel("Correo electrónico", { exact: true }).fill("participante@ejemplo.com");
  await page.getByRole("button", { name: "Guardar mi correo" }).click();
  await expect(page.locator(".email-optin").getByRole("alert")).toContainText("Confirma que quieres dejarnos tu correo");
  expect((await (await page.request.get(endpoint)).json()).participant).toBeNull();
  await page.locator(".email-optin").getByRole("checkbox").check();
  await page.getByRole("button", { name: "Guardar mi correo" }).click();
  await expect(page.getByText("participante@ejemplo.com")).toBeVisible();
  expect((await (await page.request.get(endpoint)).json()).participant).toMatchObject({ email: "participante@ejemplo.com", verified: false });
  const accessibility = await new AxeBuilder({ page }).include(".survey-card").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.goto("/admin/encuestas");
  await page.getByLabel("Correo", { exact: true }).fill(process.env.PC_TEST_ADMIN_EMAIL!);
  await page.getByLabel("Contraseña", { exact: true }).fill(process.env.PC_TEST_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  const row = page.locator(".responses-table tbody tr").filter({ hasText: "participante@ejemplo.com" }).first();
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "Ver todo" }).click();
  await expect(page.locator(".detail-panel")).toContainText("18–20");
  await expect(page.locator(".detail-panel")).toContainText("participante@ejemplo.com");
  await page.goto("/encuestas");
  await page.getByRole("button", { name: "Quitar mi correo" }).click();
  await expect(page.getByText("participante@ejemplo.com")).toHaveCount(0);
  expect((await (await page.request.get(endpoint)).json()).participant).toBeNull();
});
test("each team member signs in with their own account and can be revoked", async ({ page, context }) => {
  await page.goto("/admin/encuestas");
  // Nothing of the panel is reachable before signing in.
  await expect(page.getByRole("heading", { name: "Un espacio interno." })).toBeVisible();
  await expect(page.locator(".responses-table")).toHaveCount(0);
  await expect(page.locator(".team-panel")).toHaveCount(0);
  await page.getByLabel("Correo", { exact: true }).fill(process.env.PC_TEST_ADMIN_EMAIL!);
  await page.getByLabel("Contraseña", { exact: true }).fill("contrasena-que-no-es");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.locator(".admin-login").getByRole("alert")).toContainText("incorrectos");

  await page.getByLabel("Contraseña", { exact: true }).fill(process.env.PC_TEST_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Escuchar para construir." })).toBeVisible();
  await expect(page.locator(".admin-who")).toContainText("Equipo de pruebas");

  const colleague = `colega-${Date.now()}@psicocare.test`;
  const colleaguePassword = "colega-segura-2026";
  await page.getByRole("button", { name: /Añadir cuenta/ }).click();
  await page.getByLabel("Nombre", { exact: true }).fill("Colega de prueba");
  await page.getByLabel("Correo", { exact: true }).fill(colleague);
  await page.getByLabel("Contraseña inicial", { exact: true }).fill(colleaguePassword);
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page.locator(".team-list")).toContainText(colleague);

  // The new account is genuinely independent: it signs in on its own session.
  const second = await context.browser()!.newContext({ baseURL: "http://127.0.0.1:3100" });
  const colleaguePage = await second.newPage();
  await colleaguePage.goto("/admin/encuestas");
  await colleaguePage.getByLabel("Correo", { exact: true }).fill(colleague);
  await colleaguePage.getByLabel("Contraseña", { exact: true }).fill(colleaguePassword);
  const [signIn] = await Promise.all([
    colleaguePage.waitForResponse(r => r.url().endsWith("/api/admin/session") && r.request().method() === "POST"),
    colleaguePage.getByRole("button", { name: "Entrar", exact: true }).click(),
  ]);
  expect(signIn.status(), await signIn.text()).toBe(200);
  await expect(colleaguePage.getByRole("heading", { name: "Escuchar para construir." })).toBeVisible();
  await expect(colleaguePage.locator(".admin-who")).toContainText("Colega de prueba");
  // A password handed over by someone else must be rotated.
  await expect(colleaguePage.locator(".team-warning")).toBeVisible();

  // Revoking the account ends its access on the next request.
  const row = page.locator(".team-list li").filter({ hasText: colleague });
  await row.getByRole("button", { name: "Desactivar" }).click();
  await expect(row.locator(".team-state")).toHaveText("Desactivada");
  await colleaguePage.reload();
  await expect(colleaguePage.getByRole("heading", { name: "Un espacio interno." })).toBeVisible();
  await second.close();

  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page.getByRole("heading", { name: "Un espacio interno." })).toBeVisible();
});
