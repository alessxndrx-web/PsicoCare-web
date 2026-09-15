import { randomUUID } from "node:crypto";
import { z } from "zod";
import { query } from "@/lib/database";
import { CONTACT_INTERESTS, CONTACT_SIZES, CONTACT_TYPES } from "@/lib/content";
import { apiError, assertOrigin, hash, HttpError, json, rateLimit, readJson } from "@/lib/server/security";
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  organization: z.string().trim().max(160),
  role: z.string().trim().max(120),
  audience: z.enum(CONTACT_TYPES),
  communitySize: z.enum(CONTACT_SIZES),
  interest: z.enum(CONTACT_INTERESTS),
  message: z.string().trim().min(10).max(2000),
  consent: z.literal(true),
  website: z.string().max(0),
  requestId: z.uuid(),
}).strict();
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    assertOrigin(request); await rateLimit("contact-global", 15, 60 * 60 * 1000);
    const parsed = schema.safeParse(await readJson(request, 10000));
    if (!parsed.success) throw new HttpError(400, "Revisa tu nombre, correo, mensaje y autorización de contacto.");
    const data = parsed.data;
    await rateLimit(`contact:${hash(data.email.toLowerCase())}`, 3, 60 * 60 * 1000);
    await query(`INSERT INTO contact_leads (id, name, email, organization, audience, message, consent_version, session_hash, role, community_size, interest)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (session_hash, message) DO NOTHING`,
      [randomUUID(), data.name, data.email.toLowerCase(), data.organization, data.audience, data.message, "contacto-2026-09-v1", hash(data.requestId), data.role, data.communitySize, data.interest]);
    return json({ saved: true });
  } catch (error) { return apiError(error); }
}
