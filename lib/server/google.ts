import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
export const OAUTH_STATE_COOKIE = "pc_oauth";
export const googleConfigured = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export function callbackUrl() { return new URL("/api/auth/google/callback", process.env.SITE_URL ?? "http://localhost:3000").toString(); }

function sign(value: string) { return createHmac("sha256", process.env.GOOGLE_CLIENT_SECRET!).update(value).digest("hex"); }
/** Binds the pending response to a nonce so the callback cannot be replayed or retargeted. */
export function createState(responseId: string) {
  const payload = `${randomBytes(16).toString("hex")}.${responseId}.${Date.now() + 10 * 60 * 1000}`;
  return `${payload}.${sign(payload)}`;
}
export function readState(cookie: string | undefined, received: string | undefined) {
  if (!cookie || !received || cookie !== received) return null;
  const [nonce, responseId, expiry, signature, extra] = cookie.split(".");
  if (extra || !nonce || !responseId || !/^\d{13}$/.test(expiry ?? "") || !signature) return null;
  if (Number(expiry) <= Date.now()) return null;
  const expected = sign(`${nonce}.${responseId}.${expiry}`);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return responseId;
}
export function authorizeUrl(state: string) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
  url.searchParams.set("redirect_uri", callbackUrl());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}
/** Exchanges the code server-to-server; the id_token arrives over TLS straight from Google. */
export async function exchangeCode(code: string): Promise<{ email: string; verified: boolean } | null> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, redirect_uri: callbackUrl(), grant_type: "authorization_code" }),
  });
  if (!response.ok) return null;
  const token = (await response.json()) as { id_token?: string };
  const segment = token.id_token?.split(".")[1];
  if (!segment) return null;
  try {
    const claims = JSON.parse(Buffer.from(segment, "base64url").toString("utf8")) as { email?: string; email_verified?: boolean | string; aud?: string };
    if (claims.aud !== process.env.GOOGLE_CLIENT_ID || !claims.email) return null;
    return { email: String(claims.email).toLowerCase(), verified: claims.email_verified === true || claims.email_verified === "true" };
  } catch { return null; }
}
