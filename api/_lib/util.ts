import Anthropic from "@anthropic-ai/sdk";

export type Req = { method?: string; body?: any; headers: Record<string, any>; socket?: { remoteAddress?: string } };
export type Res = { status: (c: number) => Res; json: (o: any) => any; setHeader: (k: string, v: string) => void };

export const isDemo = () =>
  String(process.env.DEMO_MODE || "").toLowerCase() === "true" || !process.env.ANTHROPIC_API_KEY;

// Haiku for quick jobs, Sonnet for building decks and reading pictures.
export const FAST = "claude-haiku-5-5";
export const SMART = "claude-sonnet-5-5";

let _c: Anthropic | null = null;
// Use only the key from .env.local: ignore any other Anthropic token or base URL that happens to be set in the shell.
export const claude = () => (_c ||= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, authToken: null, baseURL: "https://api.anthropic.com" }));

const ipOf = (req: Req) => String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "local").split(",")[0].trim();

/* --- per-IP rate limit (in memory; good enough locally / per instance) --- */
const hits = new Map<string, number[]>();
export function limited(req: Req, res: Res, perMin = 20): boolean {
  const ip = ipOf(req);
  const now = Date.now(), win = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  win.push(now); hits.set(ip, win);
  if (win.length > perMin) { res.status(429).json({ error: "Whoa, slow down a little! Try again in a minute." }); return true; }
  return false;
}

/* --- AI budget: protects your Anthropic key on a public link ---
   - AI_ACCESS_CODE (optional): only visitors who opened the link with ?code=... get real AI; everyone else sees the sample decks.
   - AI_DAILY_PER_PERSON (default 20) and AI_DAILY_TOTAL (default 300) cap AI turns per day. A deck costs 3, everything else 1.
   These counters live in memory, so they reset when the server restarts. The hard stop is the
   monthly spend limit you set in the Anthropic Console (see README → "Keep your key safe"). */
let budgetDay = "", budgetTotal = 0;
const budgetIp = new Map<string, number>();
export function aiBudget(req: Req, res: Res, cost = 1): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== budgetDay) { budgetDay = today; budgetTotal = 0; budgetIp.clear(); }
  const code = process.env.AI_ACCESS_CODE;
  if (code && req.headers["x-scrollege-code"] !== code) { res.json({ demo: true, locked: true }); return false; }
  const perMax = Number(process.env.AI_DAILY_PER_PERSON || 20), totMax = Number(process.env.AI_DAILY_TOTAL || 300);
  const ip = ipOf(req), used = budgetIp.get(ip) || 0;
  if (used + cost > perMax) { res.status(429).json({ error: "You've used today's AI turns 🌙 The sample decks still work. Come back tomorrow!" }); return false; }
  if (budgetTotal + cost > totMax) { res.status(429).json({ error: "Scrolly's AI is resting for today 😴 The sample decks still work!" }); return false; }
  budgetIp.set(ip, used + cost); budgetTotal += cost;
  return true;
}

/** Common guard: POST only, size cap, rate limit. Returns the body or null if it already responded. */
export function guard(req: Req, res: Res, { maxBytes = 200_000, perMin = 20 } = {}): any | null {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return null; }
  if (limited(req, res, perMin)) return null;
  const body = typeof req.body === "string" ? safeJson(req.body) : req.body;
  if (!body || typeof body !== "object") { res.status(400).json({ error: "Bad request" }); return null; }
  if (JSON.stringify(body).length > maxBytes) { res.status(413).json({ error: "That's too much for one go. Try a shorter piece." }); return null; }
  return body;
}
const safeJson = (s: string) => { try { return JSON.parse(s); } catch { return null; } };

/** Turn an API failure into a friendly message (never leak keys/stack traces). */
export function fail(res: Res, e: any) {
  console.error("[api]", e?.status || "", e?.message || e);
  if (e instanceof Anthropic.AuthenticationError) return res.status(500).json({ error: "The Anthropic API key in .env.local isn't working." });
  if (e instanceof Anthropic.RateLimitError) return res.status(429).json({ error: "Scrolly is busy right now. Try again in a minute." });
  if (e instanceof Anthropic.APIError) return res.status(502).json({ error: "The AI had a hiccup. Try again?" });
  return res.status(500).json({ error: e?.userMessage || "Something went wrong. Try again?" });
}

export const PLAIN = `Write for a student around a 6th-grade reading level. Use short sentences and plain, literal words: no idioms, no sarcasm, no slang that could be misread. Be warm and never shaming.`;

/** Normalize text for word-for-word quote checks (case, whitespace, quote marks, dashes). */
export const norm = (s: string) =>
  String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();

import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";

/** One structured call: returns the parsed object or throws a friendly error. */
export async function structured<T extends z.ZodType>(opts: {
  model: string; schema: T; system: string; content: Anthropic.MessageParam["content"];
  maxTokens?: number; effort?: "low" | "medium" | "high";
}): Promise<z.infer<T>> {
  const msg = await claude().messages.parse({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 16000,
    system: opts.system,
    messages: [{ role: "user", content: opts.content }],
    output_config: { format: zodOutputFormat(opts.schema), effort: opts.effort ?? "medium" },
  });
  if (msg.stop_reason === "refusal") throw Object.assign(new Error("refusal"), { userMessage: "Scrolly can't help with that one. Try different notes?" });
  if (msg.stop_reason === "max_tokens") throw Object.assign(new Error("max_tokens"), { userMessage: "That was too long for Scrolly. Try a shorter piece." });
  if (!msg.parsed_output) throw Object.assign(new Error("no parsed output"), { userMessage: "Scrolly got muddled. Try again?" });
  return msg.parsed_output as z.infer<T>;
}
