export const CONSENT_COOKIE = "pc_privacy";
export const CONSENT_VERSION = "2026-10-v1";
export const CONSENT_SECONDS = 180 * 24 * 60 * 60;
export type PrivacyConsent = { version: string; analytics: boolean; updatedAt: number };
export function parseConsent(value: string | undefined, now = Date.now()): PrivacyConsent | null {
  try { const c = JSON.parse(decodeURIComponent(value ?? ""));
    if (c.version !== CONSENT_VERSION || typeof c.analytics !== "boolean" || typeof c.updatedAt !== "number" || c.updatedAt > now || now-c.updatedAt >= CONSENT_SECONDS*1000) return null;
    return { version: c.version, analytics: c.analytics, updatedAt: c.updatedAt };
  } catch { return null; }
}
export function readConsent(): PrivacyConsent | null {
  if (typeof document === "undefined") return null;
  return parseConsent(document.cookie.split("; ").find(c=>c.startsWith(CONSENT_COOKIE+"="))?.slice(CONSENT_COOKIE.length+1));
}
export function saveConsent(analytics: boolean): PrivacyConsent {
  const c = { version: CONSENT_VERSION, analytics, updatedAt: Date.now() };
  document.cookie = CONSENT_COOKIE+"="+encodeURIComponent(JSON.stringify(c))+"; Path=/; Max-Age="+CONSENT_SECONDS+"; SameSite=Lax"+(location.protocol==="https:"?"; Secure":"");
  return c;
}
