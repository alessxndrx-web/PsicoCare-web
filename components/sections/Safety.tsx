import { ButtonLink, Container, SectionHeading } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
export function Safety() {
  return <section className="safety-section section-space" id="seguridad"><Container><div className="safety-layout">
    <div><span className="safety-symbol"><Icon name="shield" size={52}/></span><SectionHeading eyebrow="Tu confianza, primero" title={<>Tecnología con <br/>límites claros.</>}>Acompañar también significa reconocer hasta dónde llegar. Ese principio está en el centro de PsicoCare.</SectionHeading><ButtonLink href="/seguridad" variant="ghost">Conocer nuestro compromiso</ButtonLink></div>
    <div className="safety-principles">{[
      ["lock", "Privacidad y consentimiento", "La encuesta no pide tu nombre. Tú eliges participar, y el correo opcional del final se guarda aparte de tus respuestas."],
      ["shield", "Sin diagnósticos", "PsicoCare no diagnostica ni sustituye la atención de profesionales de salud mental."],
      ["heart", "El siguiente paso puede ser humano", "La demo orienta a considerar apoyo humano. La red de profesionales sigue en desarrollo."],
      ["chat", "Claridad sobre la experiencia", "Sabes cuándo estás viendo un ejemplo y qué funciones ya puedes utilizar en esta web."],
    ].map(([icon, title, text]) => <article key={title}><Icon name={icon} size={24}/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
  </div></Container></section>;
}
