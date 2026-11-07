// Tiny client for /api/*. Returns {demo:true} when the server is in DEMO_MODE,
// and {offline:true} when the API can't be reached (e.g. offline PWA).
// A demo link can carry ?code=... (see AI_ACCESS_CODE in the README). It is remembered on this device only.
const CODE_KEY = "scrollege:code";
try { const c = new URLSearchParams(location.search).get("code"); if (c) { localStorage.setItem(CODE_KEY, c); history.replaceState(null, "", location.pathname); } } catch (e) {}
const accessCode = () => { try { return localStorage.getItem(CODE_KEY) || ""; } catch (e) { return ""; } };

export async function post(path, body, { timeoutMs = 90000 } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const r = await fetch("/api/" + path, {
      method: "POST",
      headers: { "content-type": "application/json", ...(accessCode() ? { "x-scrollege-code": accessCode() } : {}) },
      body: JSON.stringify(body),
      signal: ctl.signal,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { error: j.error || `Something went wrong (${r.status}).` };
    return j;
  } catch (e) {
    return { offline: true, error: navigator.onLine ? "Couldn't reach Scrolly's kitchen." : "You're offline." };
  } finally {
    clearTimeout(t);
  }
}
