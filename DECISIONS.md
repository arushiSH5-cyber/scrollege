# Decisions

## Voice + click sounds
- Every button plays a soft note from a happy 5-note scale (switches go up when on, down when off). A button that already has its own sound (pop, flip, cheer) doesn't also click. Follows Sounds, Calm mode and Volume.
- Read-aloud uses **Cartesia** (`sonic-3.6`, voice "Skylar" by default, `CARTESIA_VOICE_ID` to change) through `/api/tts`, so the key stays on the server.
  Narrator vibes map to Cartesia emotions (Chill → content, Hype → excited, Cozy → calm, Gamer → enthusiastic); Calm mode and the break activities use "calm".
  Lines are cached on the device for the session. Daily character caps per visitor and in total protect the key.
- No Cartesia key (like the public demo) or offline: the app picks the most natural voice the device has (Siri/Premium/Natural/Google voices first) instead of the default robot one.
- Me → Brain modes shows a 🗣 Natural voice switch when Cartesia is set up.
- Test browsers run with `--mute-audio`.

## Scrollege v7 (approved design: reference/scrollege-v7.html)
- The v7 prompt says "apply after v5 and v6"; those two prompts were never shared, so their changes were taken from the v7 mockup itself:
  hand-drawn doodle icons, redesigned critters, soft WebAudio sound effects + lo-fi game music (Me → volume, music, haptics),
  a shorter onboarding (hello → how you learn → brain card), 2 study buddies, 🧭 Explore tab (was 🌍 Around) with a "← Explore" back tab
  from the fun-facts reels, progress dots, and a rail of Watch 3D · Games · Ask · More ("Got it" left the rail; right answers still count).
- **Play mode:** each reel features its own game (Quiz Run, Bubble Pop, Whack-a-Word, Hoop Shot, Gone Fishing), with 🎮 Other games and Simple tap quiz.
  Game time shows all 8 games. Catch & Sort and Step Tower only appear when the deck has the data for them.
- AI decks now also write a memory-match pair per reel (`mm`) and Catch & Sort groups (`sortG`). Older saved decks get a simple memory-match fallback.
- Watch 3D on the rail only shows for reels that have a 3D scene (ML/data topics).
- **🫧 Break menu:** mood faces (never stored), 7 activities, a guided player (pause, next, progress), "Nice break 💛", and the counselor line.
  Steps are read aloud with the browser's own voice. Cartesia would need its own API key, so it isn't wired in yet.

## Published (Nov 7, 2026)
- GitHub: public repo arushiSH5-cyber/scrollege. Commits credited to the owner's GitHub identity; the pre-push block was removed when the owner asked to publish.
- Vercel: https://scrollege.vercel.app in demo mode, connected to the GitHub repo: every push to `main` deploys automatically (DEMO_MODE=true is a project environment variable) (no key on Vercel, so it costs nothing). `.vercelignore` keeps `.env*` from ever being uploaded.
- API imports use explicit `.js` paths: Vercel runs the functions as plain Node ES modules, which need them.
- Key protection for when real AI is turned on: per-visitor and total daily caps, optional `AI_ACCESS_CODE`, plus a Console spend limit (README).

