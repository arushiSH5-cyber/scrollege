// On-device storage only. Settings -> localStorage, decks -> IndexedDB.
// Everything is wrapped in try/catch so private windows still work.
const KEY = "scrollege:v1";
const SETS = ["learn", "hard", "seen", "got", "later", "simple"];
const SAVE = ["night","pet","petName","vibe","mode","calm","dys","bionic","ruler","tint","big","notimer","sound","voice","lang","jr",
  "xp","streak","test","story","built","onboarded","src","wrong","lastDay","tapQuiz","review","limit","deckId","feed","theme","cards", ...SETS];

export function loadSettings(S) {
  try {
    const j = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!j) return false;
    for (const k of SAVE) if (k in j) S[k] = SETS.includes(k) ? new Set(j[k]) : j[k];
    return true;
  } catch (e) { return false; }
}
export function saveSettings(S) {
  try {
    const o = {};
    for (const k of SAVE) o[k] = SETS.includes(k) ? [...(S[k] || [])] : S[k];
    localStorage.setItem(KEY, JSON.stringify(o));
  } catch (e) {}
}

let dbp;
function db() {
  if (!dbp) dbp = new Promise((res, rej) => {
    try {
      const r = indexedDB.open("scrollege", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("decks", { keyPath: "id" });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    } catch (e) { rej(e); }
  });
  return dbp;
}
async function tx(mode, fn) {
  try {
    const d = await db();
    return await new Promise((res, rej) => {
      const t = d.transaction("decks", mode), st = t.objectStore("decks"), out = fn(st);
      t.oncomplete = () => res(out && out.result);
      t.onerror = () => rej(t.error);
    });
  } catch (e) { return null; }
}
export const saveDeck = (deck) => tx("readwrite", (st) => st.put({ ...deck, id: deck.id || "current", savedAt: Date.now() }));
export const loadDeck = (id = "current") => tx("readonly", (st) => st.get(id));
export const deleteDeck = (id) => tx("readwrite", (st) => st.delete(id));
export const listDecks = async () => {
  const all = (await tx("readonly", (st) => st.getAll())) || [];
  return all.filter((d) => d && d.reels).map((d) => ({ id: d.id, title: d.title, sourceLabel: d.sourceLabel, demo: !!d.demo, n: d.reels.length, savedAt: d.savedAt || 0 }))
    .sort((a, b) => b.savedAt - a.savedAt);
};

/* ---------- spaced review ----------
   Missed or "Later" reels come back tomorrow. Each time you get a due one right
   it waits longer (1 -> 3 -> 7 days), then it leaves the pile. */
export const INTERVALS = [1, 3, 7];
export const dayKey = (d = new Date()) => { const x = new Date(d); x.setHours(12, 0, 0, 0); return x.toISOString().slice(0, 10); };
export const addDays = (k, n) => { const d = new Date(k + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
export function addReview(S, deckId, i, today = dayKey()) {
  S.review = S.review || [];
  const it = S.review.find((x) => x.d === deckId && x.i === i);
  if (it) { it.due = addDays(today, 1); it.step = 0; }
  else S.review.push({ d: deckId, i, due: addDays(today, 1), step: 0 });
}
/** Called when a reel is answered right / marked "Got it". Only due items move forward. */
export function passReview(S, deckId, i, today = dayKey()) {
  const it = (S.review || []).find((x) => x.d === deckId && x.i === i);
  if (!it || it.due > today) return false;
  it.step++;
  if (it.step >= INTERVALS.length) S.review = S.review.filter((x) => x !== it);
  else it.due = addDays(today, INTERVALS[it.step]);
  return true;
}
export const dueToday = (S, deckId, today = dayKey()) => (S.review || []).filter((x) => x.d === deckId && x.due <= today).map((x) => x.i);
export const dropDeckReviews = (S, deckId) => { S.review = (S.review || []).filter((x) => x.d !== deckId); };
