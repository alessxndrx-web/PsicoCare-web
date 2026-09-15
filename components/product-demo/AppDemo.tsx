"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { PhoneFrame } from "./PhoneFrame";
import { HomeScreen } from "./HomeScreen";
import { modules, type ModuleId } from "@/lib/content";
type Screen = "welcome" | "mood" | "home" | ModuleId;
const moods = ["Tranquilo/a", "Feliz", "Ansioso/a", "Triste", "Enojado/a", "Cansado/a"];
const faces = ["◡", "◡", "﹏", "⌢", "⌢", "−"];
export function AppDemo() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [mood, setMood] = useState("");
  const [reflection, setReflection] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  function go(next: Screen) { setStarted(true); setScreen(next); }
  function mark(label: string) { setCompleted(current => current.includes(label) ? current : [...current, label]); }
  useEffect(() => {
    const select = (event: Event) => {
      const id = (event as CustomEvent<ModuleId>).detail;
      if (modules.some(m => m.id === id)) { setStarted(true); setScreen(id); }
    };
    window.addEventListener("psicocare:module", select);
    return () => window.removeEventListener("psicocare:module", select);
  }, []);
  useEffect(() => {
    if (started) content.current?.focus({ preventScroll: true });
    content.current?.scrollTo(0, 0);
  }, [screen, started]);
  const selected = modules.find(m => m.id === screen);
  return <section className="demo-section section-space" id="app-movil"><Container>
    <div className="demo-layout"><div className="demo-copy"><SectionHeading eyebrow="La app, en tus manos" title={<>Conócela por dentro, <br/>antes que nadie.</>}>Descubre cómo un pequeño momento para ti puede convertirse en un primer paso.</SectionHeading>
      <p className="demo-instruction">Esta es una demo interactiva. Elige un módulo o comienza el recorrido desde la bienvenida.</p>
      <div className="demo-selectors" aria-label="Explorar pantallas de la demo">
        <button className={screen === "welcome" ? "selected" : ""} onClick={() => go("welcome")}><span>01</span>Tu primer paso<Icon name="arrow" size={18}/></button>
        <button className={screen === "mood" ? "selected" : ""} onClick={() => go("mood")}><span>02</span>¿Cómo te sientes?<Icon name="arrow" size={18}/></button>
        <button className={screen === "home" || !!selected ? "selected" : ""} onClick={() => go("home")}><span>03</span>Encuentra tu espacio<Icon name="arrow" size={18}/></button>
      </div>
      <div className="demo-module-shortcuts">{modules.map(m => <button key={m.id} aria-pressed={screen === m.id} onClick={() => go(m.id)}>{m.label}</button>)}</div>
      <p className="demo-privacy"><Icon name="lock" size={16}/> Las emociones y reflexiones de la demo se quedan en esta página y desaparecen al recargar. Las conversaciones son ejemplos preparados.</p>
      <span className="outline-tag">Sin registro · Sin descarga</span>
    </div>
    <div className="demo-phone-stage"><div className="demo-stage-caption"><span className="status-dot"/> DEMO INTERACTIVA</div>
      <PhoneFrame className="demo-phone"><div className="app-topbar">
        {screen !== "welcome" ? <button className="icon-button" onClick={() => go(screen === "mood" ? "welcome" : "home")} aria-label="Volver al inicio de la demo"><Icon name="back" size={18}/></button> : <span/>}<Logo/><span className="app-mini-label">DEMO</span>
      </div>
      <div className="demo-screen" key={screen} ref={content} tabIndex={-1} aria-label={selected?.name ?? ({ welcome: "Bienvenida", mood: "Estado emocional", home: "Inicio" } as Record<string, string>)[screen]}>
        {screen === "welcome" && <div className="app-welcome"><span className="app-overline">UN ESPACIO PARA TI</span><h3>Pequeños pasos, <br/><em>grandes comienzos.</em></h3><Image src="/brand/mascots-together.webp" width={285} height={171} alt="Los dos personajes de PsicoCare juntos"/><p>No tienes que tener todas las respuestas. Puedes empezar por cómo te sientes.</p><button className="app-button" onClick={() => go("mood")}>Comenzar <Icon name="arrow" size={17}/></button><small>Una primera capa de acompañamiento. <br/>No sustituye la ayuda profesional.</small></div>}
        {screen === "mood" && <div className="app-mood"><span className="app-overline">EMPECEMOS POR TI</span><h3>¿Cómo te sientes hoy?</h3><p>No hay respuestas incorrectas. <br/>Elige lo que más se acerque.</p><div className="mood-grid">{moods.map((label, i) => <button key={label} aria-pressed={mood === label} onClick={() => setMood(label)}><span className={"mood-face mood-" + i} aria-hidden="true"><b>• •</b><i>{faces[i]}</i></span>{label}</button>)}</div><button className="app-button" disabled={!mood} onClick={() => go("home")}>Continuar <Icon name="arrow" size={17}/></button><button className="app-text-button" onClick={() => go("home")}>Prefiero explorar sin elegir</button></div>}
        {screen === "home" && <HomeScreen onSelect={go} mood={mood}/>}
        {(screen === "conversation" || screen === "simulation") && <Conversation simulation={screen === "simulation"} onComplete={() => mark("Conversación practicada")}/>}
        {screen === "reflection" && <div className="app-detail"><Icon name="book" size={29}/><h3>Un momento para reflexionar</h3><p>¿Qué te llevas de tu día? Puedes escribir una idea o algo que quieras intentar mañana.</p><label htmlFor="demo-reflection">Mi reflexión</label><textarea id="demo-reflection" maxLength={500} value={reflection} onChange={e => setReflection(e.target.value)} placeholder="Hoy me gustaría reconocer…"/><small>Solo en esta demo. No se envía ni se guarda en un servidor.</small><button className="app-button" disabled={!reflection.trim()} onClick={() => mark("Reflexión escrita")}>{completed.includes("Reflexión escrita") ? "Reflexión reconocida ✓" : "Guardar en este recorrido"}</button></div>}
        {screen === "tools" && <Breathing onComplete={() => mark("Pausa completada")}/>}
        {screen === "gradual" && <Gradual onComplete={() => mark("Primer paso elegido")}/>}
        {screen === "progress" && <div className="app-detail"><Icon name="chart" size={28}/><h3>Tu recorrido de hoy</h3><p>Cada pequeño paso cuenta. Aquí solo ves las actividades que has hecho en esta demo.</p>{completed.length ? <ul className="app-progress">{completed.map(c => <li key={c}><Icon name="check" size={16}/>{c}</li>)}</ul> : <><Image src="/brand/mascot-calm.webp" width={92} height={137} alt="Personaje tranquilo de PsicoCare"/><p>Aún no hay actividades completadas. Puedes empezar con una pausa.</p></>}<button className="app-button" onClick={() => go("tools")}>Explorar herramientas</button></div>}
        {screen === "survey" && <div className="app-detail"><Icon name="survey" size={30}/><h3>Tu voz también construye</h3><p>¿Qué herramientas te gustaría encontrar en PsicoCare?</p><div className="app-sample-question"><strong>Una pregunta de nuestra encuesta</strong><p>¿Qué funciones te parecen más valiosas?</p><span>Conversaciones · Reflexiones · Ejercicios</span></div><p>La encuesta real está disponible en esta web para mayores de 18 años. Participar es voluntario.</p><Link className="app-button" href="/encuestas">Ir a la encuesta <Icon name="arrow" size={16}/></Link><small>2–3 minutos · Sin nombre</small></div>}
        {screen === "human" && <div className="app-detail"><Icon name="heart" size={29}/><h3>También hay un paso humano</h3><p>Puedes preparar cómo pedir apoyo a alguien de confianza o buscar atención profesional por tu cuenta.</p><blockquote>“Me gustaría hablar de algo que me está costando. ¿Tienes un momento para escucharme?”</blockquote><p className="app-notice">La red profesional de PsicoCare está en desarrollo. Esta demo no contacta a especialistas ni atiende emergencias.</p><Link href="/seguridad" className="app-button">Conocer los límites</Link></div>}
      </div>
      {screen !== "welcome" && screen !== "mood" && <nav className="app-bottom-nav" aria-label="Navegación de la demo">{[{ id: "home", label: "Inicio", icon: "home" }, { id: "progress", label: "Progreso", icon: "chart" }, { id: "tools", label: "Herramientas", icon: "wind" }].map(item => <button key={item.id} className={screen === item.id ? "active" : ""} aria-current={screen === item.id ? "page" : undefined} onClick={() => go(item.id as Screen)}><Icon name={item.icon} size={19}/>{item.label}</button>)}</nav>}
      </PhoneFrame><p className="demo-phone-footnote">Diseño inspirado en la interfaz oficial de PsicoCare.</p>
    </div></div>
  </Container></section>;
}
function Conversation({ simulation, onComplete }: { simulation: boolean; onComplete: () => void }) {
  const [choice, setChoice] = useState("");
  const [done, setDone] = useState(false);
  return <div className="app-detail"><span className="app-overline">{simulation ? "SIMULACIÓN SOCIAL" : "CONVERSACIÓN GUIADA"}</span><h3>Practiquemos juntos.</h3><span className="app-example-tag">Conversación de ejemplo</span><div className="chat-bubble user">Mañana tengo una entrevista y estoy nervioso.</div><div className="chat-bubble">Podemos practicarla juntos. ¿Quieres empezar con preguntas sencillas o simular una entrevista completa?</div>
    {!choice ? <div className="chat-choices">{["Preguntas sencillas", "Simular la entrevista"].map(c => <button key={c} onClick={() => setChoice(c)}>{c}<Icon name="arrow" size={15}/></button>)}</div> : <><div className="chat-bubble user">{choice}</div><div className="chat-bubble">{choice === "Preguntas sencillas" ? "Empecemos con algo pequeño: ¿qué te gustaría que conocieran de ti?" : "Imagina que acabas de llegar. Te doy la bienvenida y pregunto: ¿qué te interesa de esta oportunidad?"}</div><p>Piensa tu respuesta. Puedes hacer una pausa cuando lo necesites.</p><button className="app-button" onClick={() => { setDone(true); onComplete(); }}>{done ? "Práctica completada ✓" : "Terminar esta práctica"}</button>{done && <p role="status">Dar este primer paso también cuenta.</p>}</>}
  </div>;
}
function Breathing({ onComplete }: { onComplete: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);
  useEffect(() => { if (seconds >= 30 && running) { setRunning(false); onComplete(); } }, [seconds, running, onComplete]);
  const finished = seconds >= 30;
  return <div className="app-detail breathing-detail"><span className="app-overline">UNA PAUSA PARA TI</span><h3>Vuelve a este momento.</h3><p>Respira con naturalidad. Si te resulta cómodo, acompaña el ritmo del círculo.</p><div className={"breathing-circle " + (running ? "breathing-active" : "")}><span>{finished ? "Lo hiciste" : running ? (seconds % 10 < 4 ? "Inhala" : "Exhala") : "A tu ritmo"}<small>{Math.min(seconds, 30)} / 30 segundos</small></span></div><p>No fuerces la respiración. Puedes detener el ejercicio cuando quieras.</p><button className="app-button" onClick={() => { if (finished) setSeconds(0); setRunning(!running); }}>{finished ? "Repetir la pausa" : running ? "Pausar" : seconds ? "Continuar" : "Comenzar la pausa"}</button>{finished && <p role="status">Pausa completada. Gracias por dedicarte este momento.</p>}</div>;
}
function Gradual({ onComplete }: { onComplete: () => void }) {
  const [level, setLevel] = useState(0);
  return <div className="app-detail"><Icon name="steps" size={30}/><h3>Un paso a la vez.</h3><p>Ejemplo: presentarte a un grupo. Elige un paso que hoy te resulte manejable.</p><div className="gradual-options">{["Preparar una frase para saludar", "Decirla en voz alta a solas", "Practicar con alguien de confianza"].map((text, i) => <button key={text} aria-pressed={level === i + 1} onClick={() => { setLevel(i + 1); onComplete(); }}><span>{i + 1}</span>{text}</button>)}</div>{level > 0 && <p role="status">Tu primer paso está elegido. Tú decides cuándo intentarlo.</p>}<small>Práctica cotidiana de ejemplo. No es un tratamiento ni un plan de exposición clínica.</small></div>;
}
