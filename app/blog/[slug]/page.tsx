import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentPage, formatDate } from "@/components/layout/DocumentPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { Markdown } from "@/components/seo/Markdown";
import { publishedPosts } from "@/lib/blog";
import { absoluteUrl, breadcrumbSchema, pageMetadata } from "@/lib/seo";
/** Published articles are prerendered; any other slug (drafts included) resolves to a 404. */
export function generateStaticParams() {
  return publishedPosts().map(p => ({ slug: p.slug }));
}
const find = async (params: Promise<{ slug: string }>) => { const { slug } = await params; return publishedPosts().find(p => p.slug === slug); };
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await find(params);
  return post ? pageMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}`, type: "article" }) : { robots: { index: false } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const post = await find(params);
  if (!post) notFound();
  const url = `/blog/${post.slug}`;
  const article = {
    "@type": "Article", headline: post.title, description: post.description, inLanguage: "es", mainEntityOfPage: absoluteUrl(url),
    datePublished: post.published, dateModified: post.updated, author: { "@type": "Organization", name: post.author },
    publisher: { "@id": absoluteUrl("/") + "#organization" },
    ...(post.reviewedBy ? { reviewedBy: { "@type": "Person", name: post.reviewedBy } } : {}),
    citation: post.references.map(r => r.url),
  };
  return <>
    <JsonLd nodes={[article, breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: post.title, path: url }])]}/>
    <DocumentPage eyebrow="Blog" title={post.title} lead={post.description}>
      <p className="document-updated" style={{ margin: "0 0 24px" }}>Por {post.author}{post.reviewedBy ? ` · Revisado por ${post.reviewedBy}` : ""} · Publicado el <time dateTime={post.published}>{formatDate(post.published)}</time>{post.updated !== post.published && <> · Actualizado el <time dateTime={post.updated}>{formatDate(post.updated)}</time></>}</p>
      <Markdown source={post.body}/>
      {post.references.length > 0 && <><h2>Referencias</h2><ul className="references">{post.references.map(r => <li key={r.url}><a href={r.url} rel="noopener" target="_blank">{r.label}</a></li>)}</ul></>}
    </DocumentPage>
  </>;
}
