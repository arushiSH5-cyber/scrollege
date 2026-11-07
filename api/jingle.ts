// POST /api/jingle {reel} -> {jingle:[line1, line2]}
import { z } from "zod";
import { guard, isDemo, aiBudget, fail, structured, FAST, type Req, type Res } from "./_lib/util";

const J = z.object({ jingle: z.array(z.string()).describe("Exactly 2 short rhyming lines") });

export default async function handler(req: Req, res: Res) {
  const body = guard(req, res, { maxBytes: 20_000, perMin: 30 });
  if (!body) return;
  if (isDemo()) return res.json({ demo: true });
  if (!aiBudget(req, res, 1)) return;
  const r = body.reel || {};
  try {
    const out = await structured({
      model: FAST, schema: J, maxTokens: 800, effort: "low",
      system: "You write catchy 2-line rhymes that help students remember facts. The rhyme must keep every fact correct and use only the FACTS given. Simple words, fun rhythm.",
      content: `TOPIC: ${r.t}\nFACTS:\n- ${(r.read || []).join("\n- ")}\n${r.jingle ? `Make it different from: ${r.jingle.join(" / ")}` : ""}`,
    });
    return res.json({ jingle: out.jingle.slice(0, 2) });
  } catch (e) { return fail(res, e); }
}
