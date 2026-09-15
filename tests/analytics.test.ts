import { test } from "node:test";
import assert from "node:assert/strict";
import { publicEvent } from "../lib/analytics";

const at = (url: string) => publicEvent({ url, type: "pageview" as const });

test("the internal panel is never reported", () => {
  assert.equal(at("https://psico-care-web.vercel.app/admin"), null);
  assert.equal(at("https://psico-care-web.vercel.app/admin/encuestas"), null);
  assert.equal(at("https://psico-care-web.vercel.app/admin/encuestas?x=1"), null);
});
test("query strings and fragments are dropped so flow markers never leave the site", () => {
  assert.equal(at("https://psico-care-web.vercel.app/encuestas?correo=ok")?.url, "https://psico-care-web.vercel.app/encuestas");
  assert.equal(at("https://psico-care-web.vercel.app/educacion#programas")?.url, "https://psico-care-web.vercel.app/educacion");
  assert.equal(at("https://psico-care-web.vercel.app/?utm_source=x&utm_campaign=y")?.url, "https://psico-care-web.vercel.app/");
});
test("public paths are kept and other event fields survive", () => {
  const event = publicEvent({ url: "https://psico-care-web.vercel.app/educacion", type: "pageview" as const });
  assert.equal(event?.url, "https://psico-care-web.vercel.app/educacion");
  assert.equal(event?.type, "pageview");
});
test("a path that merely starts with the word admin is still reported", () => {
  assert.equal(at("https://psico-care-web.vercel.app/administracion")?.url, "https://psico-care-web.vercel.app/administracion");
});
test("a malformed url is dropped rather than reported raw", () => {
  assert.equal(at("no-es-una-url"), null);
});
