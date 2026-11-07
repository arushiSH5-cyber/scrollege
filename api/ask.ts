// POST /api/ask {question, deck, lines} -> {answer, line} or {answer:null} when it isn't in the source.
import { z } from "zod";
import { guard, isDemo, aiBudget, fail, structured, FAST, PLAIN, type Req, type Res } from "./_lib/util.js";
import { sourceBlock } from "./deck.js";

const Answer = z.object({
  inSource: z.boolean().describe("true only if the SOURCE clearly answers the question"),
  answer: z.string().describe("Short answer using only the SOURCE. Empty string if inSource is false."),
  line: z.number().int().describe("The [n] line number the answer comes from, or 0"),
});

export default async function handler(req: Req, res: Res) {
  const body = guard(req, res, { maxBytes: 300_000, perMin: 30 });
  if (!body) return;
  if (isDemo()) return res.json({ demo: true });
  if (!aiBudget(req, res, 1)) return;
  const q = String(body.question || "").slice(0, 500).trim();
  if (!q) return res.status(400).json({ error: "Ask a question first." });
  const lines = Array.isArray(body.lines) ? body.lines.slice(0, 2000) : [];
  try {
    const out = await structured({
      model: FAST, schema: Answer, maxTokens: 2000, effort: "low",
      system: `You answer a student's question using ONLY the SOURCE below. If the SOURCE does not clearly answer it, set inSource to false. Never guess and never use outside knowledge. ${PLAIN} Keep answers to 1-2 sentences.`,
      content: `<source>\n${sourceBlock(lines)}\n</source>\n\nQuestion: ${q}`,
    });
    if (!out.inSource || !out.answer.trim()) return res.json({ answer: null });
    return res.json({ answer: out.answer.trim(), line: out.line || null });
  } catch (e) { return fail(res, e); }
}
