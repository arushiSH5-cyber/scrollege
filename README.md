# StudyRot 🍃

**Brain rot, but make it learning.** Drop a PDF, notes or a photo. Get a TikTok-style feed and 3D games that fit *your* brain,
built for ADHD, dyslexic and autistic students first. Works on desktop and phone as one installable app (PWA).

> Local only. No remote, pushing is blocked by a git hook. See `DECISIONS.md`.

## Run it
```bash
npm install
npm run dev          # http://localhost:5173
```
Works with no keys (`DEMO_MODE=true` in `.env.local` → sample Photosynthesis deck).
To cook real decks, run `sh scripts/set-keys.sh` (or put your key in `.env.local` and set `DEMO_MODE=false`):

| Key | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

## Install it
- **Desktop (Chrome / Edge):** `npm run build && npm run preview`, open http://localhost:4173, click the install icon in the address bar.
- **Phone:** with `npm run dev` running, open `http://<your-computer's-IP>:5173` on the same Wi-Fi.
  It runs fully. "Add to Home Screen" works on iPhone (Safari → Share). Offline mode and the Android install button need HTTPS,
  which you get from a deploy or an HTTPS tunnel later.

## Scripts
`npm run dev` · `npm run build` · `npm run preview` · `npm run typecheck` · `npm run icons`

## Tests
```bash
npm test            # unit: grounding check + spaced review
npm run test:e2e    # Playwright: 390×844 phone in both themes + desktop, axe, mockup screenshot match
```
The e2e tests start their own dev server on port 5174 in DEMO_MODE. AI answers are faked with `page.route`,
so the real client code runs without spending API credits. `tests/fixtures/three-pages.pdf` is a real PDF (`node scripts/make-test-pdf.mjs`).

## Layout
```
index.html            app shell (from the mockup)
src/styles.css        the mockup's CSS + desktop/phone shell
src/app.js            the mockup's app, wired to real PDF reading, the API and on-device storage
src/api.js, store.js  API client, localStorage + IndexedDB
api/*.ts              source, deck, ask, teach, jingle, translate (Vercel-style handlers)
api/_lib/             Claude helper, deck schema, grounding check
reference/            the approved mockup (studyrot-v3.html)
```

## Why it works (research-backed methods, in plain words)
- **Retrieval practice:** quizzes and Teach Rotty make you pull the idea out of your head, which helps it stick better than re-reading.
- **Spaced repetition:** missed and "Later" reels come back on another day instead of all at once.
- **Pictures + words together:** every reel pairs short text with a drawing, voice or game.
