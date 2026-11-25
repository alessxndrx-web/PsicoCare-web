import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentPage, formatDate } from "@/components/layout/DocumentPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { publishedPosts } from "@/lib/blog";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";
const path = "/blog";
const title = "Blog: bienestar emocional, IA y salud mental";
const description = "Artículos de Psico Care sobre bienestar emocional, uso responsable de la inteligencia artificial y salud mental en jóvenes, con autoría, fechas y referencias verificables.";
export const metadata: Metadata = pageMetadata({ title, description, path });
/** The index only exists once at least one reviewed article is published: no empty pages. */
export default function Page() {
  const posts = publishedPosts();
  if (!posts.length) notFound();
  return <>
    <JsonLd nodes={[webPageSchema({ path, name: title, description, type: "CollectionPage", updated: posts[0].updated }), breadcrumbSchema([{ name: "Blog", path }])]}/>
    <DocumentPage eyebrow="Blog" title="Ideas para cuidarte, con fuentes." lead={description}>
      {posts.map(p => <section key={p.slug}><h2><Link href={`/blog/${p.slug}`}>{p.title}</Link></h2><p>{p.description}</p><p className="document-updated" style={{ margin: 0 }}>{p.author} · <time dateTime={p.published}>{formatDate(p.published)}</time></p></section>)}
    </DocumentPage>
  </>;
}
