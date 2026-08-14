import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { difference } from "@/lib/content";
import { cn } from "@/lib/cn";

export function Difference() {
  return (
    <Section tone="white" labelledBy="diferencia-title">
      <Container>
        <SectionHeading
          id="diferencia-title"
          eyebrow={difference.eyebrow}
          title={difference.title}
          lede={difference.lede}
          tone="light"
          align="center"
          maxWidth="max-w-3xl"
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 md:gap-6">
          <Reveal delay={0.05}>
            <ComparisonCard
              label={difference.general.label}
              sub={difference.general.sub}
              points={difference.general.points}
              variant="neutral"
            />
          </Reveal>
          <Reveal delay={0.15}>
            <ComparisonCard
              label={difference.psicocare.label}
              sub={difference.psicocare.sub}
              points={difference.psicocare.points}
              variant="brand"
            />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-12 max-w-2xl text-center text-[15px] leading-relaxed text-on-light-soft">
            {difference.closing}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

function ComparisonCard({
  label,
  sub,
  points,
  variant,
}: {
  label: string;
  sub: string;
  points: readonly string[];
  variant: "neutral" | "brand";
}) {
  const isBrand = variant === "brand";

  return (
    <article
      className={cn(
        "relative h-full overflow-hidden rounded-2xl p-8 md:p-9",
        isBrand
          ? "bg-ink-950 text-on-dark ring-1 ring-brand-600/30"
          : "bg-mist-100 text-on-light ring-1 ring-on-light/[0.06]",
      )}
    >
      {isBrand && (
        <>
          <div
            aria-hidden="true"
            className="absolute top-[-40%] right-[-20%] h-[24rem] w-[24rem] rounded-full bg-brand-600/20 blur-[90px]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-spark-400/60 to-transparent"
          />
        </>
      )}

      <div className="relative">
        <h3
          className={cn(
            "text-[1.35rem] font-semibold",
            isBrand ? "text-on-dark" : "text-on-light",
          )}
        >
          {label}
        </h3>
        <p
          className={cn(
            "mt-1.5 font-mono text-[11px] tracking-[0.12em]",
            isBrand ? "text-spark-300" : "text-on-light-soft",
          )}
        >
          {sub}
        </p>

        <ul className="mt-7 space-y-0">
          {points.map((point) => (
            <li
              key={point}
              className={cn(
                "flex items-start gap-3 border-t py-3.5 text-[14.5px] leading-snug first:border-t-0 first:pt-0",
                isBrand
                  ? "border-white/[0.07] text-on-dark"
                  : "border-on-light/[0.07] text-on-light-soft",
              )}
            >
              {isBrand ? <CheckIcon /> : <DotIcon />}
              {point}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="mt-0.5 h-4 w-4 shrink-0 text-spark-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3.5 8.4 3 3 6-6.8" />
    </svg>
  );
}

function DotIcon() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-on-light/25"
    />
  );
}
