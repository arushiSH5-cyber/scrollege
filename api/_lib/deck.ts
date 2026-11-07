import { z } from "zod";
import { norm } from "./util.js";

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
  mm: z.array(z.string()).describe('Memory-match pair: [key term from this reel (1-3 words), its meaning in max 6 words]'),
  v3: z.enum(["sort", "features", "cluster", "split", "clsreg", "scatter", "hill", "overfit", "net", "tokens", "none"]).describe(
    "Live 3D scene that acts out this reel. Each scene has 3 beats, and cap[0], cap[1], cap[2] must describe beat 1, 2, 3 in order. " +
    "These scenes show machine-learning / data / AI ideas and have built-in labels, so for any other subject use none. " +
    "sort: (1) balls drop into two labeled bins = learning from examples (2) a rulebook shrinks away = not hand-written rules (3) a new gray ball turns the right color and lands in the right bin = predicting. " +
    "features: (1) clue tags orbit a house (2) a price label pops up (3) sparks flow from the clues into the price. " +
    "cluster: (1) balls wear name tags (2) tags float away, balls turn gray (3) balls drift into groups on their own. " +
    "split: (1) cubes fly into 80% train / 20% test pads (2) a critter studies the training cubes (3) it checks the test cubes. " +
    "clsreg: (1) a spinning ? (2) balls drop into category bins = classification (3) a ball rolls along a number line = regression. " +
    "scatter: (1) dots appear (2) a line wiggles into the best fit as errors shrink (3) a prediction point rides the line. " +
    "hill: (1) a ball wobbles on the rim of an error bowl (2) it hops downhill, error shrinks (3) it reaches the bottom. " +
    "overfit: (1) a wiggly line hits every dot (2) 100% on practice (3) new dots miss, a simple line fades in. " +
    "net: (1) layers pop in (2) connections with pulses (3) weights change, output lights up. " +
    "tokens: (1) word blocks drop in one at a time (2) a word splits into pieces (3) candidate next words with %, the best one flies in."),
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
  sortG: z.object({
    a: z.string().describe("Name of group A (1-3 words)"),
    b: z.string().describe("Name of group B (1-3 words)"),
    items: z.array(z.object({ text: z.string().describe("Short item, max 6 words"), group: z.enum(["a", "b"]), why: z.string().describe("Max 8 words, why it belongs") })),
  }).describe("Catch & Sort game: two groups the SOURCE clearly separates, with 6 items (3 per group). Every item must come from the SOURCE."),
});
export type Reel = z.infer<typeof ReelSchema>;
export type ModelDeck = z.infer<typeof DeckSchema>;

/** The mockup's reel shape: q is [question, options[3], answerIndex, why], pod is [[speaker,line]x2]. */
export function toMockupReel(r: Reel) {
  return {
    t: r.t, cap: r.cap.slice(0, 3), read: r.read.slice(0, 3), quotes: r.quotes.slice(0, 3), simple: r.simple,
    story: r.story.slice(0, 3), pod: r.pod.slice(0, 2).map((p) => [String(p[0] || "Pip"), String(p[1] || "")]),
    q: [r.q.question, r.q.options.slice(0, 3), r.q.answerIndex, r.q.why], jingle: r.jingle.slice(0, 2), line: r.line, v3: r.v3 === "none" ? null : r.v3, mm: [String(r.mm?.[0] || r.t), String(r.mm?.[1] || r.cap[0] || "")],
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
