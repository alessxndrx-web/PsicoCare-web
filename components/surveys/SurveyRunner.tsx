"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Primitives";
import { ADULT_VALUES, CONSENT_VERSION, type Answers, type Survey } from "@/lib/surveys/types";
import { questionError } from "@/lib/surveys/validation";
import { QuestionField } from "./QuestionField";
import { EmailOptIn, type Participant } from "./EmailOptIn";
type Stage = "loading" | "unavailable" | "intro" | "questions" | "review" | "success" | "minor";
export function SurveyRunner({ slug, googleEnabled, notice }: { slug: string; googleEnabled: boolean; notice?: string }) {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [consent, setConsent] = useState(false);
  const [adult, setAdult] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [reload, setReload] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const endpoint = "/api/surveys/" + encodeURIComponent(slug);
  useEffect(() => {
    const controller = new AbortController();
    fetch(endpoint, { signal: controller.signal, cache: "no-store" }).then(async response => {
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setSurvey(data.survey);
      setParticipant(data.participant ?? null);
      if (data.response?.completed) { setStage("success"); return; }
      if (data.response) {
        setAnswers(data.response.answers);
        const next = (data.survey as Survey).questions.findIndex(q => data.response.answers[q.id] === undefined);
        setIndex(next < 0 ? 0 : next); setConsent(true); setAdult(true);
        setSaved("Encontramos tus respuestas guardadas en este navegador.");
      }
      setStage("intro");
    }).catch(error => { if (error.name !== "AbortError") { setError(error.message || "No pudimos cargar la encuesta."); setStage("unavailable"); } });
    return () => controller.abort();
  }, [endpoint, reload]);
  useEffect(() => {
    if (stage !== "loading" && stage !== "intro") {
      panel.current?.scrollIntoView({ block: "start", behavior: "instant" });
      panel.current?.focus({ preventScroll: true });
    }
  }, [stage, index]);
  async function request(method: string, body?: unknown) {
    const response = await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || "No pudimos guardar. Vuelve a intentarlo.");
    return data;
  }
  async function persist(complete: boolean) {
    const data = await request("PUT", { answers, version: survey!.version, complete });
    setSaved(complete ? "Respuestas enviadas." : "Progreso guardado.");
    return data;
  }
  async function move(next: number, validate: boolean) {
    if (busy || !survey) return;
    setError("");
    const q = survey.questions[index];
    if (validate) {
      const invalid = questionError(q, answers[q.id]); if (invalid) { setError(invalid); return; }
    }
    if (q.id === "age" && answers.age) {
      const option = q.options.find(o => o.id === answers.age);
      if (option && !ADULT_VALUES.includes(option.value)) {
        setBusy(true);
        try { await request("DELETE"); setAnswers({}); setStage("minor"); }
        catch (error) { setError(error instanceof Error ? error.message : "No se pudo cerrar la participación."); }
        finally { setBusy(false); }
        return;
      }
    }
    setBusy(true);
    try { const data = await persist(false); if (data.completed) setStage("success"); else if (next >= survey.questions.length) setStage("review"); else setIndex(next); }
    catch (error) { setError(error instanceof Error ? error.message : "No pudimos guardar tus respuestas."); }
    finally { setBusy(false); }
  }
  if (stage === "loading") return <div className="survey-card" role="status"><h2>Preparando tu espacio…</h2><p>Cargando la encuesta de PsicoCare.</p></div>;
  if (stage === "unavailable" || !survey) return <div className="survey-card"><h2>La encuesta no está disponible ahora.</h2><p role="alert">{error}</p><button className="button button-primary" onClick={() => { setError(""); setStage("loading"); setReload(r => r + 1); }}>Volver a intentar</button><p>Puedes seguir explorando <Link href="/#app-movil" className="text-action">la demo de PsicoCare</Link>.</p></div>;
  const question = survey.questions[index];
  return <div className="survey-card" ref={panel} tabIndex={-1} aria-busy={busy}>
    {stage === "intro" && <><h2>Antes de comenzar, tú decides.</h2><p>Esta investigación nos ayuda a priorizar funciones y mejorar PsicoCare. No es una evaluación de tu salud.</p>
      <ul className="survey-consent-list">
        <li><Icon name="survey" size={20}/><span>Guardamos tus respuestas para analizar preferencias sobre el producto. Solo el equipo autorizado tiene acceso.</span></li>
        <li><Icon name="lock" size={20}/><span>Las preguntas no piden tu nombre ni diagnósticos. Usamos un identificador aleatorio del navegador para recuperar el progreso y evitar duplicados. Al terminar podrás dejar tu correo si quieres: es opcional, se guarda aparte de tus respuestas y puedes quitarlo después.</span></li>
        <li><Icon name="heart" size={20}/><span>Participar es voluntario. Puedes salir cuando quieras o retirar tu participación desde este navegador. No incluyas información personal en las respuestas abiertas.</span></li>
      </ul>
      <p>Los borradores se conservan hasta 7 días sin actividad y las respuestas enviadas hasta 180 días. <Link href="/privacidad" className="text-action">Conoce el uso de tus datos.</Link></p>
      <label className="checkbox-label"><input type="checkbox" checked={adult} onChange={e => setAdult(e.target.checked)}/><span>Confirmo que tengo 18 años o más. Esta primera investigación está dirigida a personas adultas.</span></label>
      <label className="checkbox-label"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/><span>He leído esta información y acepto participar voluntariamente, incluido el guardado de mis respuestas al avanzar.</span></label>
      {saved && <p role="status">{saved}</p>}{error && <p role="alert" className="form-error">{error}</p>}
      <button className="button button-primary" disabled={busy} onClick={async () => {
        setError(""); if (!adult || !consent) { setError("Confirma tu edad y el consentimiento para comenzar."); return; } setBusy(true);
        try { const data = await request("POST", { consent, adult, consentVersion: CONSENT_VERSION, website: "" }); setAnswers(data.answers); setStage(data.completed ? "success" : "questions"); }
        catch (error) { setError(error instanceof Error ? error.message : "No pudimos iniciar la encuesta."); } finally { setBusy(false); }
      }}>{busy ? "Preparando…" : Object.keys(answers).length ? "Continuar mi encuesta" : "Comenzar encuesta"}<Icon name="arrow" size={17}/></button>
      <p className="survey-status-note">2–3 minutos · 14 preguntas · Sin registro</p>
    </>}
    {stage === "questions" && <><div className="survey-progress-top"><span>Pregunta {index + 1} de {survey.questions.length}</span><span>{Math.round(index / survey.questions.length * 100)} % del recorrido</span></div>
      <div className="survey-progress" role="progressbar" aria-label="Progreso de la encuesta" aria-valuemin={0} aria-valuemax={survey.questions.length} aria-valuenow={index}><span style={{ width: index / survey.questions.length * 100 + "%" }}/></div>
      <form onSubmit={event => { event.preventDefault(); void move(index + 1, true); }}><QuestionField key={question.id} question={question} value={answers[question.id]} onChange={value => { setAnswers(a => ({ ...a, [question.id]: value })); setSaved("Cambios pendientes de guardar."); setError(""); }} error={error}/>
      <div className="survey-navigation"><button type="button" disabled={busy || index === 0} onClick={() => void move(index - 1, false)}><Icon name="back" size={17}/>Anterior</button><button className="button button-primary" disabled={busy}>{busy ? "Guardando…" : index === survey.questions.length - 1 ? "Revisar respuestas" : !question.required && !answers[question.id] ? "Omitir y continuar" : "Siguiente"}<Icon name="arrow" size={17}/></button></div></form>
      <p className="survey-status-note" role="status">{saved || "Tus respuestas se guardan al avanzar o volver."}</p>
    </>}
    {stage === "review" && <><div className="eyebrow">Un último paso</div><h2>Revisa lo que nos quieres compartir.</h2><p>Al enviar, aceptas que el equipo utilice estas respuestas para mejorar el producto, según el consentimiento que leíste al comenzar.</p><ul className="survey-review">{survey.questions.map((q, i) => {
      const answer = answers[q.id];
      const value = Array.isArray(answer) ? answer.map(v => q.options.find(o => o.id === v)?.label ?? v).join(", ") : q.options.find(o => o.id === answer)?.label ?? answer ?? "Sin respuesta";
      return <li key={q.id}><div><strong>{q.title}</strong><p>{value === "" ? "Sin respuesta" : value}</p></div><button disabled={busy} onClick={() => { setIndex(i); setStage("questions"); }} aria-label={"Editar respuesta: " + q.title}>Editar</button></li>;
    })}</ul>{error && <p className="form-error" role="alert">{error}</p>}<div className="survey-navigation"><button disabled={busy} onClick={() => { setIndex(survey.questions.length - 1); setStage("questions"); }}>Volver</button><button className="button button-primary" disabled={busy} onClick={async () => {
      setBusy(true); setError(""); try { await persist(true); setStage("success"); setAnswers({}); }
      catch (error) { setError(error instanceof Error ? error.message : "No pudimos enviar tus respuestas."); } finally { setBusy(false); }
    }}>{busy ? "Enviando…" : "Enviar mis respuestas"}<Icon name="check" size={17}/></button></div></>}
    {stage === "success" && <div className="survey-success"><Image src="/brand/mascot-calm.webp" width={145} height={216} alt="El personaje tranquilo de PsicoCare agradece tu participación"/><h2>{deleted ? "Tu participación fue retirada." : "Gracias por ayudarnos a construir PsicoCare."}</h2><p role="status">{deleted ? "Se eliminaron las respuestas asociadas a este navegador." : "Tus respuestas quedaron guardadas. Nos ayudarán a construir herramientas que tengan sentido para quienes las usarán."}</p>{!deleted && <EmailOptIn slug={slug} googleEnabled={googleEnabled} participant={participant} notice={notice} onChange={setParticipant}/>}<div className="button-row"><ButtonLink href="/#app-movil">Volver a explorar la app</ButtonLink></div></div>}
    {stage === "minor" && <div className="survey-success"><h2>Gracias por tu interés.</h2><p>Por ahora, esta investigación solo está abierta a mayores de 18 años. Eliminamos el inicio de tu participación y no guardamos tus respuestas.</p><ButtonLink href="/#app-movil">Explorar la demo</ButtonLink></div>}
    {["questions", "review", "success"].includes(stage) && !deleted && <div style={{ textAlign: "center" }}>{deleteConfirm ? <><p className="survey-status-note">¿Quieres eliminar esta participación? Se borrarán las respuestas guardadas.</p><div className="button-row" style={{ justifyContent: "center", marginTop: 12 }}><button className="button button-ghost" disabled={busy} onClick={() => setDeleteConfirm(false)}>Conservar</button><button className="button button-primary" disabled={busy} onClick={async () => {
      setBusy(true); setError(""); try { await request("DELETE"); setDeleted(true); setDeleteConfirm(false); setAnswers({}); setParticipant(null); setStage("success"); } catch (error) { setError(error instanceof Error ? error.message : "No se pudo retirar la participación."); } finally { setBusy(false); }
    }}>Eliminar mi participación</button></div></> : <button className="survey-delete" onClick={() => setDeleteConfirm(true)}>Retirar mi participación y borrar respuestas</button>}{stage === "success" && error && <p role="alert" className="form-error">{error}</p>}</div>}
  </div>;
}
