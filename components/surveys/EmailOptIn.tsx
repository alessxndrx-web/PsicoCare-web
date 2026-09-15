"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { CONSENT_VERSION } from "@/lib/surveys/types";

export interface Participant { email: string; verified: boolean }
const NOTICES: Record<string, string> = {
  ok: "Listo. Guardamos el correo de tu cuenta de Google.",
  cancelado: "No se completó el inicio de sesión con Google. Puedes escribir tu correo a mano.",
  "sin-verificar": "Esa cuenta de Google no tiene el correo verificado. Prueba con otra o escríbelo a mano.",
  "sin-sesion": "No encontramos tu participación en este navegador.",
  "no-disponible": "El acceso con Google no está disponible ahora. Puedes escribir tu correo a mano.",
  error: "No pudimos completar el acceso con Google. Inténtalo de nuevo.",
};
export function EmailOptIn({ slug, googleEnabled, participant, notice, onChange }: {
  slug: string; googleEnabled: boolean; participant: Participant | null; notice?: string;
  onChange: (participant: Participant | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const endpoint = `/api/surveys/${encodeURIComponent(slug)}/email`;

  if (participant) return <div className="email-optin is-set">
    <div className="email-optin-head"><Icon name="check" size={20}/><div><h3>Dejaste tu correo para recibir novedades.</h3>
      <p>{participant.email} {participant.verified && <span className="email-verified">verificado con Google</span>}</p></div></div>
    <button className="survey-delete" disabled={busy} onClick={async () => {
      setBusy(true); setError("");
      try {
        const response = await fetch(endpoint, { method: "DELETE", headers: { "Content-Type": "application/json" } });
        if (!response.ok) throw new Error((await response.json()).error);
        onChange(null); setConsent(false); setEmail("");
      } catch (error) { setError(error instanceof Error ? error.message : "No pudimos quitar tu correo."); }
      finally { setBusy(false); }
    }}>Quitar mi correo</button>
    {error && <p className="form-error" role="alert">{error}</p>}
  </div>;

  return <div className="email-optin">
    {notice && NOTICES[notice] && <p className="email-notice" role="status">{NOTICES[notice]}</p>}
    {!open ? <button className="email-optin-trigger" onClick={() => setOpen(true)}>
      <Icon name="mail" size={20}/><span><strong>¿Quieres enterarte cuando Psico Care esté disponible?</strong>Deja tu correo. Es opcional y puedes quitarlo después.</span><Icon name="arrow" size={17}/>
    </button> : <>
      <h3>Déjanos tu correo (opcional)</h3>
      <p>Lo usaremos solo para avisarte sobre el avance de Psico Care. Se guarda por separado de tus respuestas y no lo compartimos con nadie. <Link href="/privacidad" className="text-action">Cómo tratamos tus datos.</Link></p>
      {googleEnabled && <><a className="button button-google" href="/api/auth/google"><GoogleMark/>Continuar con Google</a>
        <p className="survey-status-note">Solo leemos la dirección de correo de tu cuenta. No accedemos a tu Gmail, tus contactos ni ningún otro dato.</p>
        <div className="email-divider"><span>o escríbelo a mano</span></div></>}
      <form onSubmit={async event => {
        event.preventDefault(); setError("");
        if (!consent) { setError("Confirma que quieres dejarnos tu correo."); return; }
        setBusy(true);
        try {
          const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, consent: true, consentVersion: CONSENT_VERSION, website: "" }) });
          const data = await response.json(); if (!response.ok) throw new Error(data.error);
          onChange({ email: data.email, verified: data.verified });
        } catch (error) { setError(error instanceof Error ? error.message : "No pudimos guardar tu correo."); }
        finally { setBusy(false); }
      }}>
        <label>Correo electrónico<input type="email" value={email} required maxLength={200} autoComplete="email" onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="tucorreo@ejemplo.com"/></label>
        <label className="checkbox-label"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/><span>Autorizo a Psico Care a guardar mi correo para avisarme sobre el proyecto. Puedo pedir que lo borren cuando quiera.</span></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="survey-navigation"><button type="button" disabled={busy} onClick={() => { setOpen(false); setError(""); }}>Ahora no</button><button className="button button-primary" disabled={busy}>{busy ? "Guardando…" : "Guardar mi correo"}<Icon name="arrow" size={17}/></button></div>
      </form>
    </>}
  </div>;
}
function GoogleMark() {
  return <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18Z"/><path fill="#FBBC05" d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34Z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58Z"/></svg>;
}
