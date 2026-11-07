import { test } from "node:test";
import assert from "node:assert/strict";
import { groundingProblems } from "../api/_lib/deck";

const SOURCE = `Plants make food (sugar) using light energy.
Inputs: sunlight, water (roots), carbon dioxide (stomata).
Happens in chloroplasts; chlorophyll absorbs red/blue light, reflects green.`;

const reel = (quotes: string[]) => ({
  t: "Inputs", cap: ["a", "b", "c"], read: ["x", "y", "z"], quotes, simple: "s", story: ["1", "2", "3"],
  pod: [["Rotty", "hi"], ["Pip", "yo"]], q: { question: "q", options: ["a", "b", "c"], answerIndex: 0, why: "w" },
  jingle: ["one", "two"], line: 2,
});

test("a reel whose quotes are copied from the source passes", () => {
  assert.deepEqual(groundingProblems(reel([
    "Plants make food (sugar) using light energy",
    "sunlight, water (roots), carbon dioxide (stomata)",
    "chlorophyll absorbs red/blue light, reflects green",
  ]), SOURCE), []);
});

test("a reel with a made-up quote is rejected", () => {
  const p = groundingProblems(reel([
    "Plants make food (sugar) using light energy",
    "Photosynthesis was discovered by Jan Ingenhousz in 1779",
    "chlorophyll absorbs red/blue light, reflects green",
  ]), SOURCE);
  assert.equal(p.length, 1);
  assert.match(p[0], /not in source/);
});

test("missing quotes are rejected", () => {
  assert.ok(groundingProblems(reel(["Plants make food (sugar) using light energy"]), SOURCE).length > 0);
});
