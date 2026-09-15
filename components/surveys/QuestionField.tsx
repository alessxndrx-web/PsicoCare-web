"use client";
import { useId } from "react";
import type { AnswerValue, SurveyQuestion } from "@/lib/surveys/types";
export function QuestionField({ question, value, onChange, error }: { question: SurveyQuestion; value: AnswerValue | undefined; onChange: (value: AnswerValue) => void; error?: string }) {
  const id = useId();
  const isScale = ["likert", "score5", "score10"].includes(question.type);
  const min = question.config.min ?? (question.type === "score10" ? 0 : 1);
  const max = question.config.max ?? (question.type === "score10" ? 10 : 5);
  const options = question.type === "yesno" && !question.options.length ? [{ id: "yes", value: "yes", label: "Sí" }, { id: "no", value: "no", label: "No" }] : question.options;
  return <fieldset className="question-fieldset" aria-describedby={id + "-description"} aria-invalid={!!error}>
    <legend id={id + "-title"}>{question.title}</legend>
    <p className="question-description" id={id + "-description"}>{question.description ?? (question.type === "multiple" ? "Puedes elegir varias opciones." : question.required ? "Elige una respuesta." : "Respuesta opcional.")}</p>
    {question.type === "text" ? <><textarea aria-labelledby={id + "-title"} value={typeof value === "string" ? value : ""} maxLength={question.config.maxLength ?? 500} rows={5} onChange={e => onChange(e.target.value)} placeholder="Tu idea para mejorar Psico Care…"/><p className="question-description" style={{ marginTop: 10 }}>{typeof value === "string" ? value.length : 0} / {question.config.maxLength ?? 500} caracteres · Opcional</p></> :
    isScale ? <><div className={"question-scale " + (max === 10 ? "scale-ten" : "")}>{Array.from({ length: max - min + 1 }, (_, i) => min + i).map(n => <label key={n}><input type="radio" name={id} value={n} checked={value === n} onChange={() => onChange(n)} aria-label={String(n)}/><span>{n}</span></label>)}</div><div className="scale-labels"><span>{min} · {question.config.lowLabel}</span><span>{max} · {question.config.highLabel}</span></div></> :
    <div className="question-options">{options.map(option => <label className="question-option" key={option.id}><input type={question.type === "multiple" ? "checkbox" : "radio"} name={id} value={option.id} checked={Array.isArray(value) ? value.includes(option.id) : value === option.id} onChange={() => {
      if (question.type !== "multiple") return onChange(option.id);
      const selected = Array.isArray(value) ? value : [];
      onChange(selected.includes(option.id) ? selected.filter(v => v !== option.id) : [...selected, option.id]);
    }}/><span>{option.label}</span></label>)}</div>}
    {error && <p className="form-error" role="alert">{error}</p>}
  </fieldset>;
}
