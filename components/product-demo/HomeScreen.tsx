import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { modules, type ModuleId } from "@/lib/content";
/** `titleAs="p"` keeps the hero preview out of the page outline, which has no h2 yet at that point. */
export function HomeScreen({ onSelect, mood, titleAs: Title = "h3" }: { onSelect: (id: ModuleId) => void; mood?: string; titleAs?: "h3" | "p" }) {
  return <div className="app-home"><div className="app-greeting"><span>Qué bueno tenerte aquí.</span><Title className="app-greeting-title">Hoy, a tu ritmo <span aria-hidden="true">✳</span></Title></div>
    <div className="app-wellbeing"><p>Tu bienestar <br/><em>importa.</em></p><Image src="/brand/mascots-together.webp" width={265} height={159} alt="Los personajes de Psico Care se acompañan" priority /></div>
    <div className="app-section-label"><strong>¿Por dónde empezamos?</strong>{mood && <span>{mood}</span>}</div>
    <div className="app-module-grid">{modules.filter(m => !["progress", "gradual"].includes(m.id)).map(m => <button key={m.id} onClick={() => onSelect(m.id)}><Icon name={m.icon} size={21}/><span>{m.label}</span><span aria-hidden="true">›</span></button>)}</div>
    <div className="app-tip"><Icon name="heart" size={17}/><span>No tienes que resolverlo todo hoy.</span></div>
  </div>;
}
