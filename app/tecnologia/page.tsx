import type { Metadata } from "next";
import { DocumentPage } from "@/components/layout/DocumentPage";
import { PageSchema } from "@/components/seo/PageSchema";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Primitives";
const path = "/tecnologia";
const title = "Tecnología: IA aplicada al bienestar emocional";
const description = "Cómo usa Psico Care la inteligencia artificial para el bienestar emocional: qué funciona hoy en la web y en la app, qué está en validación y qué límites aplicamos desde el diseño.";
export const metadata: Metadata = pageMetadata({ title, description, path });
export default function Page() {
  return <><PageSchema path={path} name={title} description={description}/><DocumentPage eyebrow="Una mirada al desarrollo" title="Construimos con límites desde el principio." lead="La transparencia también consiste en explicar qué funciona hoy, qué estamos validando y qué sigue siendo una dirección de desarrollo.">
    <h2>Disponible en esta web</h2><ul><li>Una demo de la experiencia móvil con conversaciones preparadas y ejercicios controlados.</li><li>Una encuesta con almacenamiento persistente, consentimiento y recuperación de borradores.</li><li>Un panel de investigación con acceso restringido y un buzón para contactos.</li></ul>
    <h2>La inteligencia artificial en la app: NeuroIA</h2><p>La app Android de Psico Care incluye <Link href="/neuroia">NeuroIA</Link>, un asistente conversacional que funciona con un modelo de lenguaje abierto y capas de seguridad que se ejecutan antes que el modelo. Se publica como versión candidata: sus capacidades, sus límites y lo que todavía está en evaluación se explican en su página.</p>
    <h2>La dirección técnica del producto</h2><p>La propuesta original contempla explorar modelos abiertos, adaptación al dominio, recuperación de conocimiento revisado y evaluaciones continuas. Son líneas de investigación, no servicios activos en esta web.</p><ol className="document-callout"><li>1. Una interfaz que explica sus posibilidades y límites.</li><li>2. Conversaciones y prácticas definidas para casos de uso concretos.</li><li>3. Materiales revisados y evaluaciones con especialistas.</li><li>4. Protocolos de seguridad y consentimiento explícito.</li><li>5. Opciones de apoyo humano cuando la tecnología sea insuficiente.</li></ol>
    <h2>Cómo evaluamos</h2><p>Probamos cada cambio con conversaciones ficticias, conjuntos de control y revisiones a ciegas antes de publicarlo. Explicamos el método y sus límites en <Link href="/investigacion">investigación y evaluación</Link>.</p>
    <h2>Lo que aún requiere validación</h2><p>La calidad de las conversaciones con IA, cualquier análisis de señales de riesgo, los ejercicios especializados y el acceso a una red profesional deben evaluarse antes de ofrecerse. Esta web no ejecuta diagnósticos ni realiza escalamiento automático.</p>
    <h2>Una construcción por etapas</h2><p>Primero escuchamos necesidades y probamos la experiencia. Después corresponde revisar el producto con profesionales y realizar pruebas controladas. La publicación de una app móvil completa y las colaboraciones institucionales dependerán de esa validación.</p><ButtonLink href="/encuestas">Ayúdanos a decidir el siguiente paso</ButtonLink>
  </DocumentPage></>;
}
