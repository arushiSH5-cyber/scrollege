# Decisions

Small calls made while building, so nothing is a surprise.

## Local only
- `git init` with **no remote**. `.git/hooks/pre-push` exits with an error, so `git push` is blocked even by accident.
- No Vercel project is linked and `vercel dev` is not used (linking would create a project on Vercel's servers).
  Instead `scripts/api-dev-server.js` runs the `/api/*.ts` handlers inside Vite for `npm run dev` and `npm run preview`.
  The handlers keep Vercel's `(req, res)` shape, so they deploy unchanged later, if you ever say "deploy it".

## Desktop + phone (one PWA)
The mockup showed the app inside a phone frame beside a pitch panel. A real app fills the window, so:
- **Phone (<600px):** identical to the mockup's full-screen phone view. Safe-area insets added for notches / home bar.
- **Tablet (600–899px):** same layout, pages centered (max 720px), reels in a 560px column.
- **Desktop (≥900px):** the 3 tabs (Feed / Make / Me) move from the bottom bar to a left rail, the 😮‍💨 button sits at the bottom of the rail,
  reels sit in a centered column (like TikTok on the web), sheets become centered panels.
- Desktop keyboard: ↑/↓, j/k, PageUp/PageDown, Space move between reels; Esc closes sheets and overlays.
- Hover states only on devices that have a mouse.
- The pitch panel ("Brain rot, but make it learning", tracks, sponsors) moved to the README; the original mockup is kept in `reference/`.
- The phone-only mode bar was nudged right on screens under 480px so it doesn't sit under the 😮‍💨 button.

## Same look, real data
- CSS, class names, colors, both themes, critters, Rotty and all wording come straight from the mockup.
- The demo deck keeps its hand-drawn scenes. AI-made decks don't have matching drawings, so each reel shows a bobbing critter instead.
- Step Tower only shows when the deck has 4+ steps (per the spec).
- three.js 0.128.0 and pdf.js 3.11.174 are bundled from npm (no CDN), so 3D and PDF reading work offline.
- 3D: renderer + geometries + textures are disposed on close, it pauses when the tab is hidden, resizes with the window,
  and falls back to the tap quiz if WebGL isn't available. Bounce/confetti also stop for `prefers-reduced-motion`.

## AI
- `claude-sonnet-5-5` builds decks and reads photos / scanned PDF pages; `claude-haiku-5-5` does Ask, Teach, Jingle, Translate.
- Structured outputs (`messages.parse` + Zod) so every response matches the deck shape.
- **Grounding check** (`api/_lib/deck.ts`): each reel's `read` bullets need a matching `quotes` entry found word-for-word in the source.
  Failing reels are dropped and regenerated once; if fewer than 3 survive, the student gets a friendly error instead of made-up reels.
- Scanned PDFs are read one page per request (max 20) so each request stays small and the student sees "Reading page 3 of 12".
- No server-side model fallback is configured. A refusal returns a friendly message instead.
- `DEMO_MODE=true`, or no `ANTHROPIC_API_KEY`, means every route answers `{demo:true}` and the app uses the sample deck and the mockup's local logic.
- If the API can't be reached (offline PWA), Make falls back to the sample deck and Ask/Teach use the local versions.
- Rate limit: in-memory per IP (per-instance once deployed).

## Storage
- Settings, XP, pet, review pile → `localStorage`. The current deck → IndexedDB. Both wrapped in try/catch.
- Onboarding shows once; "Retake the brain quiz" in Me brings it back.
- Streak = days in a row you opened the app. Missing a day quietly restarts it at 1 (no guilt screens).
