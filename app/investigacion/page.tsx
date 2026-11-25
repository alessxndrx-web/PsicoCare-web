import type { Metadata } from "next";
import Link from "next/link";
import { DocumentPage } from "@/components/layout/DocumentPage";
import { PageSchema } from "@/components/seo/PageSchema";
import { ButtonLink } from "@/components/ui/Primitives";
import { pageMetadata, routeUpdated } from "@/lib/seo";

const path = "/investigacion";
const title = "Investigación y evaluación de NeuroIA";
const description = "Cómo evalúa Psico Care a NeuroIA y su producto: conversaciones ficticias, conjuntos de control, revisión a ciegas y encuestas con consentimiento. Qué demuestran estas pruebas y qué no.";
export const metadata: Metadata = pageMetadata({ title, description, path });

const references = [
  { label: "Organización Mundial de la Salud (2021). Ethics and governance of artificial intelligence for health.", url: "https://www.who.int/publications/i/item/9789240029200" },
  { label: "Organización Mundial de la Salud (2024). Ethics and governance of artificial intelligence for health: Guidance on large multi-modal models.", url: "https://www.who.int/publications/i/item/9789240084759" },
  { label: "Organización Mundial de la Salud. Salud mental de los adolescentes (nota descriptiva).", url: "https://www.who.int/es/news-room/fact-sheets/detail/adolescent-mental-health" },
  { label: "Organización Mundial de la Salud. Salud mental: fortalecer nuestra respuesta (nota descriptiva).", url: "https://www.who.int/es/news-room/fact-sheets/detail/mental-health-strengthening-our-response" },
  { label: "Organización Panamericana de la Salud. Salud mental.", url: "https://www.paho.org/es/temas/salud-mental" },
];

export default function Page() {
  return <>
    <PageSchema path={path} name={title} description={description}/>
    <DocumentPage eyebrow="Investigación" title="Medir antes de prometer." updated={routeUpdated(path)}
      lead="En salud mental, una buena intención no basta. Esta página explica cómo evaluamos a NeuroIA y al producto, qué demuestran esas pruebas y, sobre todo, qué no demuestran todavía.">

      <h2>Escuchar antes de construir</h2>
      <p>La web incluye una <Link href="/encuestas">encuesta de producto</Link> para personas mayores de 18 años, con consentimiento explícito, posibilidad de retirar la participación y análisis solo agregado. Sus respuestas nos ayudan a decidir qué funciones priorizar. No publicamos cifras hasta contar con una muestra suficiente y revisada.</p>

      <h2>Cómo evaluamos a NeuroIA</h2>
      <ul>
        <li><strong>Conversaciones ficticias en español</strong>, escritas para cubrir situaciones cotidianas, pedidos de información, correcciones, prácticas y señales de riesgo, sin datos de personas reales.</li>
        <li><strong>Separación entre ajuste y control.</strong> Una parte de las conversaciones se usa para ajustar el sistema y otra se reserva para comprobar el resultado sin haberla visto antes.</li>
        <li><strong>Revisión a ciegas</strong> al comparar variantes, para que quien evalúa no sepa qué versión produjo cada respuesta.</li>
        <li><strong>Pruebas automáticas de seguridad</strong> que verifican que las rutas de crisis y el límite de ámbito respondan antes que el modelo de lenguaje.</li>
        <li><strong>Trazabilidad del modelo.</strong> Cada respuesta del servicio identifica el modelo y la revisión que la generaron.</li>
      </ul>
      <p>Por ejemplo, NeuroIA 2.0 —todavía no disponible en la app— se evaluó con 150 conversaciones ficticias de varios turnos: 50 de ajuste y 100 de control, con proveedores simulados. Conoce el estado de NeuroIA en <Link href="/neuroia">su página</Link>.</p>

      <h2>Lo que estas pruebas no demuestran</h2>
      <ul>
        <li>No son una validación clínica ni sustituyen un estudio con personas usuarias y supervisión profesional.</li>
        <li>Las conversaciones ficticias no representan toda la diversidad de situaciones reales.</li>
        <li>Las reglas de seguridad reducen riesgos, pero no constituyen una garantía absoluta.</li>
      </ul>

      <h2>Fuentes clínicas y revisión humana</h2>
      <p>Los materiales de referencia de organismos sanitarios que incorporamos al proyecto, como documentos de la OMS y la OPS, permanecen pendientes de revisión humana y excluidos de las respuestas generadas hasta completarla. Respetamos sus licencias y no presentamos ningún contenido como revisado por profesionales si esa revisión no ha ocurrido.</p>

      <h2>Colabora con la investigación</h2>
      <p>Buscamos facultades, investigadoras e investigadores y profesionales de salud mental que quieran validar instrumentos, contenidos y experiencias con nosotros. Compartimos los hallazgos de forma agregada. Conoce las vías de colaboración en <Link href="/educacion">Psico Care Educación</Link>.</p>

      <h2>Lecturas de referencia</h2>
      <ul className="references">{references.map(r => <li key={r.url}><a href={r.url} rel="noopener" target="_blank">{r.label}</a></li>)}</ul>

      <div className="document-actions"><ButtonLink href="/#contacto">Proponer una colaboración</ButtonLink><ButtonLink href="/encuestas" variant="ghost">Participar en la encuesta</ButtonLink></div>
    </DocumentPage>
  </>;
}
