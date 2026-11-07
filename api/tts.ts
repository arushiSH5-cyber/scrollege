// GET  /api/tts            -> {on: boolean}  (is a natural voice set up?)
// POST /api/tts {text, speed?, mood?} -> audio/mpeg  (Cartesia text-to-speech)
// The Cartesia key stays on the server. Without a key the app uses the device's own voice.
import { limited, type Req, type Res } from "./_lib/util.js";

const URL_TTS = "https://api.cartesia.ai/tts/bytes";
const VERSION = "2026-08-14";
const MODEL = process.env.CARTESIA_MODEL || "sonic-3.6";
const VOICE = process.env.CARTESIA_VOICE_ID || "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4"; // "Skylar", en-US
const MOODS = ["content", "calm", "happy", "excited", "enthusiastic", "curious", "peaceful", "proud", "neutral"];
const MAX_TEXT = 600;

/* daily character budget per visitor and in total (resets when the server restarts) */
let day = "", total = 0;
const perIp = new Map<string, number>();
function ttsBudget(req: Req, chars: number): string | null {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) { day = today; total = 0; perIp.clear(); }
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "local").split(",")[0].trim();
  const per = Number(process.env.TTS_DAILY_CHARS_PER_PERSON || 8000), all = Number(process.env.TTS_DAILY_CHARS_TOTAL || 120000);
  const used = perIp.get(ip) || 0;
  if (used + chars > per || total + chars > all) return "limit";
  perIp.set(ip, used + chars); total += chars;
  return null;
}

type AudioRes = Res & { end: (b?: any) => void; statusCode?: number };

export default async function handler(req: Req, res: AudioRes) {
  const key = process.env.CARTESIA_API_KEY;
  if (req.method === "GET") return res.json({ on: !!key });
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  if (!key) return res.status(503).json({ error: "No natural voice set up" });
  if (limited(req, res, 90)) return;
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const text = String(body.text || "").replace(/\s+/g, " ").trim().slice(0, MAX_TEXT);
  if (!text) return res.status(400).json({ error: "Nothing to say" });
  if (ttsBudget(req, text.length)) return res.status(429).json({ error: "Scrolly's voice is resting for today" });
  const speed = Math.min(1.5, Math.max(0.6, Number(body.speed) || 1));
  const emotion = MOODS.includes(body.mood) ? body.mood : "content";
  try {
    const r = await fetch(URL_TTS, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Cartesia-Version": VERSION, "Content-Type": "application/json" },
      body: JSON.stringify({
        model_id: MODEL, transcript: text, voice: { id: VOICE }, language: "en",
        output_format: { container: "mp3", sample_rate: 44100, bit_rate: 128000 },
        generation_config: { speed, emotion },
      }),
    });
    if (!r.ok) {
      const err = await r.text().catch(() => "");
      console.error("[tts]", r.status, err.slice(0, 300));
      return res.status(502).json({ error: "The voice had a hiccup" });
    }
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "private, max-age=86400");
    res.statusCode = 200;
    res.end(buf);
  } catch (e: any) {
    console.error("[tts]", e?.message || e);
    return res.status(502).json({ error: "The voice had a hiccup" });
  }
}
