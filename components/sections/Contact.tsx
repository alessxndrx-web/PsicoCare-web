"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_INTERESTS, CONTACT_SIZES, CONTACT_TYPES, site } from "@/lib/content";
export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [error, setError] = useState("");
  const requestId = useRef("");
  return <section className="contact-section section-space" id="contacto"><Container><div className="contact-layout">
    <div><SectionHeading eyebrow="Hablemos" title={<>Un buen siguiente paso <br/>puede ser una conversación.</>}>¿Representas a una universidad, un colegio, un instituto o una organización que trabaja con juventud? Cuéntanos tu contexto y coordinamos una primera conversación.</SectionHeading>
      <ul className="contact-direct"><li><Icon name="mail" size={18}/><a href={`mailto:${site.email}`}>{site.email}</a></li><li><Icon name="check" size={18}/><a href={`tel:${site.phoneHref}`}>{site.phone}</a></li></ul>
      <div className="contact-note"><Icon name="mail"/><p>Tu mensaje llegará al buzón interno del equipo. Tus datos de contacto se mantienen separados de las encuestas.</p></div></div>
    {status === "success" ? <div className="contact-success" role="status"><Icon name="check" size={40}/><h3>Gracias por acercarte.</h3><p>Tu mensaje quedó guardado en el buzón de PsicoCare para que el equipo pueda revisarlo.</p><button className="text-action" onClick={() => { setStatus("idle"); requestId.current = ""; }}>Escribir otro mensaje<Icon name="arrow" size={17}/></button></div> :
    <form className="contact-form" onSubmit={async event => {
      event.preventDefault(); setError(""); setStatus("sending");
      const form = new FormData(event.currentTarget);
      if (!requestId.current) requestId.current = crypto.randomUUID();
      try {
        const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), organization: form.get("organization"), role: form.get("role"), audience: form.get("audience"), communitySize: form.get("communitySize"), interest: form.get("interest"), message: form.get("message"), consent: form.get("consent") === "on", website: form.get("website"), requestId: requestId.current }) });
        const data = await response.json(); if (!response.ok) throw new Error(data.error); setStatus("success");
      } catch (error) { setError(error instanceof Error ? error.message : "No pudimos guardar el mensaje. Inténtalo de nuevo."); setStatus("idle"); }
    }}>
      <div className="form-row"><label>Tu nombre<input name="name" required minLength={2} maxLength={100} autoComplete="name"/></label><label>Correo institucional<input name="email" required type="email" maxLength={200} autoComplete="email"/></label></div>
      <div className="form-row"><label>Institución <span>(opcional)</span><input name="organization" maxLength={160} autoComplete="organization"/></label><label>Cargo o rol <span>(opcional)</span><input name="role" maxLength={120} autoComplete="organization-title"/></label></div>
      <div className="form-row"><label>Tipo de institución<select name="audience" defaultValue="Universidad">{CONTACT_TYPES.map(type => <option key={type}>{type}</option>)}</select></label><label>Tamaño de la comunidad<select name="communitySize" defaultValue="No aplica">{CONTACT_SIZES.map(size => <option key={size}>{size}</option>)}</select></label></div>
      <label>Me interesa<select name="interest" defaultValue="Piloto">{CONTACT_INTERESTS.map(interest => <option key={interest}>{interest}</option>)}</select></label>
      <label>¿Cómo te gustaría participar?<textarea name="message" required minLength={10} maxLength={2000} rows={4} placeholder="Cuéntanos sobre tu institución y tu interés en PsicoCare. Evita incluir información de salud personal."/></label>
      <div className="honeypot" aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label className="checkbox-label"><input type="checkbox" name="consent" required/><span>Autorizo al equipo a usar estos datos para responder a mi consulta. He leído la <Link href="/privacidad">información de privacidad</Link>.</span></label>
      {error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" disabled={status === "sending"}>{status === "sending" ? "Guardando mensaje…" : "Enviar mensaje"}<Icon name="arrow" size={17}/></button>
    </form>}
  </div></Container></section>;
}
