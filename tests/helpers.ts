import { closePool, migrate, query } from "../lib/database";
import { seedSurvey } from "../lib/surveys/repository";
import { initialSurvey } from "../lib/surveys/initial-survey";

/** Tests run against a real Postgres. Point TEST_DATABASE_URL at a throwaway database. */
export function configureTestDatabase() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("Define TEST_DATABASE_URL para ejecutar las pruebas (base de datos desechable).");
  process.env.DATABASE_URL = url;
}
export async function resetDatabase() {
  configureTestDatabase();
  await query(`DROP TABLE IF EXISTS team_sessions, team_users, survey_participants, survey_answers, survey_responses,
    survey_options, survey_questions, surveys, contact_leads, rate_limits, schema_migrations CASCADE`);
  await migrate();
  await seedSurvey(initialSurvey);
}
export async function teardown() { await closePool(); }
