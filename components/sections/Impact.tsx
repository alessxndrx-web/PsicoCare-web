import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { impact, site } from "@/lib/content";

export function Impact() {
  return (
    <Section id="impacto" tone="white" labelledBy="impacto-title">
      <Container>
        <SectionHeading
          id="impacto-title"
          eyebrow={impact.eyebrow}
          title={impact.title}
          lede={impact.lede}
          tone="light"
          align="center"
          maxWidth="max-w-2xl"
        />

        {/* La intersección */}
        <RevealGroup
          as="ul"
          gap={0.08}
          className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-mist-200 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5"
        >
          {impact.axes.map((axis, i) => (
            <RevealItem
              as="li"
              key={axis.label}
              className="group relative bg-white p-6 transition-colors duration-300 hover:bg-mist-50"
            >
              <span className="font-mono text-[10.5px] text-on-light-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-[16px] font-semibold text-on-light">{axis.label}</h3>
              <p className="mt-2 text-[13.5px] leading-snug text-on-light-soft">
                {axis.detail}
              </p>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-brand-600 to-spark-500 transition-transform duration-500 group-hover:scale-x-100"
              />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.05}>
          <p className="mt-8 text-center font-mono text-[11px] tracking-[0.18em] text-on-light-soft uppercase">
            {site.event}
          </p>
        </Reveal>

        {/* Por qué importa */}
        <Reveal className="mt-20 lg:mt-24">
          <div className="grid gap-8 border-t border-on-light/[0.08] pt-14 lg:grid-cols-[auto_1fr] lg:gap-20">
            <h3 className="max-w-xs text-[clamp(1.4rem,2.6vw,1.9rem)] leading-tight font-semibold text-on-light">
              {impact.why.title}
            </h3>
            <p className="max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-on-light-soft">
              {impact.why.body}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
