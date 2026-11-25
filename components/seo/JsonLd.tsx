import { jsonLd } from "@/lib/seo";
type Node = Parameters<typeof jsonLd>[0];
/** Server-rendered JSON-LD, present in the initial HTML for crawlers. */
export function JsonLd({ nodes }: { nodes: Node[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(...nodes) }}/>;
}
