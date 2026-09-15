"use client";
import { useRef, useState } from "react";
import { Container, SectionHeading } from "@/components/ui/Primitives";
import { Icon } from "@/components/ui/Icon";
import { modules } from "@/lib/content";
export function Capabilities() {
  const [index, setIndex] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = modules[index];
  return <section className="modules-section section-space" id="funciones"><Container>
    <div className="split-heading"><SectionHeading eyebrow="Un ecosistema para acompañarte" title="Lo que necesitas, a tu ritmo."/><p>Ocho módulos conectados por una idea: ayudarte a encontrar un pequeño paso que tenga sentido para ti.</p></div>
    <div className="modules-layout"><div className="module-tabs" role="tablist" aria-label="Módulos de Psico Care" aria-orientation="vertical" onKeyDown={event => {
      const next = event.key === "ArrowDown" ? (index + 1) % modules.length : event.key === "ArrowUp" ? (index + modules.length - 1) % modules.length : event.key === "Home" ? 0 : event.key === "End" ? modules.length - 1 : null;
      if (next !== null) { event.preventDefault(); setIndex(next); refs.current[next]?.focus(); }
    }}>{modules.map((m, i) => <button key={m.id} ref={el => { refs.current[i] = el; }} role="tab" id={"tab-" + m.id} aria-controls={"panel-" + m.id} aria-selected={i === index} tabIndex={i === index ? 0 : -1} onClick={() => setIndex(i)}><Icon name={m.icon} size={20}/><span>{m.name}</span><Icon name="arrow" size={16}/></button>)}</div>
    {modules.map((m, i) => <article key={m.id} role="tabpanel" id={"panel-" + m.id} aria-labelledby={"tab-" + m.id} hidden={index !== i} tabIndex={0} className="module-panel">
      <span className="module-status"><span className="status-dot"/>{m.status}</span><span className="module-large-icon"><Icon name={m.icon} size={40}/></span><h3>{m.name}</h3><p>{m.description}</p>
      <div className="module-example"><span>UN MOMENTO EN LA VIDA REAL</span><blockquote>“{m.example}”</blockquote></div>
      <button className="text-action" onClick={() => { window.dispatchEvent(new CustomEvent("psicocare:module", { detail: active.id })); document.getElementById("app-movil")?.scrollIntoView({ behavior: "instant" }); }}>{m.action}<Icon name="arrow" size={18}/></button>
    </article>)}</div>
  </Container></section>;
}
