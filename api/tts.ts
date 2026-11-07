// GET /api/tts                         -> {on: boolean}   is the natural voice available right now?
// GET /api/tts?text=…&speed=…&mood=…   -> audio/mpeg      Cartesia text-to-speech
//
// Built to stay on Cartesia's FREE plan with many people testing:
//  - Clips are GET requests with a long CDN cache, so a sentence is made ONCE and then shared with everyone
//    (Vercel serves repeats from its cache; this function and Cartesia aren't even called).
//  - Strict daily character caps per visitor and in total (only cache misses count).
//  - If Cartesia says the credits are used up / limited / failing, the voice switches off for the rest of the day
//    and the app uses the device's own voice instead. Nothing is ever retried in a loop.
// The Cartesia key stays on the server.
import { limited, type Req, type Res } from "./_lib/util.js";

const URL_TTS = "https://api.cartesia.ai/tts/bytes";
const VERSION = "2026-08-14";
const MODEL = process.env.CARTESIA_MODEL || "sonic-3.6";
const VOICE = process.env.CARTESIA_VOICE_ID || "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4"; // "Skylar", en-US
const MOODS = ["content", "calm", "happy", "excited", "enthusiastic", "curious", "peaceful", "proud", "neutral"];
const MAX_TEXT = 400;
const TIMEOUT_MS = 6000;

let day = "", total = 0, offUntilTomorrow = false, fails = 0;
const perIp = new Map<string, number>();
function newDay() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) { day = today; total = 0; perIp.clear(); offUntilTomorrow = false; fails = 0; }
}
const ipOf = (req: Req) => String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "local").split(",")[0].trim();
const voiceOn = () => !!process.env.CARTESIA_API_KEY && process.env.TTS_OFF !== "true" && !offUntilTomorrow;

type AudioRes = Res & { end: (b?: any) => void; statusCode?: number };
const noVoice = (res: AudioRes, why: string) => { res.setHeader("Cache-Control", "no-store"); return res.status(503).json({ error: why, fallback: "device" }); };

export default async function handler(req: Req & { url?: string; query?: any }, res: AudioRes) {
  newDay();
  const q = req.query || Object.fromEntries(new URL(req.url || "/", "http://x").searchParams);
  const text = String(q.text ?? req.body?.text ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_TEXT);
  if (!text) { res.setHeader("Cache-Control", "no-store"); return res.json({ on: voiceOn() }); }
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).json({ error: "GET only" });
  if (!voiceOn()) return noVoice(res, "Natural voice is resting");
  if (limited(req, res, 60)) return;

  const per = Number(process.env.TTS_DAILY_CHARS_PER_PERSON || 2500), all = Number(process.env.TTS_DAILY_CHARS_TOTAL || 15000);
  const ip = ipOf(req), used = perIp.get(ip) || 0;
  if (used + text.length > per || total + text.length > all) return noVoice(res, "Daily voice limit reached");
  perIp.set(ip, used + text.length); total += text.length;

  const speed = Math.min(1.5, Math.max(0.6, Number(q.speed ?? req.body?.speed) || 1));
  const m = String(q.mood ?? req.body?.mood ?? "");
  const emotion = MOODS.includes(m) ? m : "content";
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(URL_TTS, {
      method: "POST", signal: ctl.signal,
      headers: { Authorization: `Bearer ${process.env.CARTESIA_API_KEY}`, "Cartesia-Version": VERSION, "Content-Type": "application/json" },
      body: JSON.stringify({
        model_id: MODEL, transcript: text, voice: { id: VOICE }, language: "en",
        output_format: { container: "mp3", sample_rate: 24000, bit_rate: 64000 },
        generation_config: { speed, emotion },
      }),
    });
    if (!r.ok) {
      const err = await r.text().catch(() => "");
      console.error("[tts]", r.status, err.slice(0, 200));
      // out of credits, plan limits, or a bad key: stop using Cartesia until tomorrow
      if ([401, 402, 403, 429].includes(r.status) || /quota|credit|limit|payment/i.test(err) || ++fails >= 5) offUntilTomorrow = true;
      return noVoice(res, "The voice had a hiccup");
    }
    fails = 0;
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    // same sentence = same URL = served from Vercel's cache for everyone after the first time
    res.setHeader("Cache-Control", "public, max-age=604800, s-maxage=31536000, immutable");
    res.statusCode = 200;
    res.end(buf);
  } catch (e: any) {
    console.error("[tts]", e?.name === "AbortError" ? "timeout" : e?.message || e);
    if (++fails >= 5) offUntilTomorrow = true;
    return noVoice(res, "The voice had a hiccup");
  } finally { clearTimeout(t); }
}
