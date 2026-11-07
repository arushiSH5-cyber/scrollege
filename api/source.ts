// POST /api/source {type:"notes"|"voice"|"pdf"|"photo", data, page?} -> {text, sourceLabel, lines:[{n,text,page?}]}
import { z } from "zod";
import { guard, isDemo, fail, structured, SMART, type Req, type Res } from "./_lib/util";

type Line = { n: number; text: string; page?: number };
const MAX_CHARS = 60_000;

/** Split prose into short numbered lines (sentence-ish chunks up to ~280 chars). */
function chunk(text: string, page?: number): Omit<Line, "n">[] {
  const sents = text.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) || [];
  const out: Omit<Line, "n">[] = []; let cur = "";
  for (const s of sents.map((x) => x.trim()).filter(Boolean)) {
    if (cur && (cur + " " + s).length > 280) { out.push({ text: cur, page }); cur = s; } else cur = cur ? cur + " " + s : s;
  }
  if (cur) out.push({ text: cur, page });
  return out;
}
const number = (ls: Omit<Line, "n">[]): Line[] => ls.map((l, i) => ({ n: i + 1, ...l }));
const linesOf = (text: string) => text.split(/\r?\n/).map((t) => t.trim()).filter(Boolean).map((t) => ({ text: t }));

const Copy = z.object({ text: z.string().describe("All the text in the image, copied exactly, line by line. Empty if there is no readable text.") });
async function readImage(dataUrl: string) {
  const m = /^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/.exec(dataUrl || "");
  if (!m) throw Object.assign(new Error("bad image"), { userMessage: "That photo didn't come through. Try again?" });
  const out = await structured({
    model: SMART, schema: Copy, effort: "low",
    system: "You copy text from photos of class notes, slides and textbook pages. Copy the words exactly as written. Do not add, fix, explain or summarize anything. Skip text you cannot read.",
    content: [
      { type: "image", source: { type: "base64", media_type: m[1] as "image/png", data: m[2] } },
      { type: "text", text: "Copy all the text in this picture exactly." },
    ],
  });
  return out.text.trim();
}

export default async function handler(req: Req, res: Res) {
  const body = guard(req, res, { maxBytes: 4_000_000, perMin: 40 });
  if (!body) return;
  if (isDemo()) return res.json({ demo: true });
  const { type, data } = body;
  try {
    let lines: Line[] = [], label = "your notes";
    if (type === "notes" || type === "voice") {
      if (typeof data !== "string" || data.trim().length < 20) return res.status(400).json({ error: "Add a bit more to your notes first." });
      lines = number(linesOf(data.slice(0, MAX_CHARS)));
      label = type === "voice" ? "what you said" : "your notes";
    } else if (type === "pdf") {
      const pages: { n: number; text: string }[] = Array.isArray(data?.pages) ? data.pages.slice(0, 40) : [];
      lines = number(pages.flatMap((p) => chunk(String(p.text || ""), Number(p.n))));
      label = String(data?.name || "your PDF").slice(0, 80);
    } else if (type === "photo") {
      const text = await readImage(String(data));
      if (!text) return res.status(422).json({ error: "Scrolly couldn't find any words in that photo. Try a clearer, closer one?" });
      const page = Number(body.page) || undefined;
      lines = number(page ? chunk(text, page) : linesOf(text));
      label = String(body.name || "your photo").slice(0, 80);
    } else {
      return res.status(400).json({ error: "Unknown source type" });
    }
    if (!lines.length) return res.status(422).json({ error: "Scrolly couldn't find any text in that." });
    const text = lines.map((l) => l.text).join("\n");
    return res.json({ text, sourceLabel: label, lines });
  } catch (e) { return fail(res, e); }
}
