import type { Metadata } from "next";
import Link from "next/link";
import { DocumentPage } from "@/components/layout/DocumentPage";
import { PageSchema } from "@/components/seo/PageSchema";
import { ButtonLink } from "@/components/ui/Primitives";
import { androidDownload, androidDownloadOptionsUrl } from "@/lib/downloads";
import { faqSchema, pageMetadata, routeUpdated } from "@/lib/seo";

const path = "/neuroia";
const title = "NeuroIA: asistente de acompañamiento emocional con IA";
const description = "NeuroIA es el asistente con inteligencia artificial de Psico Care: conversación, reflexión guiada y práctica de situaciones cotidianas para jóvenes. Qué hace hoy, cómo funciona, sus límites y su privacidad.";
export const metadata: Metadata = pageMetadata({ title, description, path });

/** Answers kept short, factual and consistent with the rest of the page (also used for FAQPage). */
const faq = [
  { question: "¿Qué es NeuroIA?", answer: "NeuroIA es el asistente conversacional con inteligencia artificial de la aplicación Psico Care, creada en Nicaragua. Acompaña a poner en palabras lo que sientes, a reflexionar y a practicar situaciones cotidianas. No diagnostica ni sustituye la atención profesional." },
  { question: "¿NeuroIA es un psicólogo o una terapia?", answer: "No. NeuroIA es una herramienta de acompañamiento emocional. No realiza diagnósticos, no prescribe medicamentos y no reemplaza a un profesional de salud mental ni a los servicios de emergencia." },
  { question: "¿Cómo puedo usar NeuroIA?", answer: `NeuroIA está dentro de la app Android de Psico Care. La versión ${androidDownload.version} se descarga gratis desde esta web para instalarla por separado y requiere ${androidDownload.requirements}. Por ahora no hay versión para iPhone.` },
  { question: "¿NeuroIA guarda mis conversaciones?", answer: "Sí, si inicias sesión: las conversaciones se guardan en tu teléfono y en tu cuenta para que puedas retomarlas. Solo tu propia sesión puede verlas, y puedes borrarlas desde la app. Las imágenes de la cámara nunca se guardan." },
  { question: "¿Qué hace NeuroIA si alguien escribe que está en peligro?", answer: "Antes de generar cualquier texto, NeuroIA revisa señales de riesgo y, si las detecta, muestra una respuesta de seguridad predefinida que no depende del modelo de lenguaje. Aun así, NeuroIA no es un servicio de emergencia: ante un peligro inmediato hay que contactar a los servicios de emergencia locales o a una persona de confianza." },
  { question: "¿NeuroIA tiene relación con otros productos llamados NeuroIA?", answer: "No. NeuroIA es el nombre del asistente de Psico Care y no está relacionado con otros productos o empresas que usan nombres parecidos." },
];

