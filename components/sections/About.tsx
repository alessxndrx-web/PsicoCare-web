import { Container, Eyebrow } from "@/components/ui/Primitives";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
export function About() {
  return <section className="about-section" id="nosotros"><Container><div><Eyebrow>El propósito detrás de cada paso</Eyebrow><h2>Tecnología que acompaña.<br/><em>Personas que importan.</em></h2></div><div><p>PsicoCare nace de una realidad sencilla: hay jóvenes que recurren a la tecnología cuando necesitan expresar lo que sienten. Queremos construir una herramienta pensada para ese momento, y que reconozca cuándo la tecnología ya no es suficiente.</p><Link href="/nosotros" className="text-action">Conoce nuestra historia<Icon name="arrow" size={18}/></Link></div></Container></section>;
}
