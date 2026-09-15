import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { one, query } from "../database";
import { cookieOptions } from "./security";

const scrypt = promisify(scryptCallback) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;
export const TEAM_COOKIE = "pc_team";
const SESSION_HOURS = 12;
export const MIN_PASSWORD_LENGTH = 12;

export interface TeamUser { id: string; email: string; name: string; disabled: boolean; mustChangePassword: boolean; createdAt: string; lastLoginAt: string | null }

/** scrypt with a per-password salt; format is scrypt$<salt>$<derived key>. */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derived = await scrypt(password.normalize("NFKC"), salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}
export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const derived = await scrypt(password.normalize("NFKC"), Buffer.from(saltHex, "hex"), expected.length);
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}
const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function passwordProblem(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  if (password.length > 200) return "La contraseña es demasiado larga.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) return "Incluye al menos una letra y un número.";
  return null;
}

export async function countUsers() {
  const row = await one<{ total: string }>("SELECT COUNT(*)::text AS total FROM team_users WHERE disabled = false");
  return Number(row?.total ?? 0);
}
export async function listUsers(): Promise<TeamUser[]> {
  const rows = await query("SELECT id, email, name, disabled, must_change_password, created_at, last_login_at FROM team_users ORDER BY disabled ASC, lower(name) ASC");
  return rows.map(r => ({
    id: String(r.id), email: String(r.email), name: String(r.name), disabled: !!r.disabled,
    mustChangePassword: !!r.must_change_password, createdAt: new Date(r.created_at as string).toISOString(),
    lastLoginAt: r.last_login_at ? new Date(r.last_login_at as string).toISOString() : null,
  }));
}
export async function createUser({ email, name, password, createdBy, mustChangePassword = true }: { email: string; name: string; password: string; createdBy?: string | null; mustChangePassword?: boolean }) {
  const address = normalizeEmail(email);
  if (await one("SELECT 1 FROM team_users WHERE lower(email) = $1", [address])) throw new Error("Ya existe una cuenta con ese correo.");
  const id = randomUUID();
  await query("INSERT INTO team_users (id, email, name, password_hash, created_by, must_change_password) VALUES ($1,$2,$3,$4,$5,$6)",
    [id, address, name.trim(), await hashPassword(password), createdBy ?? null, mustChangePassword]);
  return id;
}
export async function setUserDisabled(id: string, disabled: boolean) {
  await query("UPDATE team_users SET disabled = $2 WHERE id = $1", [id, disabled]);
  if (disabled) await query("DELETE FROM team_sessions WHERE user_id = $1", [id]);
}
/** Operator-issued reset: forces a rotation and drops every live session of that account. */
export async function resetPasswordByEmail(email: string, password: string) {
  const user = await one("SELECT id FROM team_users WHERE lower(email) = $1", [normalizeEmail(email)]);
  if (!user) throw new Error("No existe ninguna cuenta con ese correo.");
  await query("UPDATE team_users SET password_hash = $2, must_change_password = true, disabled = false WHERE id = $1",
    [user.id, await hashPassword(password)]);
  await query("DELETE FROM team_sessions WHERE user_id = $1", [user.id]);
  return String(user.id);
}
export async function changePassword(id: string, password: string) {
  await query("UPDATE team_users SET password_hash = $2, must_change_password = false WHERE id = $1", [id, await hashPassword(password)]);
}

/** Returns a session token on success, or null for any failure, without saying which. */
export async function signIn(email: string, password: string) {
  const user = await one("SELECT id, password_hash, disabled, must_change_password FROM team_users WHERE lower(email) = $1", [normalizeEmail(email)]);
  // Spend the same work when the account is unknown so timing does not leak membership.
  const stored = user ? String(user.password_hash) : `scrypt$${"0".repeat(32)}$${"0".repeat(128)}`;
  const valid = await verifyPassword(password, stored);
  if (!user || !valid || user.disabled) return null;
  const token = randomBytes(32).toString("hex");
  await query("INSERT INTO team_sessions (id, user_id, token_hash, expires_at) VALUES ($1,$2,$3, now() + ($4 || ' hours')::interval)",
    [randomUUID(), user.id, tokenHash(token), String(SESSION_HOURS)]);
  await query("UPDATE team_users SET last_login_at = now() WHERE id = $1", [user.id]);
  return { token, mustChangePassword: !!user.must_change_password };
}
export async function currentUser(): Promise<TeamUser | null> {
  const token = (await cookies()).get(TEAM_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const row = await one(`SELECT u.id, u.email, u.name, u.disabled, u.must_change_password, u.created_at, u.last_login_at
     FROM team_sessions s JOIN team_users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now() AND u.disabled = false`, [tokenHash(token)]);
  if (!row) return null;
  return {
    id: String(row.id), email: String(row.email), name: String(row.name), disabled: false,
    mustChangePassword: !!row.must_change_password, createdAt: new Date(row.created_at as string).toISOString(),
    lastLoginAt: row.last_login_at ? new Date(row.last_login_at as string).toISOString() : null,
  };
}
export async function signOutCurrent() {
  const token = (await cookies()).get(TEAM_COOKIE)?.value;
  if (token) await query("DELETE FROM team_sessions WHERE token_hash = $1", [tokenHash(token)]);
}
export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(TEAM_COOKIE, token, { ...cookieOptions, maxAge: SESSION_HOURS * 3600 });
}
export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(TEAM_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
export async function purgeExpiredSessions() {
  await query("DELETE FROM team_sessions WHERE expires_at <= now()");
}
