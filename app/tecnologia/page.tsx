import type { Metadata } from "next";
import { DocumentPage } from "@/components/layout/DocumentPage";
import { ButtonLink } from "@/components/ui/Primitives";
export const metadata: Metadata = { title: "Tecnología y estado del desarrollo", alternates: { canonical: "/tecnologia" } };
export default function Page() {
  return <DocumentPage eyebrow="Una mirada al desarrollo" title="Construimos con límites desde el principio." lead="La transparencia también consiste en explicar qué funciona hoy, qué estamos validando y qué sigue siendo una dirección de desarrollo.">
    <h2>Disponible en esta web</h2><ul><li>Una demo de la experiencia móvil con conversaciones preparadas y ejercicios controlados.</li><li>Una encuesta con almacenamiento persistente, consentimiento y recuperación de borradores.</li><li>Un panel de investigación con acceso restringido y un buzón para contactos.</li></ul>
    <h2>La dirección técnica del producto</h2><p>La propuesta original contempla explorar modelos abiertos, adaptación al dominio, recuperación de conocimiento revisado y evaluaciones continuas. Son líneas de investigación, no servicios activos en esta web.</p><ol className="document-callout"><li>1. Una interfaz que explica sus posibilidades y límites.</li><li>2. Conversaciones y prácticas definidas para casos de uso concretos.</li><li>3. Materiales revisados y evaluaciones con especialistas.</li><li>4. Protocolos de seguridad y consentimiento explícito.</li><li>5. Opciones de apoyo humano cuando la tecnología sea insuficiente.</li></ol>
    <h2>Lo que aún requiere validación</h2><p>La calidad de las conversaciones con IA, cualquier análisis de señales de riesgo, los ejercicios especializados y el acceso a una red profesional deben evaluarse antes de ofrecerse. Esta web no ejecuta diagnósticos ni realiza escalamiento automático.</p>
    <h2>Una construcción por etapas</h2><p>Primero escuchamos necesidades y probamos la experiencia. Después corresponde revisar el producto con profesionales y realizar pruebas controladas. La publicación de una app móvil completa y las colaboraciones institucionales dependerán de esa validación.</p><ButtonLink href="/encuestas">Ayúdanos a decidir el siguiente paso</ButtonLink>
  </DocumentPage>;
}