export default function Page() {
  return <>
    <PageSchema path={path} name={title} description={description} extra={[faqSchema(faq)]}/>
    <DocumentPage eyebrow="El asistente de Psico Care" title="NeuroIA: inteligencia artificial que acompaña, con límites claros." updated={routeUpdated(path)}
      lead="NeuroIA es el asistente conversacional con inteligencia artificial de la app Psico Care. Te acompaña a poner en palabras lo que sientes, a reflexionar y a practicar situaciones cotidianas, a tu ritmo. No diagnostica, no prescribe y no sustituye a un profesional de salud mental ni a los servicios de emergencia.">

      <h2>Para qué existe NeuroIA</h2>
      <p>Muchas personas jóvenes recurren primero a la tecnología cuando necesitan expresar lo que sienten. NeuroIA busca que ese primer paso ocurra en un espacio diseñado con responsabilidad: una primera capa de acompañamiento emocional que ayuda a ordenar ideas, a prepararse para una conversación difícil y a reconocer cuándo conviene buscar apoyo humano.</p>

      <h2>Qué puedes hacer hoy con NeuroIA</h2>
      <p>NeuroIA está disponible dentro de la app Android de Psico Care. La versión {androidDownload.version} se publica como <strong>{androidDownload.status.toLowerCase()}</strong> para {androidDownload.requirements}; todavía no existe una versión para iPhone.</p>
      <ul>
        <li><strong>Conversar</strong> por texto o por voz, con dictado y lectura en voz alta de las respuestas.</li>
        <li><strong>Reflexionar</strong> con preguntas guiadas y un diario emocional.</li>
        <li><strong>Hacer una pausa</strong> con ejercicios breves de respiración.</li>
        <li><strong>Practicar conversaciones</strong>, como una entrevista o pedir ayuda, y recibir una devolución al terminar.</li>
        <li><strong>Avanzar paso a paso</strong> ante una situación cotidiana mediante exposición gradual.</li>
        <li><strong>Retomar</strong> tus conversaciones guardadas en tu cuenta, o borrarlas cuando quieras.</li>
        <li><strong>Usar la cámara solo si lo decides.</strong> Está desactivada por defecto. NeuroIA distingue lo que se observa, como la postura, de cómo dices sentirte, y no deduce emociones ni datos de salud a partir de la imagen.</li>
      </ul>
      <p>La <Link href="/#app-movil">demo de esta web</Link> utiliza ejemplos preparados: muestra la experiencia, pero no conversa con NeuroIA ni envía lo que escribes a un servidor.</p>

      <h2>Cómo funciona</h2>
      <p>Cada mensaje pasa por varias capas. Las de seguridad se ejecutan antes que el modelo de lenguaje y no dependen de él.</p>
      <ol className="document-callout">
        <li>1. <strong>Seguridad primero.</strong> Un clasificador de riesgo y una respuesta de crisis predefinida actúan antes de generar texto.</li>
        <li>2. <strong>Ámbito acotado.</strong> NeuroIA se limita al bienestar emocional y la psicoeducación; las tareas ajenas, como programar, reciben una respuesta fija.</li>
        <li>3. <strong>Generación.</strong> En noviembre de 2026 el servicio funciona con Qwen3.5-35B-A3B, un modelo de lenguaje abierto publicado con licencia Apache 2.0. El modelo puede cambiar; lo indicaremos en esta página.</li>
        <li>4. <strong>Revisión de la respuesta.</strong> Reglas que cuidan el estilo, evitan afirmaciones sin respaldo y separan lo que muestra la cámara de lo que la persona cuenta.</li>
      </ol>

      <h2>NeuroIA 2.0: en qué estamos trabajando</h2>
      <p>NeuroIA 2.0 añade un planificador que identifica qué pide la persona en cada turno —ser escuchada, información, un paso concreto o practicar— dando prioridad al mensaje más reciente y a sus correcciones, y un supervisor que revisa la pertinencia, la continuidad y el respaldo de cada respuesta antes de mostrarla.</p>
      <p><strong>Todavía no está disponible en la app.</strong> Está en evaluación interna, desactivado por defecto. Se probó con 150 conversaciones ficticias de varios turnos —50 de ajuste y 100 reservadas como control— y proveedores simulados. Esos resultados orientan el desarrollo; no son una validación clínica.</p>

      <h2>En qué se diferencia de un asistente de propósito general</h2>
      <ul>
        <li>Tiene un ámbito limitado al bienestar emocional y no intenta resolver cualquier tarea.</li>
        <li>Las rutas de crisis son deterministas y no esperan al modelo de lenguaje.</li>
        <li>No promueve la dependencia: ante preguntas sobre reemplazar a amistades, familia o profesionales, anima a conservar esos vínculos.</li>
        <li>No deduce emociones ni datos de salud a partir de la cámara.</li>
        <li>Está diseñado en español y para jóvenes de Nicaragua y Latinoamérica.</li>
      </ul>

      <h2>Límites que conviene conocer</h2>
      <ul>
        <li>NeuroIA puede equivocarse o malinterpretar un mensaje. Sus respuestas no son consejo médico ni psicológico.</li>
        <li>No ha sido validada clínicamente ni evaluada en un ensayo con personas usuarias.</li>
        <li>No es un servicio de emergencia y nadie supervisa las conversaciones en tiempo real.</li>
        <li>Necesita conexión a internet para generar respuestas.</li>
      </ul>

      <h2>Privacidad y seguridad</h2>
      <p>Si inicias sesión, tus conversaciones se guardan en el teléfono y en tu cuenta para que puedas continuarlas; solo tu sesión puede listarlas, leerlas o borrarlas. Las imágenes de la cámara se procesan para describir la escena y nunca se guardan. Esta web no envía conversaciones, emociones ni datos de NeuroIA a la analítica. Más detalles en <Link href="/seguridad">seguridad y límites</Link> y <Link href="/privacidad">datos y consentimiento</Link>.</p>

      <h2>La investigación detrás</h2>
      <p>Evaluamos NeuroIA con conjuntos de conversaciones ficticias, separación entre datos de ajuste y de control y revisiones a ciegas. Explicamos qué demuestran y qué no esas pruebas en <Link href="/investigacion">investigación y evaluación</Link>.</p>

      <div className="document-callout"><h2 style={{ marginTop: 0 }}>Si necesitas ayuda inmediata</h2><p>NeuroIA no es un servicio de emergencia. Si estás en peligro inmediato, contacta a los servicios de emergencia de tu localidad o pide apoyo a una persona de confianza que pueda acompañarte.</p></div>

      <h2>Preguntas frecuentes sobre NeuroIA</h2>
      <div className="faq-list">{faq.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</div>

      <div className="document-actions"><Link className="button button-primary" href={androidDownloadOptionsUrl}>Ver descargas para Android</Link><ButtonLink href="/#app-movil" variant="ghost">Ver la demo</ButtonLink></div>
    </DocumentPage>
  </>;
}
