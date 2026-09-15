"use client";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Container, Eyebrow } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { PhoneFrame } from "@/components/product-demo/PhoneFrame";
import { HomeScreen } from "@/components/product-demo/HomeScreen";
import { Logo } from "@/components/ui/Logo";
export function Hero() {
  return <section className="hero" id="inicio"><Container>
    <div className="hero-grid"><div className="hero-copy"><Eyebrow>Acompañamiento emocional para jóvenes</Eyebrow>
      <h1>Tu bienestar<br/><span>importa.</span></h1>
      <p className="hero-lead">Un espacio para hablar, practicar<br className="desktop-break"/> y entender mejor lo que sientes.</p>
      <p className="hero-description">Conoce la aplicación que estamos construyendo para acompañarte con conversaciones guiadas, reflexiones y herramientas. Un pequeño paso a la vez.</p>
      <div className="button-row"><ButtonLink href="#app-movil">Explorar PsicoCare</ButtonLink><Link className="watch-link" href="#producto"><span><Icon name="play" size={14}/></span>Ver cómo funciona</Link></div>
      <div className="hero-note"><Icon name="shield" size={18}/><p>PsicoCare no diagnostica ni sustituye<br/>la atención de un profesional.</p></div>
    </div>
    <div className="hero-product"><div className="product-orbit" aria-hidden="true"/><div className="hero-product-label"><span className="status-dot"/> ASÍ SE SIENTE PSICOCARE</div>
      <div className="hero-phone-wrap"><PhoneFrame><div className="app-topbar"><Logo/><span className="app-avatar" aria-hidden="true"><Icon name="heart" size={17}/></span></div><HomeScreen onSelect={(id) => { window.dispatchEvent(new CustomEvent("psicocare:module", { detail: id })); document.getElementById("app-movil")?.scrollIntoView({ behavior: "instant" }); }}/><div className="app-bottom-nav" aria-hidden="true"><span className="active"><Icon name="home" size={19}/>Inicio</span><span><Icon name="chart" size={19}/>Progreso</span><span><Icon name="steps" size={19}/>Herramientas</span></div></PhoneFrame></div>
      <div className="hero-quote"><span className="quote-icon"><Icon name="chat" size={20}/></span><div>Todo empieza por ti.<small>Sin juicios. A tu ritmo.</small></div></div>
      <Image className="hero-mascot" src="/brand/mascot-tangled.webp" width={155} height={206} alt="Personaje enredado de PsicoCare: los pensamientos complejos también tienen espacio" priority/>
      <span className="hero-preview-caption">Vista previa interactiva · App en desarrollo</span>
    </div></div>
    <div className="hero-strip"><span>Un espacio, muchas formas de cuidarte.</span><div><span><Icon name="chat" size={18}/>Habla</span><span><Icon name="book" size={18}/>Reflexiona</span><span><Icon name="wind" size={18}/>Respira</span><span><Icon name="steps" size={18}/>Practica</span></div><a href="#producto" aria-label="Descubrir el producto">↓</a></div>
  </Container></section>;
}
