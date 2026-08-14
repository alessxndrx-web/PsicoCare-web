import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { idea } from "@/lib/content";
import { cn } from "@/lib/cn";

export function Idea() {
  return (
    <Section id="idea" tone="light" labelledBy="idea-title">
      <div aria-hidden="true" className="bg-grid-light mask-fade absolute inset-0 -z-10" />

      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* Columna fija con el argumento */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow tone="light">{idea.eyebrow}</Eyebrow>
              <h2
                id="idea-title"
                className="mt-5 text-[clamp(1.85rem,4vw,3rem)] leading-[1.1] font-semibold text-on-light"
              >
                {idea.title}
              </h2>
              <p className="mt-6 max-w-lg text-[clamp(1rem,1.35vw,1.1rem)] leading-relaxed text-on-light-soft">
                {idea.lede}
              </p>

              <blockquote className="mt-9 border-l-2 border-brand-600 pl-5">
                <p className="text-[1.15rem] leading-snug font-medium text-on-light">
                  {idea.quote}
                </p>
              </blockquote>
            </Reveal>
          </div>

          {/* Rail del flujo */}
          <RevealGroup as="ol" className="relative" gap={0.09}>
            {/* Línea vertical continua */}
            <span
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-[15px] w-px bg-linear-to-b from-brand-600/35 via-brand-600/20 to-spark-500/40"
            />

            {idea.flow.map((step, i) => {
              const isLast = i === idea.flow.length - 1;
              return (
                <RevealItem
                  as="li"
                  key={step.step}
                  className="relative flex gap-6 pb-9 last:pb-0"
                >
                  <span
                    className={cn(
                      "relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[10.5px] font-medium transition-colors",
                      isLast
                        ? "bg-linear-to-br from-brand-600 to-spark-500 text-white shadow-[0_10px_28px_-10px_rgba(37,99,235,0.85)]"
                        : "bg-white text-brand-700 ring-1 ring-brand-600/25",
                    )}
                  >
                    {step.step}
                  </span>
                  <div className="pt-1">
                    <h3
                      className={cn(
                        "text-[16.5px] font-medium",
                        isLast ? "text-brand-700" : "text-on-light",
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-1.5 max-w-sm text-[14.5px] leading-relaxed text-on-light-soft">
                      {step.body}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
