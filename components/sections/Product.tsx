import { Container, SectionHeading } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
export function Product() {
  return <section className="product-intro section-space" id="producto"><Container>
    <div className="split-heading"><SectionHeading eyebrow="Esto es Psico Care" title={<>Más espacio para ti. <br/>Más formas de avanzar.</>}/><p>Una aplicación de acompañamiento emocional para jóvenes. Conversa, reflexiona y practica situaciones cotidianas en un mismo espacio, con límites claros y a tu ritmo.</p></div>
    <div className="product-principles">{[
      ["chat", "Exprésate con calma", "Dale un lugar a lo que estás viviendo, sin tener que encontrar las palabras perfectas."],
      ["steps", "Practica para la vida real", "Ensaya esa entrevista, una presentación o una conversación importante para ti."],
      ["heart", "Encuentra tu siguiente paso", "Haz una pausa, reconoce lo aprendido y considera cuándo buscar apoyo humano."],
    ].map(([icon, title, body], i) => <article key={title}><span className="principle-number">0{i + 1}</span><Icon name={icon} size={31}/><h3>{title}</h3><p>{body}</p></article>)}</div>
  </Container></section>;
}
