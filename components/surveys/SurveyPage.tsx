import Image from "next/image";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { SurveyRunner } from "./SurveyRunner";
export function SurveyPage({ slug, googleEnabled, notice }: { slug: string; googleEnabled: boolean; notice?: string }) {
  return <section className="survey-page"><Container><Link href="/" className="breadcrumb"><Icon name="back" size={16}/>Volver a Psico Care</Link>
    <div className="survey-page-heading"><div><Eyebrow>Lo construimos contigo</Eyebrow><h1>Tu opinión puede ayudarnos a construir un mejor Psico Care.</h1><p>Queremos entender qué herramientas realmente serían útiles para jóvenes. Tu experiencia nos ayuda a elegir el siguiente paso.</p></div><Image src="/brand/mascot-tangled.webp" width={110} height={146} alt="El personaje enredado de Psico Care escucha tus ideas"/></div>
    <SurveyRunner slug={slug} googleEnabled={googleEnabled} notice={notice}/>
  </Container></section>;
}
