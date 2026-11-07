// POST /api/teach {reel, explanation} -> {stars 1-3, mentioned[], missing[]}
import { z } from "zod";
import { guard, isDemo, fail, structured, FAST, PLAIN, type Req, type Res } from "./_lib/util";

const Grade = z.object({
  stars: z.number().int().describe("1, 2 or 3. 1 = a start, 2 = most key ideas, 3 = all key ideas, correct"),
  mentioned: z.array(z.string()).describe("Up to 4 key ideas the student got right, 1-4 words each"),
  missing: z.array(z.string()).describe("Up to 3 key ideas to add next time, 1-4 words each. Include any mix-up gently."),
});

export default async function handler(req: Req, res: Res) {
  const body = guard(req, res, { maxBytes: 30_000, perMin: 30 });
  if (!body) return;
  if (isDemo()) return res.json({ demo: true });
  const r = body.reel || {}, ex = String(body.explanation || "").slice(0, 3000);
  try {
    const g = await structured({
      model: FAST, schema: Grade, maxTokens: 1500, effort: "low",
      system: `A student is teaching a topic back to Scrolly (a cute study buddy). Compare their explanation to the KEY FACTS only. Be kind and encouraging, never shaming. Every student gets at least 1 star for trying. ${PLAIN}`,
      content: `TOPIC: ${r.t}\nKEY FACTS:\n- ${(r.read || []).join("\n- ")}\n\nSTUDENT'S EXPLANATION:\n${ex}`,
    });
    return res.json({ stars: Math.max(1, Math.min(3, g.stars)), mentioned: g.mentioned.slice(0, 4), missing: g.missing.slice(0, 3) });
  } catch (e) { return fail(res, e); }
}
