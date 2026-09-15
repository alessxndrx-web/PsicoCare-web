import { randomUUID } from "node:crypto";
import { one, query, transaction } from "../database";
import { CONSENT_VERSION, type Answers, type Survey, type SurveyQuestion } from "./types";
import { surveyIsOpen, validateAnswers } from "./validation";

export async function seedSurvey(survey: Survey) {
  if (await one("SELECT 1 FROM surveys WHERE id = $1", [survey.id])) return;
  await transaction(async client => {
    await client.query(
      "INSERT INTO surveys (id, slug, title, description, status, version, starts_at, ends_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [survey.id, survey.slug, survey.title, survey.description, survey.status, survey.version, survey.startsAt, survey.endsAt]);
    for (const [i, q] of survey.questions.entries()) {
      await client.query("INSERT INTO survey_questions (id, survey_id, position, type, title, description, required, config) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
        [`${survey.id}:${q.id}`, survey.id, i, q.type, q.title, q.description ?? null, q.required, JSON.stringify(q.config)]);
      for (const [j, o] of q.options.entries()) {
        await client.query("INSERT INTO survey_options (id, question_id, label, value, position) VALUES ($1,$2,$3,$4,$5)",
          [`${survey.id}:${o.id}`, `${survey.id}:${q.id}`, o.label, o.value, j]);
      }
    }
  });
}

export async function getSurvey(slug: string): Promise<Survey | null> {
  const row = await one("SELECT * FROM surveys WHERE slug = $1", [slug]);
  if (!row) return null;
  const prefix = `${row.id}:`;
  const questionRows = await query("SELECT * FROM survey_questions WHERE survey_id = $1 ORDER BY position", [row.id]);
  const optionRows = await query("SELECT * FROM survey_options WHERE question_id = ANY($1::text[]) ORDER BY position", [questionRows.map(q => q.id)]);
  const questions = questionRows.map(q => ({
    id: String(q.id).slice(prefix.length), type: q.type as SurveyQuestion["type"], title: String(q.title),
    description: q.description ? String(q.description) : undefined, required: !!q.required,
    config: q.config as SurveyQuestion["config"],
    options: optionRows.filter(o => o.question_id === q.id).map(o => ({ id: String(o.id).slice(prefix.length), label: String(o.label), value: String(o.value) })),
  }));
  return {
    id: String(row.id), slug: String(row.slug), title: String(row.title), description: String(row.description),
    version: Number(row.version), status: row.status as Survey["status"],
    startsAt: row.starts_at ? new Date(row.starts_at as string).toISOString() : null,
    endsAt: row.ends_at ? new Date(row.ends_at as string).toISOString() : null,
    questions,
  };
}

export async function startResponse(survey: Survey, sessionHash: string) {
  if (!surveyIsOpen(survey)) throw new Error("La encuesta no está abierta en este momento.");
  await query("INSERT INTO survey_responses (id, survey_id, session_hash, survey_version, consent_version) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (survey_id, session_hash) DO NOTHING",
    [randomUUID(), survey.id, sessionHash, survey.version, CONSENT_VERSION]);
  return (await readResponse(survey, sessionHash))!;
}
export async function readResponse(survey: Survey, sessionHash: string) {
  const row = await one("SELECT * FROM survey_responses WHERE survey_id = $1 AND session_hash = $2", [survey.id, sessionHash]);
  if (!row) return null;
  const answers: Answers = {};
  for (const a of await query("SELECT question_id, value FROM survey_answers WHERE response_id = $1", [row.id])) {
    answers[String(a.question_id).slice(survey.id.length + 1)] = a.value as Answers[string];
  }
  return { id: String(row.id), answers, completed: !!row.completed_at, version: Number(row.survey_version) };
}
export async function saveResponse(survey: Survey, sessionHash: string, answers: Answers, complete: boolean, version: number) {
  if (!surveyIsOpen(survey)) throw new Error("La encuesta no está abierta en este momento.");
  if (version !== survey.version) throw new Error("La versión de la encuesta cambió. Recarga la página.");
  validateAnswers(survey, answers, complete);
  return transaction(async client => {
    const existing = (await client.query("SELECT id, survey_version, completed_at FROM survey_responses WHERE survey_id = $1 AND session_hash = $2 FOR UPDATE", [survey.id, sessionHash])).rows[0];
    if (!existing || Number(existing.survey_version) !== version) throw new Error("Vuelve a comenzar la encuesta para confirmar tu consentimiento.");
    if (existing.completed_at) return { completed: true };
    await client.query("DELETE FROM survey_answers WHERE response_id = $1", [existing.id]);
    for (const [questionId, value] of Object.entries(answers)) {
      if (value === "" || (Array.isArray(value) && !value.length)) continue;
      await client.query("INSERT INTO survey_answers (response_id, question_id, value) VALUES ($1,$2,$3)", [existing.id, `${survey.id}:${questionId}`, JSON.stringify(value)]);
    }
    await client.query("UPDATE survey_responses SET updated_at = now(), completed_at = $2 WHERE id = $1", [existing.id, complete ? new Date() : null]);
    return { completed: complete };
  });
}
export async function withdrawResponse(survey: Survey, sessionHash: string) {
  await query("DELETE FROM survey_responses WHERE survey_id = $1 AND session_hash = $2", [survey.id, sessionHash]);
}

export async function saveParticipant(responseId: string, email: string, provider: "google" | "manual") {
  if (!(await one("SELECT 1 FROM survey_responses WHERE id = $1", [responseId]))) throw new Error("No encontramos tu participación en este navegador.");
  await query(`INSERT INTO survey_participants (response_id, email, provider, verified, consent_version) VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (response_id) DO UPDATE SET email = EXCLUDED.email, provider = EXCLUDED.provider, verified = EXCLUDED.verified, created_at = now()`,
    [responseId, email, provider, provider === "google", CONSENT_VERSION]);
}
export async function removeParticipant(responseId: string) {
  await query("DELETE FROM survey_participants WHERE response_id = $1", [responseId]);
}
export async function readParticipant(responseId: string) {
  const row = await one("SELECT email, provider, verified FROM survey_participants WHERE response_id = $1", [responseId]);
  return row ? { email: String(row.email), provider: String(row.provider) as "google" | "manual", verified: !!row.verified } : null;
}

export interface AdminAnswer { questionId: string; title: string; type: SurveyQuestion["type"]; display: string[] }
export interface AdminResponse {
  id: string; startedAt: string; completedAt: string | null; version: number;
  email: string | null; verified: boolean; answers: AdminAnswer[];
}
export async function listResponsesForAdmin(survey: Survey, { onlyCompleted = true, limit = 500 } = {}): Promise<AdminResponse[]> {
  const labels = new Map(survey.questions.flatMap(q => q.options.map(o => [o.id, o.label] as const)));
  const rows = await query(
    `SELECT r.id, r.started_at, r.completed_at, r.survey_version, p.email, p.verified
     FROM survey_responses r LEFT JOIN survey_participants p ON p.response_id = r.id
     WHERE r.survey_id = $1 ${onlyCompleted ? "AND r.completed_at IS NOT NULL" : ""}
     ORDER BY COALESCE(r.completed_at, r.updated_at) DESC LIMIT $2`, [survey.id, limit]);
  if (!rows.length) return [];
  const answerRows = await query("SELECT response_id, question_id, value FROM survey_answers WHERE response_id = ANY($1::uuid[])", [rows.map(r => r.id)]);
  return rows.map(row => {
    const stored = new Map(answerRows.filter(a => a.response_id === row.id)
      .map(a => [String(a.question_id).slice(survey.id.length + 1), a.value] as const));
    const answers = survey.questions.map(q => {
      const value = stored.get(q.id);
      const display = value === undefined ? []
        : Array.isArray(value) ? value.map(v => labels.get(v) ?? v)
        : typeof value === "number" ? [String(value)]
        : [labels.get(value) ?? value];
      return { questionId: q.id, title: q.title, type: q.type, display };
    });
    return {
      id: String(row.id), startedAt: new Date(row.started_at as string).toISOString(),
      completedAt: row.completed_at ? new Date(row.completed_at as string).toISOString() : null,
      version: Number(row.survey_version), email: row.email ? String(row.email) : null, verified: !!row.verified, answers,
    };
  });
}
