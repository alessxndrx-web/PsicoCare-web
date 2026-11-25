import type { Metadata } from "next";
import { DocumentPage } from "@/components/layout/DocumentPage";
import { PageSchema } from "@/components/seo/PageSchema";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Primitives";
const path = "/nosotros";
const title = "Nosotros: tecnología con propósito desde Nicaragua";
const description = "Conoce el propósito de Psico Care, la app nicaragüense de acompañamiento emocional para jóvenes nacida en Hackathon Nicaragua 2026: qué queremos construir y cómo lo hacemos.";
export const metadata: Metadata = pageMetadata({ title, description, path });
export default function Page() {
  return <><PageSchema path={path} name={title} description={description} type="AboutPage"/><DocumentPage eyebrow="De Nicaragua, con propósito" title="Tecnología que acompaña. Personas que importan." lead="Psico Care nace al reconocer que hay jóvenes que recurren a la tecnología para expresar lo que sienten. Queremos que ese primer paso tenga un espacio diseñado con responsabilidad.">
    <h2>Lo que queremos hacer posible</h2><p>Una primera capa de acompañamiento accesible, con conversaciones guiadas, ejercicios y oportunidades para practicar. Una herramienta que ayude a organizar ideas y reconozca el valor del acompañamiento profesional.</p>
    <h2>Una identidad que también acompaña</h2><p>La orquídea del isotipo representa crecimiento y apertura; el nudo, los vínculos que sostienen. El personaje enredado da lugar a los pensamientos complejos. El personaje redondo expresa calma y equilibrio. Juntos recuerdan que no es necesario tenerlo todo resuelto para empezar.</p>
    <h2>De la propuesta a un producto que puedes explorar</h2><p>El proyecto comenzó como una propuesta para Hackathon Nicaragua 2026. Hoy esta web permite explorar una demo y participar en una encuesta real de producto. La aplicación completa, las conversaciones con IA y la red profesional continúan en desarrollo.</p>
    <h2>Construir escuchando</h2><p>Queremos aprender de jóvenes, profesionales, instituciones y organizaciones. No presentamos alianzas, resultados clínicos ni cifras de adopción que aún no existen.</p><p>¿Eres periodista o representas a una organización? Encuentra nuestra ficha informativa y los logotipos oficiales en <Link href="/prensa">prensa</Link>.</p><ButtonLink href="/#contacto">Conversemos sobre Psico Care</ButtonLink>
  </DocumentPage></>;
}
