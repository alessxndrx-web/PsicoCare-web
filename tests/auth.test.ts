import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import { one, query } from "../lib/database";
import { changePassword, countUsers, createUser, hashPassword, listUsers, passwordProblem, setUserDisabled, signIn, verifyPassword } from "../lib/server/auth";
import { resetDatabase, teardown } from "./helpers";

before(resetDatabase);
after(teardown);

const STRONG = "psicocare-2026-segura";

test("passwords are salted, never stored in clear and reject weak values", async () => {
  const hash = await hashPassword(STRONG);
  assert.ok(hash.startsWith("scrypt$"), "the scheme is recorded with the hash");
  assert.ok(!hash.includes(STRONG), "the plain password never appears in storage");
  assert.notEqual(await hashPassword(STRONG), hash, "the same password yields a different hash each time");
  assert.equal(await verifyPassword(STRONG, hash), true);
  assert.equal(await verifyPassword(STRONG + "x", hash), false);
  assert.equal(await verifyPassword(STRONG, "not-a-valid-hash"), false);
  assert.ok(passwordProblem("corta1"), "short passwords are refused");
  assert.ok(passwordProblem("solamenteletrasaqui"), "a password without digits is refused");
  assert.equal(passwordProblem(STRONG), null);
});
test("accounts are unique per email, case-insensitive, and stored normalised", async () => {
  await createUser({ email: "Equipo@PsicoCare.test", name: "Equipo", password: STRONG });
  const row = await one("SELECT email FROM team_users WHERE name = $1", ["Equipo"]);
  assert.equal(row!.email, "equipo@psicocare.test", "the address is lowercased before storage");
  await assert.rejects(() => createUser({ email: "EQUIPO@psicocare.test", name: "Duplicado", password: STRONG }), /Ya existe/);
  assert.equal(await countUsers(), 1);
});
test("sign in succeeds only with the right credentials and issues a session", async () => {
  assert.equal(await signIn("equipo@psicocare.test", "contrasena-incorrecta"), null);
  assert.equal(await signIn("nadie@psicocare.test", STRONG), null, "an unknown account fails the same way");
  const result = await signIn("EQUIPO@psicocare.test", STRONG);
  assert.ok(result && /^[a-f0-9]{64}$/.test(result.token), "a random opaque token is issued");
  const stored = await one<{ token_hash: string }>("SELECT token_hash FROM team_sessions");
  assert.notEqual(stored!.token_hash, result!.token, "only the hash of the token is stored");
  const user = await one("SELECT last_login_at FROM team_users WHERE email = $1", ["equipo@psicocare.test"]);
  assert.ok(user!.last_login_at, "the last access is recorded");
});
test("disabling an account blocks sign in and revokes its live sessions", async () => {
  const id = String((await one("SELECT id FROM team_users WHERE email = $1", ["equipo@psicocare.test"]))!.id);
  assert.ok(await signIn("equipo@psicocare.test", STRONG));
  assert.ok(Number((await one<{ n: string }>("SELECT COUNT(*)::text AS n FROM team_sessions WHERE user_id = $1", [id]))!.n) > 0);
  await setUserDisabled(id, true);
  assert.equal(Number((await one<{ n: string }>("SELECT COUNT(*)::text AS n FROM team_sessions WHERE user_id = $1", [id]))!.n), 0, "existing sessions are destroyed immediately");
  assert.equal(await signIn("equipo@psicocare.test", STRONG), null);
  assert.equal(await countUsers(), 0, "a disabled account no longer counts as active");
  await setUserDisabled(id, false);
  assert.ok(await signIn("equipo@psicocare.test", STRONG));
});
test("each team member has a separate account and changing one password does not affect others", async () => {
  await createUser({ email: "otra@psicocare.test", name: "Otra persona", password: STRONG });
  const other = String((await one("SELECT id FROM team_users WHERE email = $1", ["otra@psicocare.test"]))!.id);
  await changePassword(other, "otra-clave-distinta-2026");
  assert.equal(await signIn("otra@psicocare.test", STRONG), null, "the old password stops working for that account");
  assert.ok(await signIn("otra@psicocare.test", "otra-clave-distinta-2026"));
  assert.ok(await signIn("equipo@psicocare.test", STRONG), "the other account keeps its own password");
  const users = await listUsers();
  assert.equal(users.length, 2);
  // A password handed over by someone else must be rotated; changing it clears the flag for that account only.
  assert.equal(users.find(u => u.email === "otra@psicocare.test")!.mustChangePassword, false);
  assert.equal(users.find(u => u.email === "equipo@psicocare.test")!.mustChangePassword, true);
  await query("DELETE FROM team_users");
});
