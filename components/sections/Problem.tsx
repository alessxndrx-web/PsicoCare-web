import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FocusTransition } from "@/components/visuals/FocusTransition";
import { problem } from "@/lib/content";

export function Problem() {
  return (
    <Section id="problema" tone="dark" labelledBy="problema-title">
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand-800/12 blur-[130px]"
      />

      <Container>
        <SectionHeading
          id="problema-title"
          eyebrow={problem.eyebrow}
          title={problem.title}
          lede={problem.lede}
          maxWidth="max-w-3xl"
        />

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Lo que sí hacen bien */}
          <Reveal>
            <div className="rounded-2xl bg-white/[0.02] p-7 ring-1 ring-white/[0.07]">
              <p className="font-mono text-[10.5px] tracking-[0.18em] text-on-dark-soft uppercase">
                {problem.generalPurpose.label}
              </p>
              <p className="mt-2 text-sm text-on-dark-soft/75">
                {problem.generalPurpose.caption}
              </p>
              <ul className="mt-6 space-y-0">
                {problem.generalPurpose.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 border-t border-white/[0.06] py-3 text-[14.5px] text-on-dark first:border-t-0 first:pt-0"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 shrink-0 rounded-full bg-brand-400/60"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* La brecha */}
          <div>
            <p className="font-mono text-[10.5px] tracking-[0.18em] text-spark-300 uppercase">
              {problem.gap.label}
            </p>
            <RevealGroup as="ul" className="mt-6 space-y-0" gap={0.1}>
              {problem.gap.items.map((item, i) => (
                <RevealItem
                  as="li"
                  key={item.title}
                  className="group border-t border-white/[0.08] py-6 first:border-t-0 first:pt-0"
                >
                  <div className="flex gap-5">
                    <span className="mt-1 font-mono text-[11px] text-spark-400/75">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[17px] font-medium text-on-dark">{item.title}</h3>
                      <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-on-dark-soft">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>

        {/* Pregunta bisagra + transición visual */}
        <Reveal className="mt-20 lg:mt-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[clamp(1.3rem,2.9vw,2rem)] leading-[1.25] font-medium text-balance text-on-dark">
              {problem.question}
            </p>
          </div>
          <div className="mt-10 lg:mt-14">
            <FocusTransition />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
