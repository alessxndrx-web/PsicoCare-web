import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import { migrate, one, query } from "../lib/database";
import { getSurvey, readResponse, saveResponse, seedSurvey, startResponse, withdrawResponse } from "../lib/surveys/repository";
import { initialSurvey } from "../lib/surveys/initial-survey";
import { questionError, saveSchema, startSchema, surveyIsOpen, validateAnswers } from "../lib/surveys/validation";
import { surveyAnalytics } from "../lib/surveys/analytics";
import { CONSENT_VERSION, type Answers, type Survey, type SurveyQuestion } from "../lib/surveys/types";
import { resetDatabase, teardown } from "./helpers";

let survey: Survey;
before(async () => { await resetDatabase(); survey = (await getSurvey(initialSurvey.slug))!; });
after(teardown);

function validAnswers(): Answers {
  return Object.fromEntries(survey.questions.map(q => [q.id, q.id === "age" ? q.options[2].id : q.type === "text" ? "" : q.type === "multiple" ? [q.options[0].id, q.options[1].id] : q.options.length ? q.options[0].id : q.config.max === 10 ? 8 : 4]));
}

test("migrations and initial survey seed are idempotent and create no responses", async () => {
  await migrate(); await seedSurvey(initialSurvey);
  assert.equal(Number((await one<{ n: string }>("SELECT COUNT(*)::text AS n FROM surveys"))!.n), 1);
  assert.equal(survey.questions.length, 14);
  const analytics = await surveyAnalytics(survey);
  assert.equal(analytics.total, 0);
  assert.equal(analytics.willingness, null);
});
test("consent is explicit, adult-only, versioned, strict and rejects honeypot", () => {
  const input = { consent: true, adult: true, consentVersion: CONSENT_VERSION };
  assert.ok(startSchema.safeParse(input).success);
  for (const bad of [{ ...input, consent: false }, { ...input, adult: false }, { ...input, consentVersion: "old" }, { ...input, website: "spam" }, { ...input, role: "admin" }]) assert.equal(startSchema.safeParse(bad).success, false);
});
test("all seven question types validate including zero and optional text", () => {
  const base: SurveyQuestion = { id: "q", title: "Pregunta", type: "single", required: true, config: {}, options: [{ id: "a", label: "A", value: "a" }] };
  assert.equal(questionError(base, "a"), null);
  assert.ok(questionError(base, "untrusted"));
  assert.equal(questionError({ ...base, type: "multiple" }, ["a"]), null);
  assert.ok(questionError({ ...base, type: "multiple" }, ["a", "a"]));
  assert.equal(questionError({ ...base, type: "yesno", options: [] }, "yes"), null);
  for (const type of ["score5", "likert"] as const) {
    assert.equal(questionError({ ...base, type }, 5), null);
    assert.ok(questionError({ ...base, type }, 0)); assert.ok(questionError({ ...base, type }, 2.5));
  }
  assert.equal(questionError({ ...base, type: "score10" }, 0), null);
  assert.ok(questionError({ ...base, type: "score10" }, 11));
  assert.equal(questionError({ ...base, type: "text", required: false }, ""), null);
  assert.ok(questionError({ ...base, type: "text" }, "x".repeat(501)));
});
test("unknown questions/options, malformed values, incomplete submission and minors are rejected", () => {
  const answers = validAnswers();
  assert.doesNotThrow(() => validateAnswers(survey, answers, true));
  assert.throws(() => validateAnswers(survey, { ...answers, injected: "value" }, true));
  assert.throws(() => validateAnswers(survey, { ...answers, age: "age-1" }, true), /18 años/);
  assert.throws(() => validateAnswers(survey, { ...answers, age: "age-2" }, true), /18 años/);
  assert.throws(() => validateAnswers(survey, { ...answers, features: ["foreign-option"] }, true));
  assert.throws(() => validateAnswers(survey, { ...answers, recommendation: 10.5 }, true));
  assert.throws(() => validateAnswers(survey, {}, true));
  assert.ok(!saveSchema.safeParse({ version: 1, complete: true, answers: { text: "x".repeat(501) } }).success);
});
test("drafts persist in storage and sessions cannot read each other", async () => {
  const started = await startResponse(survey, "session-a");
  assert.deepEqual(started.answers, {});
  await saveResponse(survey, "session-a", { age: "age-3" }, false, 1);
  assert.equal(Number((await one<{ n: string }>("SELECT COUNT(*)::text AS n FROM survey_answers"))!.n), 1);
  assert.deepEqual((await readResponse(survey, "session-a"))?.answers, { age: "age-3" });
  assert.equal(await readResponse(survey, "session-b"), null);
  await assert.rejects(() => saveResponse(survey, "session-b", validAnswers(), true, 1), /consentimiento/);
});
test("server rejects stale survey versions and closed/scheduled surveys", async () => {
  await assert.rejects(() => saveResponse(survey, "session-a", validAnswers(), true, 2), /versión/);
  assert.equal(surveyIsOpen({ ...survey, status: "closed" }), false);
  assert.equal(surveyIsOpen({ ...survey, startsAt: "2099-01-01" }), false);
  assert.equal(surveyIsOpen({ ...survey, endsAt: "2000-01-01" }), false);
});
test("invalid saves preserve draft, repeated completion is idempotent and completed responses are immutable", async () => {
  await assert.rejects(() => saveResponse(survey, "session-a", { age: "invalid" }, true, 1));
  assert.deepEqual((await readResponse(survey, "session-a"))?.answers, { age: "age-3" });
  await saveResponse(survey, "session-a", validAnswers(), true, 1);
  const original = await readResponse(survey, "session-a");
  await saveResponse(survey, "session-a", { ...validAnswers(), recommendation: 0 }, true, 1);
  await startResponse(survey, "session-a");
  assert.deepEqual(await readResponse(survey, "session-a"), original);
  const analytics = await surveyAnalytics(survey);
  assert.equal(analytics.completed, 1);
  assert.equal(analytics.distributions.length, 0);
});
test("analytics use real complete answers, suppress small samples and exclude age/text details", async () => {
  for (let i = 0; i < 4; i++) { await startResponse(survey, "aggregate-" + i); await saveResponse(survey, "aggregate-" + i, validAnswers(), true, 1); }
  const analytics = await surveyAnalytics(survey);
  assert.equal(analytics.completed, 5); assert.equal(analytics.willingness, 4); assert.equal(analytics.recommendation, 8);
  assert.ok(analytics.distributions.length > 0);
  assert.equal(analytics.distributions.some(q => ["age", "must-have", "improvements"].includes(q.id)), false);
  assert.equal(analytics.distributions.find(q => q.id === "features")?.items[0].count, 5);
  assert.equal(analytics.trend.reduce((n, d) => n + d.count, 0), 5);
});
test("withdrawal cascades to answers and removes the participant from aggregates", async () => {
  const id = (await readResponse(survey, "session-a"))!.id;
  await withdrawResponse(survey, "session-a");
  assert.equal(Number((await one<{ n: string }>("SELECT COUNT(*)::text AS n FROM survey_answers WHERE response_id = $1", [id]))!.n), 0);
  assert.equal(await readResponse(survey, "session-a"), null);
  assert.equal((await surveyAnalytics(survey)).completed, 4);
  await query("DELETE FROM survey_responses");
});
