import { test } from "node:test";
import assert from "node:assert/strict";
import { aiBudget } from "../api/_lib/util.js";

const fakeRes = () => { const r: any = { code: 200, body: null }; r.status = (c: number) => { r.code = c; return r; }; r.json = (o: any) => { r.body = o; return r; }; r.setHeader = () => {}; return r; };
const req = (ip: string, code?: string) => ({ headers: { "x-forwarded-for": ip, ...(code ? { "x-scrollege-code": code } : {}) } });

test("each visitor gets a daily number of AI turns", () => {
  process.env.AI_DAILY_PER_PERSON = "4"; process.env.AI_DAILY_TOTAL = "100"; delete process.env.AI_ACCESS_CODE;
  assert.equal(aiBudget(req("1.1.1.1"), fakeRes(), 3), true);   // a deck
  assert.equal(aiBudget(req("1.1.1.1"), fakeRes(), 1), true);   // an ask
  const r = fakeRes();
  assert.equal(aiBudget(req("1.1.1.1"), r, 1), false);          // over the limit
  assert.equal(r.code, 429);
  assert.equal(aiBudget(req("2.2.2.2"), fakeRes(), 1), true);   // someone else is fine
});

test("with an access code, visitors without it get the sample decks", () => {
  process.env.AI_ACCESS_CODE = "bubbles";
  const r = fakeRes();
  assert.equal(aiBudget(req("3.3.3.3"), r, 1), false);
  assert.deepEqual(r.body, { demo: true, locked: true });
  assert.equal(aiBudget(req("3.3.3.3", "bubbles"), fakeRes(), 1), true);
  delete process.env.AI_ACCESS_CODE;
});
