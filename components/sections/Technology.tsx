import { Container, Eyebrow, Pill, Section } from "@/components/ui/Primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArchitectureDiagram } from "@/components/visuals/ArchitectureDiagram";
import { technology } from "@/lib/content";

export function Technology() {
  return (
    <Section id="tecnologia" tone="deep" labelledBy="tecnologia-title">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid opacity-60 mask-fade"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-[-10%] h-[34rem] w-[34rem] rounded-full bg-brand-700/15 blur-[130px]"
      />

      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_minmax(320px,460px)] lg:gap-16">
          {/* Argumento */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>{technology.eyebrow}</Eyebrow>
              <h2
                id="tecnologia-title"
                className="mt-5 text-[clamp(1.85rem,4vw,3rem)] leading-[1.1] font-semibold text-on-dark"
              >
                {technology.title}
              </h2>
              <p className="mt-6 max-w-lg text-[clamp(1rem,1.35vw,1.1rem)] leading-relaxed text-on-dark-soft">
                {technology.lede}
              </p>
            </Reveal>

            <RevealGroup as="ul" className="mt-10 space-y-0" gap={0.07}>
              {technology.stack.map((item) => (
                <RevealItem
                  as="li"
                  key={item.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-white/[0.07] py-3.5 first:border-t-0 first:pt-0"
                >
                  <span className="text-[14.5px] font-medium text-on-dark">{item.name}</span>
                  <span className="text-[13px] text-on-dark-soft">{item.note}</span>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.1}>
              <Pill tone="accent" className="mt-8">
                <span className="h-1.5 w-1.5 rounded-full bg-spark-400" />
                Arquitectura propuesta · en desarrollo
              </Pill>
            </Reveal>
          </div>

          {/* Diagrama */}
          <Reveal>
            <div className="rounded-2xl bg-ink-900/50 p-4 ring-1 ring-white/[0.07] backdrop-blur-sm md:p-6">
              <div className="flex items-center justify-between px-3 pb-4">
                <span className="font-mono text-[10px] tracking-[0.18em] text-on-dark-soft uppercase">
                  Flujo del sistema
                </span>
                <span className="font-mono text-[10px] text-on-dark-soft/75">
                  {technology.layers.length} capas
                </span>
              </div>
              <ArchitectureDiagram />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
