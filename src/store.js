// On-device storage only. Settings -> localStorage, decks -> IndexedDB.
// Everything is wrapped in try/catch so private windows still work.
const KEY = "studyrot:v1";
const SETS = ["learn", "hard", "seen", "got", "later", "simple"];
const SAVE = ["night","pet","petName","vibe","mode","calm","dys","bionic","ruler","tint","big","notimer","sound","voice","lang","jr",
  "xp","streak","test","story","built","onboarded","src","wrong","lastDay","tapQuiz", ...SETS];

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
      const r = indexedDB.open("studyrot", 1);
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
export const saveDeck = (deck) => tx("readwrite", (st) => st.put({ ...deck, id: "current", savedAt: Date.now() }));
export const loadDeck = () => tx("readonly", (st) => st.get("current"));
