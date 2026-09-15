import { z } from "zod";
import { getSurvey, readResponse, removeParticipant, saveParticipant } from "@/lib/surveys/repository";
import { surveyIsOpen } from "@/lib/surveys/validation";
import { CONSENT_VERSION } from "@/lib/surveys/types";
import { apiError, assertOrigin, hash, HttpError, json, readJson, rateLimit, session } from "@/lib/server/security";
export const runtime = "nodejs";
const schema = z.object({ email: z.email().max(200), consent: z.literal(true), consentVersion: z.literal(CONSENT_VERSION), website: z.string().max(0).optional() }).strict();
type Context = { params: Promise<{ slug: string }> };

async function currentResponse(context: Context) {
  const { slug } = await context.params;
  const survey = await getSurvey(slug);
  if (!survey || !surveyIsOpen(survey)) throw new HttpError(404, "Esta encuesta no está disponible.");
  const token = await session();
  if (!token) throw new HttpError(401, "No encontramos tu participación en este navegador.");
  const response = await readResponse(survey, hash(token));
  if (!response) throw new HttpError(401, "No encontramos tu participación en este navegador.");
  return response;
}
export async function POST(request: Request, context: Context) {
  try {
    assertOrigin(request);
    const response = await currentResponse(context);
    await rateLimit(`email:${response.id}`, 10);
    const parsed = schema.safeParse(await readJson(request, 1000));
    if (!parsed.success) throw new HttpError(400, "Escribe un correo válido y confirma que quieres dejarlo.");
    await saveParticipant(response.id, parsed.data.email.trim().toLowerCase(), "manual");
    return json({ email: parsed.data.email.trim().toLowerCase(), verified: false });
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request, context: Context) {
  try {
    assertOrigin(request);
    const response = await currentResponse(context);
    await removeParticipant(response.id);
    return json({ removed: true });
  } catch (error) { return apiError(error); }
}
