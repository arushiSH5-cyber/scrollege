// POST /api/deck {text, lines, brain, sourceLabel} -> {deck} in the mockup's DECK shape.
// Every read bullet must be backed by a word-for-word quote from the source (grounding check).
import { z } from "zod";
import { guard, isDemo, fail, structured, SMART, PLAIN, type Req, type Res } from "./_lib/util";
import { DeckSchema, ReelSchema, groundingProblems, toMockupReel, type Reel } from "./_lib/deck";

type Line = { n: number; text: string; page?: number };

const SYSTEM = `You are Rotty, a kind study buddy who turns a student's own class material into 5 short TikTok-style study reels.
${PLAIN}
Rules you must follow:
- Use ONLY facts that are in the SOURCE. Never add outside facts, numbers, names or examples.
- For every "read" bullet, put an exact quote in "quotes" (same order) that is copied word-for-word from the SOURCE and supports it. Copy it exactly: same words, same order. Do not include the [n] line markers.
- "line" is the [n] number of the source line the reel mostly comes from.
- Quiz: one clearly right answer and two clearly wrong ones. No trick questions, no "all of the above".
- Story and jingle lines must keep the facts correct.
- Each reel covers a different big idea.`;

function brainHints(b: any): string {
  const h: string[] = [];
  if (b?.jr) h.push("The student is a young kid: use even simpler words.");
  if (b?.hard?.includes?.("reading")) h.push("The student finds walls of text hard: keep every line extra short.");
  if (b?.hard?.includes?.("english")) h.push("English is new for the student: use common everyday words.");
  if (b?.hard?.includes?.("numbers")) h.push("Break processes into clear steps.");
  return h.join(" ");
}

export function sourceBlock(lines: Line[]) {
  return lines.map((l) => `[${l.n}]${l.page ? ` (page ${l.page})` : ""} ${l.text}`).join("\n");
}

export default async function handler(req: Req, res: Res) {
  const body = guard(req, res, { maxBytes: 400_000, perMin: 10 });
  if (!body) return;
  if (isDemo()) return res.json({ demo: true });
  const lines: Line[] = Array.isArray(body.lines) ? body.lines.slice(0, 2000) : [];
  const text: string = typeof body.text === "string" ? body.text : lines.map((l) => l.text).join("\n");
  if (text.trim().length < 80) return res.status(400).json({ error: "There isn't enough in there to make 5 reels yet. Add a bit more?" });
  const validLines = new Set(lines.map((l) => l.n));
  const fixLine = (n: number) => (validLines.has(n) || !lines.length ? n : lines.reduce((a, l) => (Math.abs(l.n - n) < Math.abs(a - n) ? l.n : a), lines[0].n));

  try {
    const src = sourceBlock(lines.length ? lines : text.split("\n").map((t, i) => ({ n: i + 1, text: t })));
    const deck = await structured({
      model: SMART, schema: DeckSchema, maxTokens: 16000,
      system: SYSTEM + "\n" + brainHints(body.brain),
      content: `SOURCE (from ${body.sourceLabel || "the student's notes"}):\n<source>\n${src}\n</source>\n\nMake the deck: a title, exactly 5 reels, plus "steps" and "sort" if they fit this topic.`,
    });

    let good: Reel[] = [], bad: { reel: Reel; problems: string[] }[] = [];
    for (const r of deck.reels.slice(0, 5)) { const p = groundingProblems(r, text); p.length ? bad.push({ reel: r, problems: p }) : good.push(r); }

    // Regenerate once for any reels that failed the grounding check.
    if (good.length < 5) {
      const need = 5 - good.length;
      const again = await structured({
        model: SMART, schema: z.object({ reels: z.array(ReelSchema) }), maxTokens: 12000,
        system: SYSTEM,
        content: `SOURCE:\n<source>\n${src}\n</source>\n\nThese reels already exist: ${good.map((r) => r.t).join("; ") || "none"}.\n` +
          `These reels were rejected because their quotes were not copied exactly from the source:\n${bad.map((b) => `- ${b.reel.t}: ${b.problems.join("; ")}`).join("\n")}\n\n` +
          `Write ${need} new reel(s) on different big ideas from the SOURCE. Copy each quote exactly, word for word.`,
      });
      for (const r of again.reels.slice(0, need)) if (!groundingProblems(r, text).length) good.push(r);
    }
    if (good.length < 3) return res.status(422).json({ error: "Rotty couldn't find enough clear facts to make reels. Try notes with a few more full sentences?" });

    const steps = (deck.steps || []).filter(Boolean).slice(0, 6);
    const sort = (deck.sort || []).filter((p) => p.length === 2 && (p[1] === "in" || p[1] === "out")).slice(0, 6);
    return res.json({
      deck: {
        title: deck.title,
        reels: good.slice(0, 5).map((r) => ({ ...toMockupReel(r), line: fixLine(r.line) })),
        steps: steps.length >= 4 ? steps : [],
        sort,
      },
      dropped: 5 - Math.min(5, good.length),
    });
  } catch (e) { return fail(res, e); }
}
