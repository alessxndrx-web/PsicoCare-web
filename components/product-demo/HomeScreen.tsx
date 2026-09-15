import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { modules, type ModuleId } from "@/lib/content";
export function HomeScreen({ onSelect, mood }: { onSelect: (id: ModuleId) => void; mood?: string }) {
  return <div className="app-home"><div className="app-greeting"><span>Qué bueno tenerte aquí.</span><h3>Hoy, a tu ritmo <span aria-hidden="true">✳</span></h3></div>
    <div className="app-wellbeing"><p>Tu bienestar <br/><em>importa.</em></p><Image src="/brand/mascots-together.webp" width={265} height={159} alt="Los personajes de PsicoCare se acompañan" priority /></div>
    <div className="app-section-label"><strong>¿Por dónde empezamos?</strong>{mood && <span>{mood}</span>}</div>
    <div className="app-module-grid">{modules.filter(m => !["progress", "gradual"].includes(m.id)).map(m => <button key={m.id} onClick={() => onSelect(m.id)}><Icon name={m.icon} size={21}/><span>{m.label}</span><span aria-hidden="true">›</span></button>)}</div>
    <div className="app-tip"><Icon name="heart" size={17}/><span>No tienes que resolverlo todo hoy.</span></div>
  </div>;
}
