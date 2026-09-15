import { z } from "zod";
import { ADULT_VALUES, CONSENT_VERSION, type Answers, type Survey, type SurveyQuestion } from "./types";

export const startSchema = z.object({ consent: z.literal(true), adult: z.literal(true), consentVersion: z.literal(CONSENT_VERSION), website: z.string().max(0).optional() }).strict();
export const saveSchema = z.object({ version: z.number().int().positive(), complete: z.boolean(), answers: z.record(z.string().max(80), z.union([z.string().max(500), z.number().finite(), z.array(z.string().max(80)).max(20)])) }).strict();

export function questionError(question: SurveyQuestion, value: unknown, required = true): string | null {
  const empty = value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
  if (empty) return required && question.required ? "Selecciona una respuesta para continuar." : null;
  if (question.type === "text") return typeof value === "string" && value.length <= (question.config.maxLength ?? 500) ? null : "Escribe un máximo de 500 caracteres.";
  if (["score5", "score10", "likert"].includes(question.type)) {
    const min = question.config.min ?? (question.type === "score10" ? 0 : 1);
    const max = question.config.max ?? (question.type === "score10" ? 10 : 5);
    return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max ? null : "Selecciona un valor de la escala.";
  }
  const allowed = new Set(question.options.map(o => o.id));
  if (question.type === "yesno" && !allowed.size) { allowed.add("yes"); allowed.add("no"); }
  if (question.type === "multiple") return Array.isArray(value) && value.length <= allowed.size && new Set(value).size === value.length && value.every(v => typeof v === "string" && allowed.has(v)) ? null : "Revisa las opciones seleccionadas.";
  return typeof value === "string" && allowed.has(value) ? null : "Selecciona una opción válida.";
}
export function validateAnswers(survey: Survey, answers: Answers, complete: boolean) {
  const known = new Set(survey.questions.map(q => q.id));
  if (Object.keys(answers).some(id => !known.has(id))) throw new Error("La respuesta contiene preguntas desconocidas.");
  for (const q of survey.questions) {
    const error = questionError(q, answers[q.id], complete);
    if (error) throw new Error(`${q.title} ${error}`);
  }
  const age = survey.questions.find(q => q.id === "age");
  if (age && answers.age) {
    const selected = age.options.find(o => o.id === answers.age);
    if (!selected || !ADULT_VALUES.includes(selected.value)) throw new Error("Esta primera investigación solo admite participantes de 18 años o más.");
  }
}
export function surveyIsOpen(survey: Survey, now = Date.now()) {
  return survey.status === "active" && (!survey.startsAt || Date.parse(survey.startsAt) <= now) && (!survey.endsAt || Date.parse(survey.endsAt) > now);
}
