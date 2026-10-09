import test from "node:test";
import assert from "node:assert/strict";
import { CONSENT_SECONDS, CONSENT_VERSION, parseConsent } from "../lib/privacy-consent";
const now = Date.now();
const value = (analytics: boolean, updatedAt=now) => encodeURIComponent(JSON.stringify({version: CONSENT_VERSION, analytics, updatedAt}));
test("optional measurement is off unless a valid explicit decision exists",()=>{for(const raw of [undefined,"","garbage",encodeURIComponent(JSON.stringify({version:"old",analytics:true,updatedAt:now})),encodeURIComponent(JSON.stringify({version:CONSENT_VERSION,analytics:"true",updatedAt:now}))])assert.equal(parseConsent(raw,now),null);assert.equal(parseConsent(value(false),now)?.analytics,false);assert.equal(parseConsent(value(true),now)?.analytics,true)});
test("expired and future dated decisions fail closed",()=>{assert.equal(parseConsent(value(true,now-CONSENT_SECONDS*1000),now),null);assert.equal(parseConsent(value(true,now+1000),now),null);assert.equal(parseConsent(value(true,now-1000),now)?.analytics,true)});
