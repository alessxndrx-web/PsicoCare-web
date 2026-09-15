import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import { assertOrigin, hash, readJson, rateLimit } from "../lib/server/security";
import { one, query } from "../lib/database";
import { resetDatabase, teardown } from "./helpers";

before(resetDatabase);
after(teardown);

test("same-origin mutations and body limits are enforced", async () => {
  process.env.SITE_URL = "http://localhost:3000";
  assert.doesNotThrow(() => assertOrigin(new Request("http://localhost:3000/api", { headers: { origin: "http://localhost:3000" } })));
  assert.throws(() => assertOrigin(new Request("http://localhost:3000/api", { headers: { origin: "https://untrusted.example" } })));
  assert.throws(() => assertOrigin(new Request("http://localhost:3000/api")));
  await assert.rejects(() => readJson(new Request("http://localhost/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: "x".repeat(100) }), 50));
  await assert.rejects(() => readJson(new Request("http://localhost/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: "invalid" })));
  assert.deepEqual(await readJson(new Request("http://localhost/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: '{"ok":true}' })), { ok: true });
});
test("rate limits persist in storage and never store the raw key", async () => {
  await query("DELETE FROM rate_limits");
  await rateLimit("private-value", 2); await rateLimit("private-value", 2);
  await assert.rejects(() => rateLimit("private-value", 2), /demasiados/);
  const row = await one<{ key: string }>("SELECT key FROM rate_limits");
  assert.equal(row!.key, hash("private-value"));
  assert.notEqual(row!.key, "private-value");
});
