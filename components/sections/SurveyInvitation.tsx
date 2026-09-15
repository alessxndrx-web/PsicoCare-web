import Image from "next/image";
import { ButtonLink, Container, Eyebrow } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
export function SurveyInvitation() {
  return <section className="survey-invitation section-space" id="encuestas"><Container><div className="survey-invitation-card">
    <div><Eyebrow>Lo construimos contigo</Eyebrow><h2>Tu opinión construye <br/>un mejor Psico Care.</h2><p>Las mejores herramientas empiezan por escuchar. Cuéntanos qué te sería útil y ayúdanos a decidir qué construir primero.</p>
    <div className="button-row"><ButtonLink href="/encuestas" variant="light">Responder encuesta</ButtonLink><span className="survey-time"><Icon name="clock" size={17}/>2–3 minutos</span></div>
    <p className="survey-privacy-note"><Icon name="lock" size={15}/>Voluntaria · Sin nombre · Correo opcional al final · Para mayores de 18</p></div>
    <div className="survey-illustration"><div className="survey-mini-card"><span>TE ESCUCHAMOS</span><p>¿Qué te gustaría <br/>encontrar aquí?</p><div><span>Conversar</span><span>Reflexionar</span><span>Practicar</span></div></div><Image src="/brand/mascots-together.webp" width={360} height={215} alt="Los personajes de Psico Care se dan la mano para construir juntos"/></div>
  </div><div className="research-strip"><span>Escuchamos tus ideas</span><i aria-hidden="true">→</i><span>Validamos lo que importa</span><i aria-hidden="true">→</i><span>Mejoramos el producto</span></div></Container></section>;
}
