import { Container } from "@/components/ui/Primitives";
import { Logo } from "@/components/ui/Logo";
import { footer, nav } from "@/lib/content";

export function Footer() {
  const year = 2026;

  return (
    <footer className="relative border-t border-white/[0.07] bg-ink-950 pt-16 pb-10">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-[15px] leading-snug font-medium text-on-dark">
              {footer.tagline}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 font-mono text-[10.5px] tracking-[0.16em] text-on-dark-soft uppercase ring-1 ring-white/[0.08]">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-400" />
              {footer.event}
            </span>
          </div>

          <nav aria-label="Navegación del pie de página">
            <h2 className="font-mono text-[10.5px] tracking-[0.18em] text-on-dark-soft/75 uppercase">
              Secciones
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-12 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[14px] text-on-dark-soft transition-colors duration-300 hover:text-on-dark"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Aviso de alcance — importante y visible */}
        <div className="mt-14 rounded-xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06]">
          <p className="max-w-3xl text-[12.5px] leading-relaxed text-on-dark-soft">
            {footer.disclaimer}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] text-on-dark-soft/75">
            © {year} PsicoCare. Proyecto en desarrollo.
          </p>
          <p className="font-mono text-[10.5px] tracking-[0.16em] text-on-dark-soft/75 uppercase">
            Nicaragua
          </p>
        </div>
      </Container>
    </footer>
  );
}
