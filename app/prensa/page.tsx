import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DocumentPage } from "@/components/layout/DocumentPage";
import { PageSchema } from "@/components/seo/PageSchema";
import { androidDownload } from "@/lib/downloads";
import { site } from "@/lib/content";
import { pageMetadata, routeUpdated } from "@/lib/seo";

const path = "/prensa";
const title = "Prensa y recursos de marca";
const description = "Ficha informativa de Psico Care, descripción oficial, contacto de prensa y logotipos oficiales para medios, instituciones y aliados.";
export const metadata: Metadata = pageMetadata({ title, description, path });

const assets = [
  { href: "/brand/logo-light.svg", label: "Logotipo claro (SVG)", light: false },
  { href: "/brand/logo-purple.svg", label: "Logotipo morado (SVG)", light: true },
  { href: "/brand/isotype.svg", label: "Isotipo (SVG)", light: true },
  { href: "/brand/psicocare-logo-512.png", label: "Isotipo 512 × 512 (PNG)", light: true },
];
const colors = [["#000022", "Medianoche"], ["#804BDD", "Morado"], ["#D9EDF6", "Celeste"], ["#A2AAE8", "Pervinca"], ["#912B7D", "Fucsia"], ["#543647", "Ciruela"]];

export default function Page() {
  return <>
    <PageSchema path={path} name={title} description={description}/>
    <DocumentPage eyebrow="Prensa" title="Psico Care para medios y aliados." updated={routeUpdated(path)}
      lead="Información verificable sobre Psico Care para periodistas, instituciones y organizaciones. Si necesitas un dato que no aparece aquí, escríbenos: preferimos no publicar cifras ni alianzas que todavía no existen.">

      <h2>Ficha informativa</h2>
      <ul>
        <li><strong>Nombre:</strong> Psico Care (también escrito PsicoCare).</li>
        <li><strong>Qué es:</strong> una aplicación de acompañamiento emocional para jóvenes con <Link href="/neuroia">NeuroIA</Link>, su asistente de inteligencia artificial.</li>
        <li><strong>Origen:</strong> Nicaragua. El proyecto comenzó como una propuesta para Hackathon Nicaragua 2026.</li>
        <li><strong>Producto:</strong> app Android {androidDownload.version} ({androidDownload.status.toLowerCase()}, {androidDownload.requirements}), una web con demo interactiva y una encuesta de producto.</li>
        <li><strong>Modelo:</strong> gratuita para las personas; las instituciones educativas pueden incorporar programas y una capa institucional (<Link href="/educacion">Psico Care Educación</Link>).</li>
        <li><strong>Estado:</strong> en desarrollo. No diagnostica, no sustituye la atención profesional y no cuenta con validación clínica.</li>
      </ul>

      <h2>Descripción oficial</h2>
      <p><strong>Breve:</strong> Psico Care es una aplicación nicaragüense de acompañamiento emocional para jóvenes. Con su asistente NeuroIA, ofrece conversación, reflexión guiada y práctica de situaciones cotidianas, con límites claros: no diagnostica ni sustituye la atención profesional.</p>
      <p><strong>Extensa:</strong> Psico Care nace en Nicaragua al reconocer que muchas personas jóvenes recurren a la tecnología para expresar lo que sienten. Su app Android reúne conversaciones con NeuroIA, un diario emocional, ejercicios de respiración, simulaciones de conversaciones y exposición gradual. El proyecto se construye por etapas, con encuestas, evaluaciones y protocolos de seguridad que priorizan la privacidad y el apoyo humano cuando la tecnología no es suficiente.</p>

      <h2>Contacto de prensa</h2>
      <p>Correo: <a href={`mailto:${site.email}`}>{site.email}</a> · Teléfono: <a href={`tel:${site.phoneHref}`}>{site.phone}</a></p>

      <h2>Logotipos oficiales</h2>
      <p>Proceden del manual de marca de Psico Care. Úsalos sin modificar sus proporciones, colores ni composición, y con espacio suficiente alrededor.</p>
      <div className="brand-assets">{assets.map(a => <a key={a.href} href={a.href} download><span className={a.light ? "is-light" : undefined}><Image src={a.href} alt="" width={120} height={64} unoptimized/></span>{a.label}</a>)}</div>

      <h2>Colores y tipografía</h2>
      <ul className="color-swatches">{colors.map(([hex, name]) => <li key={hex}><span style={{ background: hex }}/>{name} {hex}</li>)}</ul>
      <p>Tipografías: Montserrat para textos y títulos, y Lora en cursiva para los acentos editoriales.</p>
    </DocumentPage>
  </>;
}
