import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { saveParticipant } from "@/lib/surveys/repository";
import { SURVEY_SLUG } from "@/lib/surveys/types";
import { cookieOptions, rateLimit } from "@/lib/server/security";
import { exchangeCode, googleConfigured, OAUTH_STATE_COOKIE, readState } from "@/lib/server/google";
export const runtime = "nodejs";
const target = (reason: string) => new URL(`/encuestas/${SURVEY_SLUG}?correo=${reason}`, process.env.SITE_URL ?? "http://localhost:3000");
function finish(reason: string) {
  const redirect = NextResponse.redirect(target(reason));
  redirect.cookies.set(OAUTH_STATE_COOKIE, "", { ...cookieOptions, sameSite: "lax", maxAge: 0 });
  return redirect;
}
export async function GET(request: Request) {
  if (!googleConfigured()) return finish("no-disponible");
  try {
    const url = new URL(request.url);
    if (url.searchParams.get("error")) return finish("cancelado");
    const stored = (await cookies()).get(OAUTH_STATE_COOKIE)?.value;
    const responseId = readState(stored, url.searchParams.get("state") ?? undefined);
    const code = url.searchParams.get("code");
    if (!responseId || !code) return finish("error");
    await rateLimit(`google:${responseId}`, 10);
    const account = await exchangeCode(code);
    if (!account) return finish("error");
    if (!account.verified) return finish("sin-verificar");
    await saveParticipant(responseId, account.email, "google");
    return finish("ok");
  } catch { return finish("error"); }
}