## Tested with a real Claude key (Nov 7, 2026)
- Notes → deck (water cycle): 5/5 reels passed the quote check, fair quizzes, steps + 3 cards. ~17 s.
- PDF (3 pages) → deck with correct "page N" chips. Photo of notes → Claude vision read it → accurate deck.
- Ask (answers + line, and "not in your notes" when it isn't), Teach (kind 1–3 stars), New rhyme, Translate (Spanish) all work.
- Fixes from that test: the 3D scenes only fit ML/data topics, so the deck now picks `none` for other subjects (button hidden);
  titles and captions must stay as accurate as the facts (one title had said glucose goes "in").
- The app's Claude client uses only the key in `.env.local` and the real API address, so other Anthropic settings on the computer can't leak in.
  After changing `.env.local`, restart `npm run dev` (Vite's auto-restart kept the old key).

## Scrollege v4 (approved design: reference/scrollege-v4.html)
- Watercolor + doodles, 3 looks: ☁️ Sky (default), 🌿 Sage, 🌙 Ink night. 🎨 in the header cycles them; also in onboarding and Me → Brain modes.
  Picking a look in Me keeps the section you were in open (the mockup re-drew Me and closed it).
- Scrolly is now the doodle cat with a sprout (the mockup's `rotty()`); icons are rendered from that same drawing on the Sky gradient.
- The sample deck is **ML Basics** (5 reels, Step Tower = steps of an ML project). The Explore pack JSON was updated from v4
  (Step Tower = how a chatbot replies, 3D scene per reel, its 3 meme cards).
- Feed tabs: 📚 My notes | 🌍 Around. Around has 🤯 AI fun facts, 📰 Fresh in AI, 🧭 Next topics, 🛠 Try a project, exactly as the mockup.
  - **News is the mockup's 3 demo picks** (real headlines, AI Weekly, Nov 5 2026, with links). `/api/around` with live news needs a
    news/search API key (Keenable, Exa or Tavily) and is not built yet.
  - Next-topic chips that exist in the pack jump to that reel; the others show "Cooking a mini feed… (demo)".
- 🎬 Watch in 3D (`video3d`) ported exactly. The button is hidden when WebGL isn't available or a reel has no scene.
  AI decks now pick a scene per reel (`v3`) from the 8 kinds.
- 🃏 Meme cards ported exactly; the AI deck now writes 3 cards per deck (`cards`). Pulled cards are saved with your settings and show in Me → 🃏 My card binder.
  Save / Share on a card are still the mockup's demo toasts (real PNG + Web Share is a next step).
- Still no Firecrawl / 🔗 Link.

## Now Scrollege (new approved design: reference/scrollege.html)
- Same app, renamed: StudyRot → **Scrollege**, Rotty → **Scrolly** (also in the AI prompts and podcast lines).
- The soft, bubbly skin from the mockup is used as-is (gradients, no thick outlines, jelly buttons, floating tab bar, drifting critters).
- Header: ← back, 🫧 Need a break, 🌗, 🍃, ?. The old floating 😮‍💨 button is hidden, as in the mockup.
- **Feed has two tabs:** 📚 My notes (your deck) and ✨ Explore. Explore works before you make anything and answers offline.
- Explore packs live in `public/packs/*.json` (`index.json` lists them). The first is "AI fun facts", copied exactly from the mockup.
  Its drawings stay in `app.js` (packs point at them with `sc`). A pack without drawings shows a critter.
  `stepsOf` names what Step Tower stacks ("training an AI model").
- 🧪 Fit-the-line lab (`fitLab()`) is ported exactly: real least-squares, y = mx + b, average squared error, "add a weird dot".
- Ask, Teach, Jingle and Translate on Explore use the local versions (the pack is the source). On your own deck they use Claude.
- Test date on Make is now a folded "Got a test coming up?" section (from the mockup).
- Storage keys renamed (`scrollege:v1`, IndexedDB `scrollege`), so StudyRot test data on this computer is not carried over.
- Still no Firecrawl / 🔗 Link (you asked to leave it out for now).
- App icons: Scrolly on the pink → lilac → mint gradient.


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

## Saving and review (step 4)
- Every deck you cook is saved in IndexedDB under its own id. Me → 📚 My decks lists them to open or delete (delete asks first).
- Review pile lives with your settings: `{deck, reel, due, step}`. Missing a quiz or tapping "Review tomorrow" puts a reel in it, due tomorrow.
  Getting a *due* reel right moves it to 3 days, then 7 days, then out of the pile. Missing it again resets to tomorrow.
- Due reels show first in the feed with a "🔁 Review" tag.
- Daily limit: 5 reels by default, 3 as a gentler option (Me → Focus tools). Decks have 5 reels, so a higher limit wouldn't change anything.

## Tests (step 5)
- Playwright at 390×844 in both themes, plus one desktop test at 1280×800. AI is mocked at the network level.
- Screenshot match against the mockup: hello, brain quiz and Make screens (both pages loaded side by side, animations frozen). Currently 0% different.
  The feed isn't compared because its captions rotate on a timer.
- axe: 0 serious/critical issues on onboarding, feed, Make, Me (all sections open) and the Ask sheet.

## Bugs found by the tests and fixed
- No-timer mode in Quiz Run 3D didn't actually wait: showing the starting lane on each new gate counted as a pick. Now the gate waits for a real pick.
- Make's input tabs used `role="tab"` with `aria-pressed` (not allowed) and the test name/date inputs had no labels.

## Firecrawl removed (for now)
- The 🔗 Link input, the `link` branch of `/api/source`, the `@mendable/firecrawl-js` package and `FIRECRAWL_API_KEY` are gone.
  Make offers 📄 PDF, 📝 Notes and 📷 Photo. To bring links back, restore them from commit bda5bc6.
