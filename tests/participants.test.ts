import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import { one, query } from "../lib/database";
import { getSurvey, listResponsesForAdmin, readParticipant, removeParticipant, saveParticipant, saveResponse, startResponse } from "../lib/surveys/repository";
import { initialSurvey } from "../lib/surveys/initial-survey";
import { createState, readState } from "../lib/server/google";
import type { Answers, Survey } from "../lib/surveys/types";
import { resetDatabase, teardown } from "./helpers";

let survey: Survey;
before(async () => {
  await resetDatabase();
  process.env.GOOGLE_CLIENT_SECRET = "test-secret-for-state-signing-only";
  survey = (await getSurvey(initialSurvey.slug))!;
});
after(teardown);

function validAnswers(): Answers {
  return Object.fromEntries(survey.questions.map(q => [q.id, q.id === "age" ? q.options[2].id : q.type === "text" ? "" : q.type === "multiple" ? [q.options[0].id, q.options[1].id] : q.options.length ? q.options[0].id : q.config.max === 10 ? 8 : 4]));
}
async function complete(sessionHash: string) {
  await startResponse(survey, sessionHash);
  await saveResponse(survey, sessionHash, validAnswers(), true, survey.version);
  return String((await one("SELECT id FROM survey_responses WHERE session_hash = $1", [sessionHash]))!.id);
}

test("email is optional, replaceable, removable and never invented", async () => {
  const id = await complete("participant-a");
  assert.equal(await readParticipant(id), null, "no email is stored unless the participant opts in");
  await saveParticipant(id, "alguien@ejemplo.com", "manual");
  assert.deepEqual(await readParticipant(id), { email: "alguien@ejemplo.com", provider: "manual", verified: false });
  await saveParticipant(id, "verificado@ejemplo.com", "google");
  assert.deepEqual(await readParticipant(id), { email: "verificado@ejemplo.com", provider: "google", verified: true }, "Google overwrites and marks verified");
  await removeParticipant(id);
  assert.equal(await readParticipant(id), null);
});
test("email cannot be attached to an unknown response and withdrawal deletes it", async () => {
  await assert.rejects(() => saveParticipant("00000000-0000-0000-0000-000000000000", "x@y.com", "manual"));
  const id = await complete("participant-b");
  await saveParticipant(id, "borrame@ejemplo.com", "manual");
  await query("DELETE FROM survey_responses WHERE id = $1", [id]);
  const left = await one<{ n: string }>("SELECT COUNT(*)::text AS n FROM survey_participants WHERE response_id = $1", [id]);
  assert.equal(Number(left!.n), 0, "cascade removes the email with the response");
});
test("admin listing returns completed responses with readable labels", async () => {
  const id = await complete("participant-c");
  await saveParticipant(id, "lector@ejemplo.com", "google");
  const rows = await listResponsesForAdmin(survey);
  const row = rows.find(r => r.id === id)!;
  assert.ok(row, "the completed response is listed");
  assert.equal(row.email, "lector@ejemplo.com");
  assert.equal(row.verified, true);
  assert.equal(row.answers.length, survey.questions.length, "every question appears, answered or not");
  const age = row.answers.find(a => a.questionId === "age")!;
  assert.ok(age.display[0] && !age.display[0].startsWith("age-"), "option ids are resolved to labels");
  const optional = row.answers.find(a => a.type === "text")!;
  assert.deepEqual(optional.display, [], "unanswered optional text stays empty rather than fabricated");
});
test("admin listing hides drafts by default", async () => {
  await startResponse(survey, "participant-draft");
  const draft = String((await one("SELECT id FROM survey_responses WHERE session_hash = $1", ["participant-draft"]))!.id);
  const ids = (await listResponsesForAdmin(survey)).map(r => r.id);
  assert.ok(!ids.includes(draft), "an unfinished draft is not shown as a finished response");
  assert.ok((await listResponsesForAdmin(survey, { onlyCompleted: false })).map(r => r.id).includes(draft));
});
test("oauth state binds one response, is signed, single-use and expires", () => {
  const state = createState("response-123");
  assert.equal(readState(state, state), "response-123");
  assert.equal(readState(state, "otro-valor"), null, "state must match the cookie");
  assert.equal(readState(undefined, state), null, "a missing cookie is rejected");
  const [nonce, , expiry, signature] = state.split(".");
  assert.equal(readState(`${nonce}.otra-respuesta.${expiry}.${signature}`, `${nonce}.otra-respuesta.${expiry}.${signature}`), null, "retargeting another response breaks the signature");
  const expired = `${nonce}.response-123.${Date.now() - 1000}.${signature}`;
  assert.equal(readState(expired, expired), null, "an expired state is rejected");
  process.env.GOOGLE_CLIENT_SECRET = "a-different-secret-entirely-here";
  assert.equal(readState(state, state), null, "rotating the secret invalidates pending states");
  process.env.GOOGLE_CLIENT_SECRET = "test-secret-for-state-signing-only";
});
