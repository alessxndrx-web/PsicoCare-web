import { NextResponse } from "next/server";
import { getSurvey, readResponse } from "@/lib/surveys/repository";
import { surveyIsOpen } from "@/lib/surveys/validation";
import { SURVEY_SLUG } from "@/lib/surveys/types";
import { cookieOptions, hash, session } from "@/lib/server/security";
import { authorizeUrl, createState, googleConfigured, OAUTH_STATE_COOKIE } from "@/lib/server/google";
export const runtime = "nodejs";
const back = (reason: string) => NextResponse.redirect(new URL(`/encuestas/${SURVEY_SLUG}?correo=${reason}`, process.env.SITE_URL ?? "http://localhost:3000"));
export async function GET() {
  if (!googleConfigured()) return back("no-disponible");
  const survey = await getSurvey(SURVEY_SLUG);
  if (!survey || !surveyIsOpen(survey)) return back("no-disponible");
  const token = await session();
  const response = token ? await readResponse(survey, hash(token)) : null;
  if (!response) return back("sin-sesion");
  const state = createState(response.id);
  const redirect = NextResponse.redirect(authorizeUrl(state));
  // Lax: the cookie must survive Google's cross-site redirect back to the callback.
  redirect.cookies.set(OAUTH_STATE_COOKIE, state, { ...cookieOptions, sameSite: "lax", maxAge: 600 });
  return redirect;
}
