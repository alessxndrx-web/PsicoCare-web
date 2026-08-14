import { ButtonLink, Container } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Particles } from "@/components/visuals/Particles";
import { finalCta } from "@/lib/content";

export function FinalCta() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-title"
      className="relative isolate overflow-hidden bg-ink-950 py-28 md:py-36"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <div className="bg-grid mask-fade absolute inset-0 opacity-70" />
        <div className="absolute bottom-[-45%] left-1/2 h-[46rem] w-[70rem] -translate-x-1/2 rounded-full bg-brand-700/22 blur-[150px]" />
        <div className="animate-drift absolute top-[6%] left-[12%] h-[24rem] w-[24rem] rounded-full bg-spark-500/10 blur-[110px]" />
      </div>
      <Particles className="-z-10" count={18} />

      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2
            id="cta-title"
            className="text-[clamp(1.9rem,5vw,3.4rem)] leading-[1.08] font-semibold text-balance text-on-dark"
          >
            {finalCta.title}
          </h2>
          <p className="text-gradient mt-3 text-[clamp(1.9rem,5vw,3.4rem)] leading-[1.08] font-semibold text-balance">
            {finalCta.subtitle}
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={finalCta.primary.href}>{finalCta.primary.label}</ButtonLink>
            <ButtonLink href={finalCta.secondary.href} variant="ghost">
              {finalCta.secondary.label}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
