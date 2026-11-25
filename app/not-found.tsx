import type { Metadata } from "next";
import Link from "next/link";
import { DocumentPage } from "@/components/layout/DocumentPage";
import { ButtonLink } from "@/components/ui/Primitives";
export const metadata: Metadata = { title: "Página no encontrada", robots: { index: false, follow: true } };
export default function NotFound() { return <DocumentPage eyebrow="Un pequeño desvío" title="Este espacio no está aquí." lead="La página que buscas no existe o cambió de dirección."><ButtonLink href="/">Volver a Psico Care</ButtonLink><p className="document-updated" style={{ margin: "28px 0 0" }}>También puedes conocer <Link href="/neuroia">NeuroIA</Link>, <Link href="/educacion">Psico Care Educación</Link> o <Link href="/seguridad">nuestros límites y privacidad</Link>.</p></DocumentPage>; }
