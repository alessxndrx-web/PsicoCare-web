import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/Primitives";
export function DocumentPage({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead: string; children: ReactNode }) {
  return <article className="document-page"><Container><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p className="document-lead">{lead}</p><div className="document-content">{children}</div></Container></article>;
}
