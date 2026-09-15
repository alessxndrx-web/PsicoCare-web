export type QuestionType = "single" | "multiple" | "likert" | "score10" | "score5" | "yesno" | "text";
export type AnswerValue = string | string[] | number;
export type Answers = Record<string, AnswerValue>;
export interface SurveyOption { id: string; label: string; value: string; }
export interface SurveyQuestion {
  id: string; type: QuestionType; title: string; description?: string;
  required: boolean; options: SurveyOption[];
  config: { min?: number; max?: number; lowLabel?: string; highLabel?: string; maxLength?: number };
}
export interface Survey {
  id: string; slug: string; title: string; description: string; version: number;
  status: "draft" | "active" | "closed"; startsAt: string | null; endsAt: string | null;
  questions: SurveyQuestion[];
}
export const CONSENT_VERSION = "producto-2026-09-v1";
export const SURVEY_SLUG = "construyamos-psicocare";
export const ADULT_VALUES = ["18-20", "21-24", "25-plus", "prefer-not"];
