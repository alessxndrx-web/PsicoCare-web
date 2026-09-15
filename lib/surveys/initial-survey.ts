import { SURVEY_SLUG, type Survey, type SurveyQuestion } from "./types";

function choice(id: string, title: string, labels: string[], multiple = false, values?: string[]): SurveyQuestion {
  return { id, title, type: multiple ? "multiple" : "single", required: true, config: {},
    options: labels.map((label, i) => ({ id: `${id}-${i + 1}`, value: values?.[i] ?? `${i + 1}`, label })) };
}
function scale(id: string, title: string, max: 5 | 10, lowLabel: string, highLabel: string): SurveyQuestion {
  return { id, title, type: max === 5 ? "score5" : "score10", required: true, options: [], config: { min: max === 5 ? 1 : 0, max, lowLabel, highLabel } };
}
export const initialSurvey: Survey = {
  id: "product-validation-v1", slug: SURVEY_SLUG, version: 1, status: "active", startsAt: null, endsAt: null,
  title: "Tu opinión puede ayudarnos a construir un mejor PsicoCare",
  description: "Queremos entender qué herramientas realmente serían útiles para jóvenes. La encuesta toma aproximadamente 2–3 minutos.",
  questions: [
    choice("age", "¿Qué edad tienes?", ["Menos de 15", "15–17", "18–20", "21–24", "25 o más", "Prefiero no responder"], false, ["under-15", "15-17", ...["18-20", "21-24", "25-plus", "prefer-not"]]),
    choice("previous-use", "Antes de conocer PsicoCare, ¿habías utilizado alguna herramienta digital de bienestar emocional?", ["Sí, frecuentemente", "Sí, algunas veces", "La he probado una vez", "No"]),
    scale("willingness", "¿Qué tan dispuesto/a estarías a utilizar una aplicación como PsicoCare?", 5, "Nada dispuesto/a", "Muy dispuesto/a"),
    choice("frequency", "¿Con qué frecuencia crees que utilizarías PsicoCare?", ["Todos los días", "Varias veces por semana", "Una vez por semana", "Algunas veces al mes", "Solo cuando lo necesitara", "Probablemente no la usaría"]),
    choice("features", "¿Qué funciones te parecen más valiosas?", ["Conversaciones guiadas", "Diario emocional / reflexiones", "Simulaciones sociales", "Preparación para conversaciones difíciles", "Exposición gradual", "Ejercicios de respiración y relajación", "Seguimiento de progreso", "Recursos de bienestar", "Conexión con profesionales", "Otro"], true),
    choice("situations", "¿En qué situaciones crees que usarías PsicoCare?", ["Estrés académico", "Antes de una entrevista", "Situaciones sociales", "Preparar una conversación difícil", "Reflexionar sobre cómo me siento", "Practicar cómo responder", "Organizar mis pensamientos", "Ejercicios de relajación", "Buscar orientación sobre el siguiente paso", "Otro"], true),
    scale("ai-comfort", "¿Qué tan cómodo/a te sentirías conversando con una herramienta de IA sobre cómo te sientes?", 5, "Nada cómodo/a", "Muy cómodo/a"),
    scale("ai-limits", "¿Qué tan importante sería para ti saber claramente qué puede y qué no puede hacer la IA?", 5, "Poco importante", "Muy importante"),
    scale("human-help", "¿Qué tan importante sería poder encontrar ayuda humana cuando la situación lo requiera?", 5, "Poco importante", "Muy importante"),
    choice("concern", "¿Qué aspecto te generaría mayor preocupación al utilizar PsicoCare?", ["Privacidad de mis datos", "Que la IA entienda mal lo que digo", "No saber quién revisa el contenido", "Que sustituya la ayuda profesional", "No saber cómo funciona", "No me genera preocupación", "Otro"]),
    scale("try-score", "Después de conocer la propuesta, ¿qué tan probable sería que probaras PsicoCare?", 10, "Nada probable", "Muy probable"),
    scale("recommendation", "Si PsicoCare estuviera disponible hoy, ¿qué tan probable sería que la recomendaras a alguien de tu edad?", 10, "Nada probable", "Muy probable"),
    { id: "must-have", title: "¿Qué tendría que ofrecer PsicoCare para que realmente quisieras utilizarla?", type: "text", required: false, description: "Comparte ideas sobre el producto. Evita nombres, datos de contacto, diagnósticos o experiencias personales sensibles.", config: { maxLength: 500 }, options: [] },
    { id: "improvements", title: "¿Qué mejorarías o cambiarías de la idea?", type: "text", required: false, description: "Tu respuesta es opcional. No incluyas información personal o de salud.", config: { maxLength: 500 }, options: [] },
  ],
};
