import { test } from "node:test";
import assert from "node:assert/strict";
// @ts-ignore plain JS module
import { addReview, passReview, dueToday, addDays } from "../src/store.js";

test("missed reel comes back tomorrow, then 3 days, then 7, then leaves", () => {
  const S: any = { review: [] }, d0 = "2026-11-07";
  addReview(S, "deck", 2, d0);
  assert.deepEqual(dueToday(S, "deck", d0), []);
  assert.equal(passReview(S, "deck", 2, d0), false, "not due yet: answering today doesn't count");
  const d1 = addDays(d0, 1);
  assert.deepEqual(dueToday(S, "deck", d1), [2]);
  assert.equal(passReview(S, "deck", 2, d1), true);
  assert.equal(S.review[0].due, addDays(d1, 3));
  passReview(S, "deck", 2, addDays(d1, 3));
  assert.equal(S.review[0].due, addDays(d1, 10));
  passReview(S, "deck", 2, addDays(d1, 10));
  assert.equal(S.review.length, 0);
});

test("missing it again resets to tomorrow", () => {
  const S: any = { review: [] }, d0 = "2026-11-07";
  addReview(S, "deck", 1, d0); passReview(S, "deck", 1, addDays(d0, 1));
  addReview(S, "deck", 1, addDays(d0, 4));
  assert.deepEqual(S.review[0], { d: "deck", i: 1, due: addDays(d0, 5), step: 0 });
});
