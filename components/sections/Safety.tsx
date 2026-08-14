import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SafetyPipeline } from "@/components/visuals/SafetyPipeline";
import { safety } from "@/lib/content";

export function Safety() {
  return (
    <Section id="seguridad" tone="dark" labelledBy="seguridad-title">
      <div
        aria-hidden="true"
        className="absolute right-[-8%] bottom-0 h-[36rem] w-[36rem] rounded-full bg-spark-600/12 blur-[140px]"
      />

      <Container>
        <SectionHeading
          id="seguridad-title"
          eyebrow={safety.eyebrow}
          title={safety.title}
          lede={safety.lede}
          maxWidth="max-w-2xl"
        />

        {/* Recorrido de seguridad */}
        <Reveal className="mt-16 lg:mt-20">
          <div className="rounded-2xl bg-white/[0.02] p-7 ring-1 ring-white/[0.07] md:p-10">
            <div className="mb-9 flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.18em] text-on-dark-soft uppercase">
                Recorrido de una conversación
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
            </div>
            <SafetyPipeline />
          </div>
        </Reveal>

        {/* Principios — rejilla sin tarjetas */}
        <div className="mt-16 lg:mt-20">
          <p className="font-mono text-[10.5px] tracking-[0.18em] text-spark-300 uppercase">
            Principios de diseño
          </p>
          <RevealGroup
            as="ul"
            gap={0.05}
            className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3"
          >
            {safety.principles.map((principle) => (
              <RevealItem
                as="li"
                key={principle.title}
                className="bg-ink-900 p-6 transition-colors duration-300 hover:bg-ink-850"
              >
                <h3 className="text-[15px] font-medium text-on-dark">{principle.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-snug text-on-dark-soft">
                  {principle.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Frase de cierre */}
        <Reveal className="mt-20 lg:mt-24">
          <figure className="relative mx-auto max-w-3xl text-center">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -top-8 mx-auto h-px w-24 bg-linear-to-r from-transparent via-spark-400/60 to-transparent"
            />
            <blockquote>
              <p className="text-[clamp(1.35rem,3.2vw,2.2rem)] leading-[1.25] font-medium text-balance text-on-dark">
                {safety.quote}
              </p>
            </blockquote>
          </figure>
        </Reveal>
      </Container>
    </Section>
  );
}
