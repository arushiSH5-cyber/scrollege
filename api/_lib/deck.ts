import { z } from "zod";
import { norm } from "./util";

export const ReelSchema = z.object({
  t: z.string().describe("Short reel title, max 6 words"),
  cap: z.array(z.string()).describe("3 very short captions (max 6 words each) for the Watch view"),
  read: z.array(z.string()).describe("3 short fact bullets, each fully supported by the source"),
  quotes: z.array(z.string()).describe("One exact quote copied word-for-word from the source for EACH read bullet, same order. 4-25 words each."),
  simple: z.string().describe("One sentence, simpler version"),
  story: z.array(z.string()).describe("3 short story lines with cute critter characters, keeping facts correct"),
  pod: z.array(z.array(z.string())).describe('2 podcast lines as [speaker, line]; speakers are "Scrolly" (curious) then "Pip" (explains)'),
  q: z.object({
    question: z.string(),
    options: z.array(z.string()).describe("3 options. Exactly one is right. Wrong ones are clearly wrong, not tricks."),
    answerIndex: z.number().int(),
    why: z.string().describe("One kind sentence explaining the right answer"),
  }),
  jingle: z.array(z.string()).describe("2 rhyming lines that keep the facts correct"),
  line: z.number().int().describe("The source line number [n] this reel is mostly based on"),
  v3: z.enum(["scatter", "overfit", "hill", "net", "tokens", "split", "sort", "cluster"]).describe(
    "3D video scene that best shows this idea: scatter (dots + best-fit line), overfit (wiggly curve vs simple line), hill (ball rolling downhill), net (layers of nodes), tokens (word blocks one at a time), split (cubes into train/test), sort (balls into two labeled bins), cluster (balls drifting into groups)"),
});
export const CardSchema = z.object({
  title: z.string().describe("Funny card name, 2-4 words"),
  type: z.enum(["SPELL CARD", "TRAP CARD"]),
  art: z.enum(["sweat", "shield", "detective", "slide", "talk", "shock"]).describe("Scrolly prop: sweat, shield, detective (magnifier), slide, talk (speech bubble), shock"),
  effect: z.string().describe("Funny but TRUE to the topic, kind and school-appropriate, max 140 characters"),
});
export const DeckSchema = z.object({
  title: z.string().describe("Topic title, 1-4 words"),
  reels: z.array(ReelSchema).describe("Exactly 5 reels, one big idea each, in a sensible learning order"),
  sort: z.array(z.array(z.string())).describe('4-6 [word, "in"|"out"] pairs if the topic has clear inputs/outputs or two groups, else []'),
  steps: z.array(z.string()).describe("4-6 short steps in the right order if the topic has a process, else []"),
  cards: z.array(CardSchema).describe("Exactly 3 collectible meme study cards about this topic"),
});
export type Reel = z.infer<typeof ReelSchema>;
export type ModelDeck = z.infer<typeof DeckSchema>;

/** The mockup's reel shape: q is [question, options[3], answerIndex, why], pod is [[speaker,line]x2]. */
export function toMockupReel(r: Reel) {
  return {
    t: r.t, cap: r.cap.slice(0, 3), read: r.read.slice(0, 3), quotes: r.quotes.slice(0, 3), simple: r.simple,
    story: r.story.slice(0, 3), pod: r.pod.slice(0, 2).map((p) => [String(p[0] || "Pip"), String(p[1] || "")]),
    q: [r.q.question, r.q.options.slice(0, 3), r.q.answerIndex, r.q.why], jingle: r.jingle.slice(0, 2), line: r.line, v3: r.v3,
  };
}

/** Grounding check: every read bullet needs a quote that appears word-for-word in the source. */
export function groundingProblems(r: Reel, sourceText: string): string[] {
  const src = norm(sourceText), out: string[] = [];
  if (!Array.isArray(r.read) || r.read.length < 3) out.push("needs 3 read bullets");
  if (!Array.isArray(r.quotes) || r.quotes.length < Math.min(3, r.read?.length || 3)) out.push("needs one quote per read bullet");
  for (const q of r.quotes || []) {
    const n = norm(q).replace(/^["'.…\s]+|["'.…\s]+$/g, "");
    if (n.split(" ").length < 3) out.push(`quote too short: "${q}"`);
    else if (!src.includes(n)) out.push(`quote not in source: "${q}"`);
  }
  if (r.q?.options?.length !== 3) out.push("quiz needs 3 options");
  if (!(r.q?.answerIndex >= 0 && r.q.answerIndex < 3)) out.push("bad answerIndex");
  if (r.cap?.length < 3 || r.story?.length < 3 || r.pod?.length < 2 || r.jingle?.length < 2) out.push("missing parts");
  return out;
}
