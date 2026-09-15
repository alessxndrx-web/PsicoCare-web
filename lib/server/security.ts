import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DatabaseNotConfigured, one, query } from "../database";

export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
export const SESSION_COOKIE = "pc_participation";
/** Secure follows the real scheme: a Secure cookie is dropped over plain HTTP. */
const secureCookies = process.env.SITE_URL
  ? process.env.SITE_URL.startsWith("https://")
  : process.env.NODE_ENV === "production";
export const cookieOptions = { httpOnly: true, sameSite: "strict" as const, secure: secureCookies, path: "/" };
export function hash(value: string) { return createHash("sha256").update(value).digest("hex"); }
export function newSession() { return randomBytes(32).toString("hex"); }
export async function session() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}
export function assertOrigin(request: Request) {
  const expected = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : new URL(request.url).origin;
  if (process.env.NODE_ENV === "production" && !process.env.SITE_URL) throw new HttpError(503, "El servicio está pendiente de configuración.");
  if (request.headers.get("origin") !== expected) throw new HttpError(403, "No se permite esta solicitud.");
}
export async function readJson(request: Request, maxBytes = 16000): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new HttpError(415, "Usa el formato JSON.");
  if (Number(request.headers.get("content-length")) > maxBytes) throw new HttpError(413, "El formulario es demasiado grande.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Falta el formulario.");
  let size = 0; const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.length;
    if (size > maxBytes) { await reader.cancel(); throw new HttpError(413, "El formulario es demasiado grande."); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new HttpError(400, "El formulario no es válido."); }
}
export async function rateLimit(key: string, max: number, windowMs = 60000) {
  const now = Date.now();
  await query("DELETE FROM rate_limits WHERE expires_at <= $1", [now]);
  const row = await one<{ hits: number }>(
    "INSERT INTO rate_limits (key, hits, expires_at) VALUES ($1, 1, $2) ON CONFLICT (key) DO UPDATE SET hits = rate_limits.hits + 1 RETURNING hits",
    [hash(key), now + windowMs]);
  if (Number(row?.hits) > max) throw new HttpError(429, "Hay demasiados intentos. Espera unos minutos y vuelve a intentarlo.");
}
export function json(data: unknown, status = 200) { return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } }); }
export function apiError(error: unknown) {
  if (error instanceof HttpError) { const response = json({ error: error.message }, error.status); if (error.status === 429) response.headers.set("Retry-After", "60"); return response; }
  if (error instanceof DatabaseNotConfigured) return json({ error: "El servicio está pendiente de configuración." }, 503);
  console.error("Psico Care request failed", error instanceof Error ? error.name : "unknown");
  return json({ error: "No pudimos guardar la información. Inténtalo de nuevo en unos momentos." }, 503);
}
