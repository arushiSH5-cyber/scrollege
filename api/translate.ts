// POST /api/translate {deck, lang} -> {deck} with the same shape, translated.
import { z } from "zod";
import { guard, isDemo, aiBudget, fail, structured, FAST, type Req, type Res } from "./_lib/util";

const LANGS = ["Español", "中文", "Tiếng Việt", "हिन्दी", "العربية", "English"];
const TReel = z.object({
  t: z.string(), cap: z.array(z.string()), read: z.array(z.string()), simple: z.string(), story: z.array(z.string()),
  pod: z.array(z.array(z.string())), question: z.string(), options: z.array(z.string()), why: z.string(), jingle: z.array(z.string()),
});
const TDeck = z.object({ title: z.string(), reels: z.array(TReel), steps: z.array(z.string()), sort: z.array(z.string()) });

export default async function handler(req: Req, res: Res) {
  const body = guard(req, res, { maxBytes: 120_000, perMin: 10 });
  if (!body) return;
  if (isDemo()) return res.json({ demo: true });
  if (!aiBudget(req, res, 2)) return;
  const lang = String(body.lang || "");
  if (!LANGS.includes(lang)) return res.status(400).json({ error: "That language isn't supported yet." });
  const d = body.deck || {};
  const input = {
    title: d.title,
    reels: (d.reels || []).map((r: any) => ({ t: r.t, cap: r.cap, read: r.read, simple: r.simple, story: r.story, pod: r.pod, question: r.q?.[0], options: r.q?.[1], why: r.q?.[3], jingle: r.jingle })),
    steps: d.steps || [], sort: (d.sort || []).map((p: any) => p[0]),
  };
  try {
    const out = await structured({
      model: FAST, schema: TDeck, maxTokens: 12000, effort: "low",
      system: `Translate this study deck into ${lang}. Keep the exact same structure, item counts and order. Keep facts exactly the same. Use simple, everyday words a student would know. Keep speaker names (Scrolly, Pip) as they are. Keep chemical formulas and numbers as they are.`,
      content: JSON.stringify(input),
    });
    return res.json({
      deck: {
        title: out.title,
        reels: out.reels.map((r, k) => ({
          t: r.t, cap: r.cap, read: r.read, simple: r.simple, story: r.story, pod: r.pod, jingle: r.jingle,
          q: [r.question, r.options, d.reels?.[k]?.q?.[2] ?? 0, r.why],
        })),
        steps: out.steps,
        sort: (d.sort || []).map((p: any, k: number) => [out.sort[k] || p[0], p[1]]),
      },
    });
  } catch (e) { return fail(res, e); }
}
