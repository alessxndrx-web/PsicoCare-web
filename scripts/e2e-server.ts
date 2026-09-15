import { spawn } from "node:child_process";
import { closePool, migrate, query } from "../lib/database";
import { createUser } from "../lib/server/auth";
import { seedSurvey } from "../lib/surveys/repository";
import { initialSurvey } from "../lib/surveys/initial-survey";

async function prepare() {
  // A clean schema every run keeps the suite deterministic.
  await query(`DROP TABLE IF EXISTS team_sessions, team_users, survey_participants, survey_answers, survey_responses,
    survey_options, survey_questions, surveys, contact_leads, rate_limits, schema_migrations CASCADE`);
  await migrate();
  await seedSurvey(initialSurvey);
  await createUser({
    email: process.env.PC_TEST_ADMIN_EMAIL!,
    name: "Equipo de pruebas",
    password: process.env.PC_TEST_ADMIN_PASSWORD!,
    mustChangePassword: false,
  });
  await closePool();
}

function run(args: string[], label: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", ...args], { stdio: "inherit", windowsHide: true });
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(`${label} falló con código ${code}`)));
  });
}

// The suite runs against a production build: dev-mode compilation on first hit made
// page loads slow enough to trip test timeouts, and a built app matches what Vercel serves.
prepare()
  .then(() => run(["build"], "next build"))
  .then(() => {
    const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3100"], { stdio: "inherit", windowsHide: true });
    for (const signal of ["SIGTERM", "SIGINT"] as const) process.on(signal, () => { child.kill(); process.exit(); });
    child.on("exit", code => process.exit(code ?? 0));
  })
  .catch(error => { console.error(error); process.exit(1); });
