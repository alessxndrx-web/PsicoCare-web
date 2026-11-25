import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import { jsonLd, mobileApplicationSchema, organizationSchema, publicRoutes, websiteSchema } from "../lib/seo";
import { parsePost, publicationBlocker, allPosts, publishedPosts } from "../lib/blog";

test("the sitemap lists public pages only, each with a real page file and date", () => {
  const urls = sitemap().map(e => new URL(e.url).pathname);
  assert.ok(urls.includes("/") && urls.includes("/neuroia"));
  for (const u of urls) assert.ok(!u.startsWith("/admin") && !u.startsWith("/api"), u);
  assert.equal(new Set(urls).size, urls.length, "duplicated URLs");
  for (const r of publicRoutes) {
    assert.ok(existsSync(r.path === "/" ? "app/page.tsx" : `app${r.path}/page.tsx`), `missing page for ${r.path}`);
    assert.match(r.updated, /^\d{4}-\d{2}-\d{2}$/);
  }
});
test("robots keeps private areas out and points to the sitemap", () => {
  const r = robots();
  const rules = Array.isArray(r.rules) ? r.rules[0] : r.rules;
  assert.deepEqual(rules.disallow, ["/admin/", "/api/"]);
  assert.match(String(r.sitemap), /\/sitemap\.xml$/);
});
test("structured data declares no ratings, reviews, user counts or certifications", () => {
  const text = jsonLd(organizationSchema(), websiteSchema(), mobileApplicationSchema());
  for (const banned of ["aggregateRating", "review", "award", "userInteractionCount", "hasCredential", "memberOf", "certification"]) assert.ok(!text.includes(banned), banned);
  const graph = JSON.parse(text)["@graph"];
  assert.equal(graph[0]["@type"], "Organization");
  assert.ok(!text.includes("</script"), "must not be able to close the script element");
});
test("unreviewed health articles can never be published", () => {
  const draft = parsePost("x", "---\ntitulo: T\ndescripcion: D\nstatus: publicado\nautor: Equipo\nrevision_clinica: requerida\npublicado: 2026-11-24\n---\nCuerpo");
  assert.equal(publicationBlocker(draft), "requiere revisión de un profesional cualificado");
  assert.equal(publicationBlocker({ ...draft, reviewedBy: "Nombre Real, Psicóloga" }), null);
  assert.equal(publicationBlocker({ ...draft, status: "borrador", reviewedBy: "X" }), "es un borrador");
  assert.equal(publicationBlocker({ ...draft, published: undefined, reviewedBy: "X" }), "falta la fecha real de publicación");
});
test("the repository drafts parse and none is published yet", () => {
  const posts = allPosts();
  assert.ok(posts.length >= 2);
  for (const p of posts) { assert.ok(p.title && p.description, p.slug); assert.ok(p.references.every(r => r.url.startsWith("https://")), p.slug); }
  assert.equal(publishedPosts().length, 0);
});
test("llms.txt only links to pages that exist", () => {
  const links = [...readFileSync("public/llms.txt", "utf8").matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(m => new URL(m[1]).pathname);
  const known = new Set(publicRoutes.map(r => r.path));
  for (const l of links) assert.ok(known.has(l), l);
});
