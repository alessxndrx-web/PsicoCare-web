import { randomBytes } from "node:crypto";
import { closePool, enforceRetention, migrate, query } from "../lib/database";
import { countUsers, createUser, MIN_PASSWORD_LENGTH, passwordProblem } from "../lib/server/auth";
import { seedSurvey } from "../lib/surveys/repository";
import { initialSurvey } from "../lib/surveys/initial-survey";

const action = process.argv[2] ?? "setup";

function fail(message: string): never { console.error(message); process.exit(1); }

async function main() {
  if (!process.env.DATABASE_URL) fail("Falta DATABASE_URL. Configúrala antes de ejecutar este comando.");

  if (["setup", "migrate"].includes(action)) { await migrate(); console.log("Migraciones aplicadas."); }
  if (["setup", "seed"].includes(action)) { await seedSurvey(initialSurvey); console.log("Encuesta inicial disponible. No se han creado respuestas de ejemplo."); }

  if (action === "purge") {
    await query("DELETE FROM survey_responses WHERE (completed_at IS NULL AND updated_at < now() - interval '7 days') OR completed_at < now() - interval '180 days'");
    await query("DELETE FROM contact_leads WHERE created_at < now() - interval '180 days'");
    await query("DELETE FROM rate_limits WHERE expires_at <= $1", [Date.now()]);
    await query("DELETE FROM team_sessions WHERE expires_at <= now()");
    console.log("Retención aplicada: borradores 7 días; respuestas y contactos 180 días.");
  }

  /** Creates the first team account. Everything afterwards is managed from the panel. */
  if (action === "bootstrap") {
    await migrate();
    const email = process.argv[3] ?? process.env.BOOTSTRAP_EMAIL;
    const name = process.argv[4] ?? process.env.BOOTSTRAP_NAME ?? "Equipo PsicoCare";
    if (!email) fail("Uso: npm run team:bootstrap -- correo@ejemplo.com \"Nombre Apellido\"");
    if (await countUsers()) fail("Ya existe al menos una cuenta activa. Crea las demás desde el panel.");
    const password = process.env.BOOTSTRAP_PASSWORD ?? randomBytes(9).toString("base64url");
    const problem = passwordProblem(password);
    if (problem) fail(`La contraseña indicada no es válida: ${problem}`);
    await createUser({ email, name, password, mustChangePassword: true });
    console.log("Cuenta creada.");
    console.log(`  Correo:      ${email}`);
    console.log(`  Contraseña:  ${password}`);
    console.log(`Cámbiala al entrar. Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`);
  }

  if (action === "retention") { await enforceRetention(); console.log("Retención comprobada."); }
}

main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }).finally(() => closePool());
