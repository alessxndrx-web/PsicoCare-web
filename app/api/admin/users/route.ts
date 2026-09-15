import { z } from "zod";
import { changePassword, createUser, currentUser, listUsers, MIN_PASSWORD_LENGTH, passwordProblem, setUserDisabled } from "@/lib/server/auth";
import { apiError, assertOrigin, HttpError, json, rateLimit, readJson } from "@/lib/server/security";
export const runtime = "nodejs";

const createSchema = z.object({ email: z.email().max(200), name: z.string().trim().min(2).max(120), password: z.string().min(MIN_PASSWORD_LENGTH).max(200) }).strict();
const updateSchema = z.object({ id: z.uuid(), disabled: z.boolean() }).strict();
const passwordSchema = z.object({ password: z.string().min(MIN_PASSWORD_LENGTH).max(200) }).strict();

async function requireUser() {
  const user = await currentUser();
  if (!user) throw new HttpError(401, "Inicia sesión para continuar.");
  return user;
}
export async function GET() {
  try { await requireUser(); return json({ users: await listUsers() }); }
  catch (error) { return apiError(error); }
}
/** Every account can manage the team, so only authentication is required here. */
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    const user = await requireUser();
    await rateLimit(`users:${user.id}`, 20, 10 * 60 * 1000);
    const parsed = createSchema.safeParse(await readJson(request, 2000));
    if (!parsed.success) throw new HttpError(400, `Revisa el correo, el nombre y una contraseña de al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
    const problem = passwordProblem(parsed.data.password);
    if (problem) throw new HttpError(400, problem);
    try { await createUser({ ...parsed.data, createdBy: user.id }); }
    catch (error) { throw new HttpError(409, error instanceof Error ? error.message : "No pudimos crear la cuenta."); }
    return json({ users: await listUsers() }, 201);
  } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request) {
  try {
    assertOrigin(request);
    const user = await requireUser();
    const parsed = updateSchema.safeParse(await readJson(request, 1000));
    if (!parsed.success) throw new HttpError(400, "Solicitud no válida.");
    if (parsed.data.id === user.id) throw new HttpError(400, "No puedes desactivar tu propia cuenta.");
    if (parsed.data.disabled) {
      const active = (await listUsers()).filter(u => !u.disabled);
      if (active.length <= 1) throw new HttpError(400, "Debe quedar al menos una cuenta activa.");
    }
    await setUserDisabled(parsed.data.id, parsed.data.disabled);
    return json({ users: await listUsers() });
  } catch (error) { return apiError(error); }
}
export async function PUT(request: Request) {
  try {
    assertOrigin(request);
    const user = await requireUser();
    const parsed = passwordSchema.safeParse(await readJson(request, 1000));
    if (!parsed.success) throw new HttpError(400, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
    const problem = passwordProblem(parsed.data.password);
    if (problem) throw new HttpError(400, problem);
    await changePassword(user.id, parsed.data.password);
    return json({ changed: true });
  } catch (error) { return apiError(error); }
}
