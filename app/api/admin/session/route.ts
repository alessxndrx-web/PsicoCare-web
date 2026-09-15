import { z } from "zod";
import { clearSessionCookie, setSessionCookie, signIn, signOutCurrent } from "@/lib/server/auth";
import { apiError, assertOrigin, hash, HttpError, json, rateLimit, readJson } from "@/lib/server/security";
export const runtime = "nodejs";
const schema = z.object({ email: z.email().max(200), password: z.string().min(1).max(200) }).strict();

export async function POST(request: Request) {
  try {
    assertOrigin(request);
    await rateLimit("signin-global", 60, 10 * 60 * 1000);
    const parsed = schema.safeParse(await readJson(request, 1000));
    if (!parsed.success) throw new HttpError(400, "Escribe tu correo y tu contraseña.");
    // Throttle per account so one target cannot be brute forced from many sessions.
    await rateLimit(`signin:${hash(parsed.data.email.toLowerCase())}`, 8, 10 * 60 * 1000);
    const result = await signIn(parsed.data.email, parsed.data.password);
    if (!result) throw new HttpError(401, "Correo o contraseña incorrectos.");
    const response = json({ signedIn: true, mustChangePassword: result.mustChangePassword });
    setSessionCookie(response, result.token);
    return response;
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request) {
  try {
    assertOrigin(request);
    await signOutCurrent();
    const response = json({ signedOut: true });
    clearSessionCookie(response);
    return response;
  } catch (error) { return apiError(error); }
}
