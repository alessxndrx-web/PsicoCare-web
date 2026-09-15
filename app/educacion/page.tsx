import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import {
  advancedLayer, collaborationTracks, DEVELOPMENT_NOTE, educationMoments, FREE_PROMISE,
  institutionalLayer, institutionalPlans, institutionalProcess, personalExperience,
  PRICING_NOTE, PRIVACY_PROMISE, programExample, site,
} from "@/lib/content";
export const metadata: Metadata = {
  title: "PsicoCare para educación",
  description: "PsicoCare es gratuito para los estudiantes. Universidades, colegios e institutos incorporan una capa institucional para desplegar programas de bienestar, organizarlos y conocer su adopción mediante información agregada.",
  alternates: { canonical: "/educacion" },
};
export default function Page() {
  return <>
    <section className="edu-hero"><Container>
      <div className="edu-hero-grid">
        <div><Eyebrow>PsicoCare para educación</Eyebrow><h1>PsicoCare para tu comunidad educativa.</h1>
          <p className="edu-lead">Complementa tus programas de bienestar con una plataforma que acerca herramientas a las y los estudiantes, organiza iniciativas y te permite conocer su adopción mediante información agregada, sin convertir su experiencia personal en información institucional.</p>
          <div className="button-row"><ButtonLink href="/#contacto">Solicitar piloto</ButtonLink><ButtonLink href="#programas" variant="ghost">Ver el programa</ButtonLink></div>
        </div>
        <Image src="/brand/mascots-together.webp" width={300} height={300} alt="Los personajes de PsicoCare acompañándose" priority/>
      </div>
      <p className="edu-promise"><Icon name="heart" size={20}/>{FREE_PROMISE}</p>
    </Container></section>

    <section className="section-space" id="modelo"><Container>
      <SectionHeading eyebrow="Cómo funciona el modelo" title={<>Más herramientas para la institución. <br/>La misma privacidad para el estudiante.</>}>Si cualquier joven ya puede usar PsicoCare gratis, ¿qué incorpora una institución? No una versión mejor de la app: la infraestructura para desplegar, organizar, medir y sostener sus iniciativas de bienestar.</SectionHeading>
      <div className="compare-grid">
        <article className="compare-card is-free">
          <div className="compare-head"><Eyebrow>Para cualquier joven</Eyebrow><h3>PsicoCare gratis</h3><p>La experiencia personal completa, sin pertenecer a ninguna institución y sin pagar.</p></div>
          <p className="compare-owner"><Icon name="lock" size={18}/>Lo que recibe la persona</p>
          <ul className="compare-list">{personalExperience.map(item => <li key={item}><Icon name="check" size={17}/><span>{item}</span></li>)}</ul>
          <p className="compare-price">Siempre gratuito para usuarios individuales.</p>
        </article>
        <article className="compare-card is-institutional">
          <div className="compare-head"><Eyebrow>Para la institución</Eyebrow><h3>PsicoCare Educación</h3><p>Todo lo que ya reciben las personas, más una capa institucional para acompañar mejor a la comunidad.</p></div>
          <p className="compare-owner"><Icon name="chart" size={18}/>Lo que recibe la institución</p>
          <ul className="compare-list">{institutionalLayer.map(item => <li key={item}><Icon name="check" size={17}/><span>{item}</span></li>)}</ul>
          <p className="compare-sub">En planes avanzados</p>
          <ul className="compare-list is-secondary">{advancedLayer.map(item => <li key={item}><Icon name="check" size={17}/><span>{item}</span></li>)}</ul>
        </article>
      </div>
      <div className="privacy-callout"><Icon name="shield" size={26}/><div><h3>{PRIVACY_PROMISE}</h3>
        <p>Los paneles institucionales se diseñan alrededor de información agregada sobre participación, adopción y uso de programas. Las conversaciones privadas, las reflexiones y las notas personales no forman parte del panel institucional.</p>
        <p className="privacy-account">La cuenta de PsicoCare pertenece a la persona. Pertenecer a una institución añade programas, recursos y encuestas; si deja de pertenecer, conserva su experiencia personal.</p></div></div>
    </Container></section>

    <section className="moments-section section-space"><Container>
      <SectionHeading eyebrow="Momentos de la vida estudiantil" title="PsicoCare puede acompañar distintos momentos del curso.">La propuesta no es abstracta: estos son los momentos donde una institución puede apoyarse en la plataforma.</SectionHeading>
      <div className="moments-grid">{educationMoments.map(moment => <article key={moment.id}>
        <Icon name={moment.icon} size={24}/><h3>{moment.title}</h3><p>{moment.body}</p></article>)}</div>
    </Container></section>

    <section className="section-space"><Container>
      <SectionHeading eyebrow="Programas institucionales" title="Organiza el bienestar en programas, no en campañas sueltas.">Una institución puede agrupar actividades en un programa con audiencia y duración definidas, y seguir su adopción con datos agregados.</SectionHeading>
      <div className="program-demo">
        <div className="program-card">
          <span className="demo-badge">Ejemplo de programa</span>
          <h3>{programExample.name}</h3>
          <dl className="program-meta"><div><dt>Duración</dt><dd>{programExample.duration}</dd></div><div><dt>Audiencia</dt><dd>{programExample.audience}</dd></div></dl>
          <p className="program-label">Actividades</p>
          <ul className="program-activities">{programExample.activities.map(a => <li key={a}><Icon name="check" size={17}/><span>{a}</span></li>)}</ul>
        </div>
        <div className="program-metrics">
          <span className="demo-badge">Ejemplo de panel</span>
          <h3>Lo que la institución puede medir</h3>
          <p>Indicadores agregados del programa. No mostramos cifras de muestra: los valores reales aparecen cuando el programa está en marcha.</p>
          <ul className="metric-list">{programExample.metrics.map(m => <li key={m}><span>{m}</span><span className="metric-placeholder">Sin datos todavía</span></li>)}</ul>
        </div>
      </div>
      <div className="resources-block">
        <div><Eyebrow>Recursos de tu institución</Eyebrow><h3>Cuando alguien necesita apoyo humano, que encuentre el de su institución.</h3>
          <p>Una institución puede configurar sus propios recursos verificados —bienestar estudiantil, psicología, orientación, horarios y canales oficiales— para que la plataforma muestre la ruta real de apoyo y no un recurso genérico.</p></div>
        <div className="resource-preview"><span className="demo-badge">Ejemplo de configuración</span>
          <p className="resource-title">Recursos disponibles en tu institución</p>
          <div className="resource-item"><strong>Bienestar Estudiantil</strong><span>Lunes a viernes · 8:00 a. m. – 5:00 p. m.</span><span className="resource-action">Ver opciones de contacto</span></div>
          <p className="resource-note">Los datos mostrados son un ejemplo. Cada institución configura sus propios recursos y horarios.</p></div>
      </div>
    </Container></section>

    <section className="surveys-edu-section section-space"><Container>
      <div className="surveys-edu"><div><Eyebrow>Encuestas institucionales</Eyebrow><h2>Escucha a tu comunidad sin convertir cada respuesta en un expediente.</h2>
        <p>La institución puede lanzar encuestas de entrada, de necesidades, de experiencia del programa o de cierre, y leer los resultados de forma agregada para decidir qué mejorar.</p>
        <p className="surveys-edu-note"><Icon name="lock" size={18}/>Las encuestas institucionales sirven para mejorar programas, no para perfilar psicológicamente a estudiantes concretos.</p>
        <ButtonLink href="/encuestas" variant="ghost">Ver cómo funciona una encuesta</ButtonLink></div>
        <Image src="/brand/mascot-tangled.webp" width={150} height={199} alt="El personaje enredado de PsicoCare escucha" loading="lazy"/></div>
    </Container></section>

    <section className="plans-section section-space" id="programas"><Container>
      <SectionHeading eyebrow="Formas de implementarlo" title="Elige el punto de partida.">Tres maneras de incorporar PsicoCare a una institución educativa, según el momento en el que estés.</SectionHeading>
      <div className="plans-grid">{institutionalPlans.map(plan => <article className={"plan-card" + (plan.highlight ? " is-highlight" : "")} key={plan.id}>
        {plan.highlight && <span className="plan-badge">Programa principal</span>}
        <h3>{plan.name}</h3><p className="plan-summary">{plan.summary}</p>
        <p className="plan-price"><strong>{plan.price}</strong><span>{plan.unit}</span></p>
        <ul className="plan-includes">{plan.includes.map(item => <li key={item}><Icon name="check" size={17}/><span>{item}</span></li>)}</ul>
        <p className="plan-note">{plan.note}</p>
        <ButtonLink href="/#contacto" variant={plan.highlight ? "primary" : "ghost"}>{plan.cta}</ButtonLink>
      </article>)}</div>
      <p className="plans-disclaimer"><Icon name="lock" size={19}/>{PRICING_NOTE}</p>
    </Container></section>

    <section className="section-space"><Container>
      <SectionHeading eyebrow="Más allá de la implementación" title="También podemos colaborar.">No toda relación con PsicoCare es un programa contratado. Estas vías son de colaboración y no implican costo.</SectionHeading>
      <div className="collab-grid">{collaborationTracks.map(track => <article className="collab-card" key={track.id}>
        <h3>{track.title}</h3><p>{track.body}</p><ButtonLink href="/#contacto" variant="ghost">{track.cta}</ButtonLink></article>)}</div>
    </Container></section>

    <section className="process-section section-space"><Container>
      <SectionHeading eyebrow="Cómo empezamos" title="Un proceso corto y claro.">Sin compromisos hasta que el alcance esté definido por ambas partes.</SectionHeading>
      <ol className="process-steps">{institutionalProcess.map(step => <li key={step.step}><span className="process-number">{step.step}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol>
      <p className="development-note"><Icon name="shield" size={19}/>{DEVELOPMENT_NOTE}</p>
      <div className="process-cta"><h2>Conversemos sobre tu institución.</h2>
        <p>Escríbenos y coordinamos una primera conversación para entender tu contexto.</p>
        <div className="button-row"><ButtonLink href="/#contacto">Solicitar información</ButtonLink><a className="button button-ghost" href={`mailto:${site.email}`}>{site.email}</a></div></div>
    </Container></section>
  </>;
}
