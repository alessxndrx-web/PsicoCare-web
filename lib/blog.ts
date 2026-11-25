import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Editorial articles live in content/blog/<slug>.md with a small front matter block.
 * Health content rules (enforced here, not by convention):
 * - only `status: publicado` is routed, listed in the sitemap or linked;
 * - an article with `revision_clinica: requerida` is never published without `revisado_por`
 *   naming the real qualified reviewer;
 * - author, publication and update dates are mandatory for a published article.
 * Drafts stay in the repository for review and are not reachable on the site.
 */
export type Post = {
  slug: string; title: string; description: string; status: "borrador" | "publicado";
  author: string; reviewedBy?: string; clinicalReview: "requerida" | "no-requerida";
  published?: string; updated?: string; references: { label: string; url: string }[]; body: string;
};
export type PublishedPost = Post & { published: string; updated: string };

const DIR = path.join(process.cwd(), "content", "blog");

export function parsePost(slug: string, raw: string): Post {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`Artículo ${slug}: falta el bloque de metadatos`);
  const meta: Record<string, string> = {}; const references: Post["references"] = [];
  for (const line of match[1].split(/\r?\n/)) {
    const ref = /^\s*-\s*\[(.+?)\]\((https:\/\/[^)\s]+)\)\s*$/.exec(line);
    if (ref) { references.push({ label: ref[1], url: ref[2] }); continue; }
    const kv = /^(\w+):\s*(.*)$/.exec(line);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  const status = meta.status === "publicado" ? "publicado" : "borrador";
  const clinicalReview = meta.revision_clinica === "no-requerida" ? "no-requerida" : "requerida";
  return {
    slug, title: meta.titulo ?? slug, description: meta.descripcion ?? "", status, author: meta.autor ?? "",
    reviewedBy: meta.revisado_por || undefined, clinicalReview, published: meta.publicado || undefined,
    updated: meta.actualizado || meta.publicado || undefined, references, body: match[2].trim(),
  };
}

/** Returns why a post cannot be published, or null when it may be. */
export function publicationBlocker(post: Post): string | null {
  if (post.status !== "publicado") return "es un borrador";
  if (!post.author) return "falta el autor real";
  if (!post.published || !/^\d{4}-\d{2}-\d{2}$/.test(post.published)) return "falta la fecha real de publicación";
  if (post.clinicalReview === "requerida" && !post.reviewedBy) return "requiere revisión de un profesional cualificado";
  if (!post.description) return "falta la descripción";
  return null;
}

export function allPosts(): Post[] {
  let files: string[] = [];
  try { files = readdirSync(DIR).filter(f => f.endsWith(".md")); } catch { return []; }
  return files.map(f => parsePost(f.replace(/\.md$/, ""), readFileSync(path.join(DIR, f), "utf8")));
}
export function publishedPosts(): PublishedPost[] {
  return allPosts().filter((p): p is PublishedPost => publicationBlocker(p) === null)
    .sort((a, b) => b.published.localeCompare(a.published));
}
