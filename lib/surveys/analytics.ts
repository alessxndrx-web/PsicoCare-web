import { one, query } from "../database";
import type { Survey } from "./types";

export async function surveyAnalytics(survey: Survey) {
  const totals = await one<{ total: string; completed: string }>(
    "SELECT COUNT(*)::text AS total, COUNT(completed_at)::text AS completed FROM survey_responses WHERE survey_id = $1", [survey.id]);
  const total = Number(totals?.total ?? 0); const completed = Number(totals?.completed ?? 0);
  const rows = await query("SELECT a.question_id, a.value FROM survey_answers a JOIN survey_responses r ON r.id = a.response_id WHERE r.survey_id = $1 AND r.completed_at IS NOT NULL", [survey.id]);
  const byQuestion = new Map<string, unknown[]>();
  for (const row of rows) {
    const id = String(row.question_id).slice(survey.id.length + 1);
    byQuestion.set(id, [...(byQuestion.get(id) ?? []), row.value]);
  }
  /** Averages stay hidden until five complete responses exist, so no individual is inferable. */
  function average(id: string) {
    const values = (byQuestion.get(id) ?? []).filter((n): n is number => typeof n === "number");
    return values.length >= 5 ? values.reduce((a, b) => a + b, 0) / values.length : null;
  }
  const distributions = completed >= 5 ? survey.questions.filter(q => q.type !== "text" && q.id !== "age").map(q => {
    const values = (byQuestion.get(q.id) ?? []).flat();
    const counts = new Map<string, number>();
    values.forEach(v => counts.set(String(v), (counts.get(String(v)) ?? 0) + 1));
    const options = q.options.length ? q.options : Array.from({ length: (q.config.max ?? 5) - (q.config.min ?? 1) + 1 }, (_, i) => ({ id: String(i + (q.config.min ?? 1)), label: String(i + (q.config.min ?? 1)) }));
    return { id: q.id, title: q.title, items: options.map(o => ({ label: o.label, count: counts.get(o.id) ?? 0 })), count: (byQuestion.get(q.id) ?? []).length };
  }) : [];
  const trend = completed >= 5
    ? (await query("SELECT to_char(completed_at, 'YYYY-MM-DD') AS day, COUNT(*)::text AS count FROM survey_responses WHERE survey_id = $1 AND completed_at IS NOT NULL GROUP BY day ORDER BY day DESC LIMIT 30", [survey.id]))
        .reverse().map(r => ({ label: String(r.day), count: Number(r.count) }))
    : [];
  return {
    total, completed, completionRate: total ? completed / total * 100 : 0,
    willingness: average("willingness"), recommendation: average("recommendation"),
    distributions, trend,
    openTextCount: rows.filter(r => ["must-have", "improvements"].some(id => String(r.question_id).endsWith(":" + id))).length,
  };
}
