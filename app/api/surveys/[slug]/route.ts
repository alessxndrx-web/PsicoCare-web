import { getSurvey, readParticipant, readResponse, saveResponse, startResponse, withdrawResponse } from "@/lib/surveys/repository";
import { saveSchema, startSchema, surveyIsOpen } from "@/lib/surveys/validation";
import { apiError, assertOrigin, cookieOptions, hash, HttpError, json, newSession, rateLimit, readJson, session, SESSION_COOKIE } from "@/lib/server/security";
export const runtime = "nodejs";
type Context = { params: Promise<{ slug: string }> };
async function surveyFor(context: Context) {
  const { slug } = await context.params;
  const survey = await getSurvey(slug);
  if (!survey || !surveyIsOpen(survey)) throw new HttpError(404, "Esta encuesta no está disponible.");
  return survey;
}
export async function GET(_request: Request, context: Context) {
  try {
    const survey = await surveyFor(context); const token = await session();
    const response = token ? await readResponse(survey, hash(token)) : null;
    const participant = response ? await readParticipant(response.id) : null;
    return json({ survey, response: response ? { answers: response.answers, completed: response.completed } : null, participant });
  } catch (error) { return apiError(error); }
}
export async function POST(request: Request, context: Context) {
  try {
    assertOrigin(request); await rateLimit("survey-start-global", 60);
    const parsed = startSchema.safeParse(await readJson(request, 1000));
    if (!parsed.success) throw new HttpError(400, "Confirma tu edad y el consentimiento para participar.");
    const survey = await surveyFor(context); const token = (await session()) ?? newSession();
    await rateLimit(`start:${hash(token)}`, 10);
    const response = await startResponse(survey, hash(token));
    const result = json({ answers: response.answers, completed: response.completed });
    result.cookies.set(SESSION_COOKIE, token, { ...cookieOptions, maxAge: 60 * 60 * 24 * 180 });
    return result;
  } catch (error) { return apiError(error); }
}
export async function PUT(request: Request, context: Context) {
  try {
    assertOrigin(request); const token = await session();
    if (!token) throw new HttpError(401, "Vuelve a confirmar tu consentimiento para continuar.");
    await rateLimit(`save:${hash(token)}`, 50);
    const parsed = saveSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new HttpError(400, "Revisa las respuestas del formulario.");
    const survey = await surveyFor(context);
    try { return json(await saveResponse(survey, hash(token), parsed.data.answers, parsed.data.complete, parsed.data.version)); }
    catch (error) {
      if (error instanceof Error && !error.message.includes("SQL")) throw new HttpError(400, error.message);
      throw error;
    }
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request, context: Context) {
  try {
    assertOrigin(request); const token = await session(); if (!token) throw new HttpError(401, "No se encontró una participación en este navegador.");
    const survey = await surveyFor(context);
    await withdrawResponse(survey, hash(token));
    return json({ deleted: true });
  } catch (error) { return apiError(error); }
}
