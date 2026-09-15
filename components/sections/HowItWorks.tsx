import { Container, SectionHeading } from "@/components/ui/Primitives";
export function HowItWorks() {
  return <section className="how-section section-space"><Container><SectionHeading eyebrow="No tienes que saber por dónde empezar" title="Un primer paso. El tuyo."/>
    <ol className="how-steps">{[
      ["Haz una pausa", "Empieza por reconocer cómo te sientes, sin juicios y sin respuestas correctas."],
      ["Elige tu espacio", "Una conversación, una reflexión o un ejercicio. Tú eliges qué necesitas hoy."],
      ["Llévalo a tu día", "Cierra con una idea pequeña para practicar y reconoce cuándo quieres apoyo humano."],
    ].map(([title, text], i) => <li key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
  </Container></section>;
}
