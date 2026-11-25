import { JsonLd } from "./JsonLd";
import { breadcrumbSchema, routeUpdated, webPageSchema } from "@/lib/seo";
type PageType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
/** WebPage (or a subtype) plus BreadcrumbList for a page directly under the homepage. */
export function PageSchema({ path, name, description, type = "WebPage", extra = [] }: { path: string; name: string; description: string; type?: PageType; extra?: Record<string, unknown>[] }) {
  return <JsonLd nodes={[webPageSchema({ path, name, description, type, updated: routeUpdated(path) }), breadcrumbSchema([{ name, path }]), ...extra]}/>;
}
