import Image from "next/image";
import { ButtonLink, Container, Eyebrow } from "@/components/ui/Primitives";
export function Audiences() {
  return <section className="audiences-section section-space" id="instituciones"><Container>
    <div className="audiences-grid"><article className="audience-users"><Eyebrow>Para ti</Eyebrow><h2>Un espacio para<br/>avanzar a tu ritmo.</h2><p>No necesitas tenerlo todo resuelto para dar el primer paso. Explora la experiencia y cuéntanos cómo podemos mejorarla.</p><ButtonLink href="#app-movil" variant="ghost">Conoce tu espacio</ButtonLink><Image src="/brand/mascot-calm.webp" width={119} height={177} alt="El personaje tranquilo de PsicoCare te acompaña"/></article>
    <article className="audience-institutions"><Eyebrow>Para centros educativos</Eyebrow><h2>PsicoCare para tu<br/>comunidad educativa.</h2><p>La app es gratuita para las personas. Universidades, colegios e institutos incorporan una capa institucional para desplegar programas, organizarlos y conocer su adopción con datos agregados.</p><div className="audience-tags"><span>Piloto</span><span>Programas</span><span>Datos agregados</span><span>Investigación</span></div><ButtonLink href="/educacion">Conocer PsicoCare Educación</ButtonLink></article></div>
  </Container></section>;
}
