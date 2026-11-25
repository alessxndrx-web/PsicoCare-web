import type { ReactNode } from "react";
import Link from "next/link";
/**
 * Minimal Markdown for editorial articles: ## / ### headings, paragraphs, "- " lists, **bold** and
 * [links](url). Renders React elements only (no HTML injection), so article files cannot add markup.
 */
function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = []; const re = /\*\*(.+?)\*\*|\[(.+?)\]\(((?:https:\/\/|\/)[^)\s]*)\)/g;
  let last = 0; let m: RegExpExecArray | null; let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={key + i++}>{m[1]}</strong>);
    else out.push(m[3].startsWith("/") ? <Link key={key + i++} href={m[3]}>{m[2]}</Link> : <a key={key + i++} href={m[3]} rel="noopener" target="_blank">{m[2]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
export function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  return <>{blocks.map((block, i) => {
    const k = "b" + i;
    if (block.startsWith("### ")) return <h3 key={k}>{inline(block.slice(4), k)}</h3>;
    if (block.startsWith("## ")) return <h2 key={k}>{inline(block.slice(3), k)}</h2>;
    if (block.split("\n").every(l => l.startsWith("- "))) return <ul key={k}>{block.split("\n").map((l, j) => <li key={j}>{inline(l.slice(2), k + j)}</li>)}</ul>;
    return <p key={k}>{inline(block.replace(/\n/g, " "), k)}</p>;
  })}</>;
}
