/**
 * Decides what audience measurement may report.
 * Kept apart from the component so the privacy-critical rule can be tested.
 */
export function publicEvent<T extends { url: string }>(event: T): T | null {
  let url: URL;
  try { url = new URL(event.url); } catch { return null; }
  // The internal panel is never reported.
  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) return null;
  // Query strings can carry flow markers such as ?correo=ok, so they are dropped.
  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
}
