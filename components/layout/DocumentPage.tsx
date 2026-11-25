import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/Primitives";
export function DocumentPage({ eyebrow, title, lead, updated, children }: { eyebrow: string; title: string; lead: string; updated?: string; children: ReactNode }) {
  return <article className="document-page"><Container><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p className="document-lead">{lead}</p>
    {updated && <p className="document-updated">Actualizado el <time dateTime={updated}>{formatDate(updated)}</time></p>}
    <div className="document-content">{children}</div></Container></article>;
}
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export function formatDate(iso: string) { const [y, m, d] = iso.split("-").map(Number); return `${d} de ${MONTHS[m - 1]} de ${y}`; }
