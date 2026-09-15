import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Primitives";
export function Footer() {
  return <footer className="site-footer"><Container>
    <div className="footer-top"><div><Link href="/" aria-label="PsicoCare — inicio"><Logo/></Link><p>Un pequeño paso también cuenta.</p><span className="muted">Hecho con propósito, desde Nicaragua.</span></div>
    <div><p className="footer-label">EXPLORA</p><Link href="/#producto">El producto</Link><Link href="/#app-movil">Demo de la app</Link><Link href="/encuestas">Participa en la encuesta</Link></div>
    <div><p className="footer-label">CONÓCENOS</p><Link href="/nosotros">Nosotros</Link><Link href="/educacion">PsicoCare Educación</Link><Link href="/#contacto">Contacto</Link></div>
    <div><p className="footer-label">CONFIANZA</p><Link href="/seguridad">Seguridad y privacidad</Link><Link href="/tecnologia">Tecnología y desarrollo</Link><Link href="/privacidad">Datos y consentimiento</Link></div></div>
    <div className="footer-disclaimer"><span aria-hidden="true">♡</span> PsicoCare no diagnostica ni sustituye la atención de un profesional. No es un servicio de emergencia. Si estás en peligro inmediato, contacta a los servicios de emergencia de tu localidad o a una persona de confianza.</div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} PsicoCare</span><span>Tu bienestar importa.</span><span>Aplicación en desarrollo</span></div>
  </Container></footer>;
}
