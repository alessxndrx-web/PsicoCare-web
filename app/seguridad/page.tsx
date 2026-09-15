import type { Metadata } from "next";
import Link from "next/link";
import { DocumentPage } from "@/components/layout/DocumentPage";
export const metadata: Metadata = { title: "Tecnología con límites claros", alternates: { canonical: "/seguridad" } };
export default function Page() {
  return <DocumentPage eyebrow="Tu confianza, primero" title="Acompañar también es saber hasta dónde llegar." lead="Queremos que siempre puedas distinguir lo que Psico Care puede ofrecerte y cuándo el siguiente paso necesita ser humano.">
    <h2>Una primera capa de acompañamiento</h2><p>Psico Care no diagnostica condiciones de salud mental ni reemplaza la atención profesional. Las herramientas y ejemplos de esta web permiten explorar el producto; no son una consulta ni un tratamiento.</p>
    <h2>Lo que ocurre en la demo</h2><p>Las conversaciones utilizan respuestas preparadas. No hay una IA interpretando tus emociones, un análisis de riesgo ni una persona supervisando la demo. Las reflexiones y elecciones se mantienen únicamente en la memoria de la página y desaparecen al recargar.</p>
    <h2>El apoyo humano es esencial</h2><p>Puedes considerar hablar con alguien de confianza o buscar a un profesional de salud mental. La red profesional de Psico Care sigue en desarrollo: la web no agenda consultas, inicia derivaciones ni contacta a profesionales por ti.</p>
    <div className="document-callout"><h2 style={{ marginTop: 0 }}>Si necesitas ayuda inmediata</h2><p>Esta web no es un servicio de emergencia y sus formularios no se revisan en tiempo real. Si estás en peligro inmediato, contacta a los servicios de emergencia de tu localidad o pide apoyo a una persona de confianza que pueda acompañarte.</p></div>
    <h2>Privacidad y decisiones informadas</h2><p>La encuesta solicita consentimiento antes de guardar respuestas. Separa los datos de investigación de los mensajes de contacto y permite retirar una participación desde el navegador utilizado. Conoce el detalle en <Link href="/privacidad">datos y consentimiento</Link>.</p>
    <h2>Antes de ampliar el producto</h2><p>La incorporación de conversaciones con IA, protocolos de seguridad y conexión profesional requiere evaluación técnica y revisión con especialistas. No presentamos estas capacidades futuras como funciones disponibles.</p><Link href="/tecnologia">Conoce el estado del desarrollo →</Link>
  </DocumentPage>;
}
