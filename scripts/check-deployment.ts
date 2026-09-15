import { SURVEY_SLUG } from "../lib/surveys/types";

/**
 * Probes a live deployment without credentials and reports what is configured.
 * Usage: npm run check:deploy -- https://tu-proyecto.vercel.app
 */
const base = (process.argv[2] ?? "").replace(/\/$/, "");
if (!base.startsWith("http")) {
  console.error("Uso: npm run check:deploy -- https://tu-proyecto.vercel.app");
  process.exit(1);
}

type Level = "ok" | "falta" | "aviso";
const results: { level: Level; title: string; detail: string }[] = [];
const add = (level: Level, title: string, detail: string) => results.push({ level, title, detail });

async function get(path: string, init?: RequestInit) {
  try { return await fetch(base + path, { redirect: "manual", ...init }); }
  catch (error) { throw new Error(`no se pudo conectar: ${error instanceof Error ? error.message : error}`); }
}

async function main() {
  // 1. Is the site up at all?
  const home = await get("/");
  if (home.ok) add("ok", "Sitio publicado", `La portada responde ${home.status}.`);
  else { add("falta", "Sitio publicado", `La portada responde ${home.status}. Revisa el despliegue en Vercel.`); return; }

  // 2. Security headers come from next.config.ts, so they prove the deployed build is current.
  const headers = ["x-frame-options", "x-content-type-options", "referrer-policy", "content-security-policy"];
  const missing = headers.filter(h => !home.headers.get(h));
  add(missing.length ? "falta" : "ok", "Cabeceras de seguridad",
    missing.length ? `Faltan: ${missing.join(", ")}. Puede que el despliegue no incluya el último commit.` : "Todas presentes.");

  // 3. The renamed route must keep old links alive.
  const redirect = await get("/instituciones");
  add(redirect.status === 308 && (redirect.headers.get("location") ?? "").includes("/educacion") ? "ok" : "falta",
    "Redirección /instituciones", `Responde ${redirect.status} hacia ${redirect.headers.get("location") ?? "ninguna parte"}.`);

  // 4. SITE_URL drives canonical + Open Graph URLs.
  const educationHtml = await (await get("/educacion")).text();
  const canonical = educationHtml.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
    ?? educationHtml.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  if (!canonical) add("aviso", "SITE_URL", "No se encontró canonical ni og:url para comprobarlo.");
  else if (canonical.startsWith(base)) add("ok", "SITE_URL", `Coincide con el dominio: ${canonical}`);
  else add("falta", "SITE_URL", `Apunta a ${canonical} en lugar de ${base}. Configúrala en Vercel y vuelve a desplegar.`);

  // 5. Two signals together separate "no connection string" from "tables never created":
  //    the admin page only reaches the user query when DATABASE_URL exists.
  const api = await get(`/api/surveys/${SURVEY_SLUG}`);
  const adminHtml = await (await get("/admin/encuestas")).text();
  const envMissing = adminHtml.includes("almacenamiento todavía no está configurado");
  const apiOk = api.status === 200;

  if (apiOk) {
    const data = await api.json() as { survey?: { questions?: unknown[] } };
    const count = data.survey?.questions?.length ?? 0;
    add(count === 14 ? "ok" : "aviso", "Base de datos y encuesta",
      count === 14 ? "Conectada y con las 14 preguntas sembradas." : `Conectada, pero la encuesta tiene ${count} preguntas.`);
  } else if (envMissing) {
    add("falta", "DATABASE_URL", "No está configurada en Vercel. Créala desde Storage > Create Database (Neon) y vuelve a desplegar.");
  } else {
    add("falta", "Migraciones", `DATABASE_URL sí está configurada, pero la base responde con error (API ${api.status}). Lo más probable es que falten las tablas: ejecuta db:setup contra la base de producción.`);
  }

  // 6. Origin enforcement must reject cross-site writes.
  const forged = await get(`/api/surveys/${SURVEY_SLUG}`, {
    method: "POST", headers: { "Content-Type": "application/json", origin: "https://sitio-no-autorizado.example" },
    body: JSON.stringify({ consent: true, adult: true, consentVersion: "x" }),
  });
  add(forged.status === 403 ? "ok" : "aviso", "Protección de origen",
    forged.status === 403 ? "Las peticiones de otro origen se rechazan con 403." : `Devuelve ${forged.status}; se esperaba 403.`);

  // 7. Whether any team account exists (only meaningful once storage works).
  if (adminHtml.includes("Escuchar para construir")) add("aviso", "Panel interno", "Se está sirviendo sin pedir sesión. Revísalo de inmediato.");
  else if (envMissing) add("falta", "Cuentas del equipo", "No se puede comprobar: falta la base de datos.");
  else if (adminHtml.includes("Entra con tu cuenta")) add("ok", "Cuentas del equipo", "Hay al menos una cuenta y el panel pide inicio de sesión.");
  else if (adminHtml.includes("Todavía no hay ninguna cuenta creada")) add("falta", "Cuentas del equipo",
    apiOk ? "La base funciona pero no hay ninguna cuenta. Ejecuta team:bootstrap contra la base de producción."
          : "Sin cuentas, y la base tampoco responde: resuelve primero las migraciones.");
  else add("aviso", "Panel interno", "Estado no reconocido.");

  // 8. Google sign-in is optional; report which path visitors will see.
  const survey = await get("/encuestas");
  const surveyHtml = await survey.text();
  add("ok", "Acceso con Google", surveyHtml.includes("/api/auth/google")
    ? "Configurado: se ofrece iniciar sesión con Google."
    : "No configurado: solo se ofrece el campo manual de correo (es una opción válida).");
}

main()
  .then(() => {
    const icon = { ok: "  OK   ", falta: " FALTA ", aviso: " AVISO " };
    console.log(`\nVerificación de ${base}\n${"=".repeat(60)}`);
    for (const r of results) console.log(`[${icon[r.level]}] ${r.title}\n            ${r.detail}`);
    const pending = results.filter(r => r.level === "falta");
    console.log("=".repeat(60));
    console.log(pending.length ? `\n${pending.length} punto(s) por resolver antes de dar el despliegue por bueno.` : "\nTodo lo verificable desde fuera está correcto.");
    process.exitCode = pending.length ? 1 : 0;
  })
  .catch(error => { console.error(`\nNo se pudo completar la verificación: ${error.message}`); process.exitCode = 1; });
