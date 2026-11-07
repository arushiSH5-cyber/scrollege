# Scrollege: Build Prompt for Claude Code (local → PWA → Vercel)

Put `scrollege.html` (the approved design) next to this file, open Claude Code in that folder, and paste the kickoff message at the bottom.

---

## 0. Rules
1. **The mockup is the source of truth for the UI.** Build ON TOP of `scrollege.html`.
   - Keep its CSS, class names, colors, all three looks (☁️ Sky / 🌿 Sage / 🌙 Ink night), the critter and Scrolly drawings, wording and animations.
   - No redesign, no React, no Tailwind.
   - Split it into `index.html`, `src/styles.css` and `src/app.js` (Vite) without changing how it looks.
2. **Local only** until I say "deploy it": `git init`, commit after each feature, **no remote, no push, no deploy**. Add a `.git/hooks/pre-push` that blocks pushing.
3. **Secrets live only in `.env.local`** (git-ignored). Make an `.env.example`.
4. **Never make things up.** Every reel line must come from the student's source (section 4).
5. **`DEMO_MODE=true`** makes the whole app work with no API keys, using the sample ML Basics deck from the mockup.
6. After each step, run the tests (section 9), fix your code until they pass, then give me a 3-line status: works for real / demo / next.
7. Only stop to ask if something would change the design. Otherwise decide, write it in `DECISIONS.md`, and keep going.

## 0b. Look and feel (approved v4; keep exactly)
- **Watercolor and doodles, gender-neutral.** Soft painted backgrounds, small hand-drawn doodles (clouds, sparkles, stars, butterflies, bubbles, moon), soft shadows, no thick black outlines. **Not pink-heavy:** pink only as tiny blush on the mascot.
- **3 looks** (🎨 button cycles them; also in onboarding and Me → Brain modes):
  - ☁️ **Sky** (default): blue-to-butter watercolor sky with clouds and sparkles. Primary buttons sky blue `#5aa9d6 → #3d8fc4`.
  - 🌿 **Sage:** green and cream watercolor with butterflies and bubbles. Primary buttons sage `#6fb79a → #4f9c7f`.
  - 🌙 **Ink night:** navy watercolor swirl with stars and a moon. Primary `#7fb8ec`.
  - Secondary "play/try" buttons are butter yellow in every look. Implement as `html.th-sage` / `html.night` classes over CSS tokens, exactly as in the mockup (`S.theme`, `LOOKS`, `apply()`, `deco()`).
- **Fonts:** Fredoka for UI and headings, Nunito for reading, Lexend in easy-read mode.
- **Mascot: Scrolly**, an original white doodle cat with a wobbly outline, a two-leaf sprout on its head, whiskers, a curly tail and tiny peach blush (`rotty(mood)`: happy, excited, sleepy, thinking, proud). It must stay original: no forehead stripes, no bow, not based on any existing character. Critters: Mochi, Pickle, Waddles, Boba, Toast, Miso.
- **Short, warm wording.** Never a wall of text. Feeds show at most one short caption at a time.

## 1. What Scrollege is
- **Tracks:** Impact (education + accessibility) and Create (games, jingles, stories).
- **One-liner:** "Doomscrolling, but you actually pass." Notes, a link or a photo become a TikTok-style feed that fits *your* brain, built for ADHD, dyslexic and autistic students first.
- **Engagement rule:** it should be **healthy sticky**, built like TikTok but ending like a good teacher:
  - a daily limit (default 5 reels, adjustable)
  - no infinite scroll, no ads
  - no guilt streaks (pets nap, they never get sad or die)
  - celebrations at the end instead of "one more"

## 2. Stack
- **Front end:** the mockup in vanilla HTML/CSS/JS (bundle with Vite so three.js and pdf.js load locally), as a **PWA**.
  - `manifest.webmanifest`: name, icons (render Scrolly to PNG at 192/512 and maskable), `theme_color` per theme, `display: standalone`.
  - **Service worker:** cache the app shell; save decks offline in **IndexedDB**.
- **API:** Vercel serverless functions in `/api` (Node 20, TypeScript). Locally, run `vercel dev`.
- **AI:** Anthropic API.
  - `claude-haiku-5-5` for quick tasks (ask, teach-back grading, translate).
  - `claude-sonnet-5-5` for building decks and vision (reading photos).
  - Check current model names at docs.claude.com.
- **Firecrawl:** the official `@mendable/firecrawl-js` SDK turns a link into clean markdown. Check the current docs for the scrape call.
- **Voice:** the browser's built-in speech tools (speechSynthesis to speak, Web Speech API to listen). Free, and no keys needed.
- **Music:** WebAudio for jingle beats, exactly like the mockup.
- **Storage:** on the device only (IndexedDB + localStorage, both wrapped in try/catch). No accounts in v1, which keeps it private by default.
- **Env:** `ANTHROPIC_API_KEY`, `FIRECRAWL_API_KEY`, `DEMO_MODE`.

## 3. Screens (match the mockup exactly; keep it simple: 3 tabs)
- **Onboarding** (4 short screens):
  1. Hello + **Pick your look** (☁️ Sky / 🌿 Sage / 🌙 Ink night) + Scrollege Jr.
  2. Brain quiz Level 1 (Watch/Listen/Read/Play).
  3. Level 2 (what makes studying hard; no diagnosis needed).
  4. Brain card with auto-applied settings + **pick a study buddy**.
- **➕ Make:** 📄 **PDF** (default), 📝 Notes, 🔗 Link (Firecrawl), 📷 Photo; an optional test date; "Cook my feed".
- **Both feeds are AI-themed for the demo:** the My notes sample is **ML Basics class notes** (what ML is, features and labels, supervised vs unsupervised, train/test split, classification vs regression); the AI fun facts pack (opened from 🌍 Around) has no overlapping topics.
- **📱 Feed has two tabs** pinned at the top: **📚 My notes** (the deck made from the student's PDF/notes) and **🌍 Around** (what's happening around this topic). See 3e.
  - **🤯 AI fun facts** (opened from Around) is a ready-made 5-reel pack: linear regression, gradient descent, overfitting, neural networks, how chatbots write. Same reel format, 3D games (its Step Tower = how a chatbot replies) and Ask (answers only from that pack). Store packs as JSON in `/packs/*.json`.
  - **🧪 Fit-the-line lab** on the linear regression reel: tap to add dots, real least-squares fit drawn live, the equation y = mx + b, average squared error, and an "add a weird dot" outlier button. Port `fitLab()` exactly.
- **📱 Each feed:** 5 reels.
  - Modes: Watch (with **🎬 Watch in 3D**, see 3d), Listen (karaoke + narrator vibes), Read (bionic, ruler, simpler), Play (**launches Quiz Run 3D**, with a "simple tap quiz" option for accessibility).
  - Rail: ✅ Got it, 🎮 3D quiz, 💬 Ask, ⋯ More (jingle, review tomorrow, Teach Scrolly, story mode, simpler, translate, source, share with class, report).
  - **Game time** slot after reel 3 (Quiz Run 3D + Step Tower 3D), then the daily-limit celebration with the pet and a **face-down meme card to flip** (see 3f).
- **🧸 Me:** stats, pet, and folded sections: 🃏 My card binder, 🎯 Focus tools (Just 1 reel, Study with Scrolly, I'm overwhelmed, test date, review pile), 🧠 Brain modes, Jr, teacher page, privacy, change buddy, retake quiz.
- **Header:** ← back, 🫧 Need a break (on every screen), 🎨 look, 🍃 Calm, ? Help.
- **Don't add more features to the main screens.** The user wants it simple; extras go in ⋯ More or folded sections.

## 3b. PDF (must really work)
- Read the PDF **in the browser** with `pdfjs-dist` (npm; the mockup uses v3.11.174) and extract the text **per page**. Show "N pages · M words" and a preview.
- Send `{pages:[{n, text}]}` to `/api/source`. Source chips show **"From <file>.pdf, page N"**, and Ask answers cite the page.
- **Scanned PDFs** (no text layer): render each page to an image and run it through Claude vision to copy the text (max 20 pages), with clear progress.
- **Limits:** 40 pages / 15 MB in v1, with a friendly message when it's over. Password-protected PDFs get a clear error. Nothing is uploaded except the extracted text.

## 3c. 3D games (real games built from the class material)
- **three.js:** use the npm package, pinned to **0.128.0** to match the mockup's API (`outputEncoding`, `sRGBEncoding`). Bundle it locally (no CDN) so it works offline as a PWA.
- **Quiz Run 3D** (`quizRun(startIndex)`):
  - A pastel 3-lane track with trees, fog, soft shadows and the critter runner.
  - Each question from the deck becomes a gate with 3 answer panels (canvas-texture labels), shuffled.
  - Move lanes with ← →, 1/2/3, swipe, or the big answer buttons at the bottom.
  - **Correct:** +10 ⭐ and confetti. **Wrong:** the panel turns red, the "why" shows, and the question comes back at the end (mistake replay).
  - **No-timer mode:** the gate stops and waits until the player picks. **Calm:** slower, no bounce or confetti.
  - Results card at the end.
- **Step Tower 3D** (`stepTower()`): 3 floating step blocks (the right next step + 2 others). Tap a block or its matching colored button; correct blocks fly onto the tower and the camera rises; wrong blocks shake with a hint.
- **Game data comes from the deck:** `q` for Quiz Run, `steps[]` for Step Tower (add `steps` to the deck JSON; 4–6 steps when the topic has a process, otherwise skip that game).
- **Performance and accessibility:**
  - Pixel ratio ≤2, dispose the renderer on close, pause when the tab is hidden.
  - Every 3D action also has an on-screen button, so screen readers and keyboards work.
  - Respect reduced motion.
  - If WebGL isn't available, fall back to the tap quiz.

## 3d. 🎬 3D video reels ("Watch in 3D")
- Every reel's Watch mode has a **🎬 Watch in 3D** button. It plays a ~12-second animated three.js scene (`video3d(reel)`), one caption per beat with word-by-word pop-in, narration (Web Speech now, ElevenLabs later), a progress bar, a slow camera orbit, then "↻ Replay / Done".
- **Scene types** (`reel.v3`): `scatter` (dots appear, best-fit line grows), `overfit` (dots, wiggly memorizing curve, then the simple line), `hill` (ball rolls down a loss bowl leaving a trail = gradient descent), `net` (layers of nodes with pulses flowing along weights), `tokens` (word blocks drop in one at a time = next-token prediction), `split` (20 cubes fly into an 80% train pad and a 20% test pad), `sort` (balls drop into two labeled bins = classification), `cluster` (balls drift into groups with no bins = unsupervised).
- The deck generator picks `v3` for each reel from this list (add it to the deck JSON schema). The camera auto-fits the scene to the phone's aspect ratio (see the mockup's `HW`/`OC` maps).
- **Calm mode:** slower beats, no orbit. **Reduced motion:** show the final frame with captions only. If WebGL isn't available, hide the button.
- Optional later: export the 3D video as an MP4 for sharing (MediaRecorder on the canvas).

## 3e. 🌍 Around tab (stay up to date)
Four short sections, in this order:
1. **🤯 AI fun facts** card → opens the fun-facts reels.
2. **📰 Fresh in AI:** 3 news cards. Each has a headline, one plain sentence, a **"Why it matters"** line for students, and a **source link with the outlet and date**. The mockup uses 3 real headlines from AI Weekly (Nov 5, 2026), labeled as demo picks. Real app: `/api/around?topic=` searches news for the deck's topic (see section 11), keeps only items with a working source URL, and has Claude write the one-liner and "why it matters" **only from the fetched article text** (reject anything it can't ground). Cache for 6 hours.
3. **🧭 Next topics for you:** 6 chips (topics related to the deck, e.g. logistic regression, decision trees, k-means). Chips that exist in a pack jump to that reel; others make a mini 5-reel feed on the spot.
4. **🛠 Try a project:** 3 beginner projects with level, time and 4 steps in a sheet + "Save this project" (mockup: sleep vs grades regression, mini spam detector, cluster your playlist). Real app: generated from the deck's topic.
- Never invent news, numbers or quotes. If search fails, show "No fresh news right now" instead of filler.

## 3f. 🃏 Meme cards (end-of-feed reward)
- At the end of each feed (the daily-limit slot) a face-down card wobbles. Tapping it flips it (3D flip animation) into an **original collectible study card**: title, type (✨ SPELL CARD or ⚡ TRAP CARD), Scrolly doodle art with a prop, a funny but accurate "effect" text, and the footer "SCROLLEGE · STUDY CARD".
- Our own frame design (sage-teal for spells, lavender for traps). Do not copy any trading-card game's frame, logo, card names or art.
- Demo cards: ML Basics → Overfit Trap, Test Set Shield, Label Detective. AI fun facts → Gradient Slide, Next Token Please, Outlier Alert. Real app: the deck generator writes 3 cards per deck (`cards[]`: title, type, art key, effect ≤ 140 chars, kind and school-appropriate, must be true to the topic).
- **Save** (PNG of the card) and **Share** (Web Share API). Pulled cards go to **🃏 My card binder** in Me (saved in IndexedDB).

## 4. AI pipeline (real versions of the mockup's demo)
- **`POST /api/source`** `{type:"notes"|"link"|"photo"|"voice", data}` → `{text, sourceLabel, lines[]}`
  - link: Firecrawl scrape → markdown → plain lines
  - photo: Claude vision copies the text exactly
  - notes/voice: split into numbered lines
- **`POST /api/deck`** `{text, lines, brain}` → a deck JSON **in exactly the mockup's `DECK` shape**: `title`, then 5 reels each with `{t, cap[3], read[3], simple, story[3], pod[[speaker,line]x2], q[question, options[3], answerIndex, why], jingle[2], line, quotes[]}`, plus `sort[[word,"in"|"out"]]` and `steps[]`.
  - The prompt asks for plain language at about a 6th-grade level, literal wording (no idioms), and short sentences.
  - **Grounding check in code:** every `read` item must include `quotes` that appear word-for-word in the source text. Drop any reel that fails, and regenerate once.
  - Wrong quiz answers must be clearly wrong, not trick questions.
- **`POST /api/ask`** `{question, deck, lines}` → answer only from the source, with `{answer, line}`. If it isn't there, return `{answer:null}` so the UI shows "not in your notes" (the mockup's behavior).
- **`POST /api/teach`** `{reel, explanation}` → `{stars 1-3, mentioned[], missing[]}`. Be kind, never shaming.
- **`POST /api/jingle`** `{reel}` → a 2-line rhyme that keeps the facts correct.
- **`POST /api/translate`** `{deck, lang}` → the same shape, translated.
- **Rate limits:** a per-IP limit on every route, plus max input sizes.

## 5. Brain modes (all must really work)
| Mode | What it does |
|---|---|
| **Calm** | Turns off animations and sounds, softens colors, shows "Next: …" |
| **Easy-read** | Lexend font, wider spacing |
| **Bionic** | Bolds the first half of each word |
| **Ruler** | A highlight band that follows the pointer or touch in Read |
| **Tints** | Peach, blue, lilac or mint overlay |
| **Big text** | Larger text everywhere |
| **No-timer** | No countdowns anywhere |
| **Voice answers** | Answer quizzes and Teach Scrolly by speaking |
| **Sounds** | On/off for the little beeps |
| **Jr** | Big text, simpler words, no sharing |

- The **brain quiz sets these automatically** using the mockup's mapping (`ONS`), and students can change them anytime.
- **Accessibility:** WCAG 2.2 AA in **both** themes, labels on everything, keyboard friendly, `prefers-reduced-motion` respected.

## 6. Create track features
- Jingle maker with 3 beats (Lo-fi, Pop, Lullaby) and karaoke lines.
- Story mode with critter characters.
- Narrator vibes.
- 3D games built from the notes (Quiz Run 3D, Step Tower 3D).
- Brain card and sticker book.

## 7. Sponsors
- **Firecrawl:** link → reels, plus source chips.
- **Lovable:** build the teacher/parent page (`/teacher`: share a deck code with a class, see class progress) in Lovable, then link to it from Me. Keep it separate from this repo.
- **Cleanshot:** record the demo.
- **Algoverse / YRI:** the README cites research-backed methods (retrieval practice, spaced repetition, pictures + words) in plain words, without making up any statistics.

## 8. Ship it
- `scripts/preflight.sh`: checks env vars, that Anthropic and Firecrawl respond, that the PWA manifest and service worker load, and runs Lighthouse PWA and accessibility checks.
- `scripts/deploy.sh`: runs only when I type DEPLOY.
  1. Run the tests.
  2. Remove the pre-push hook.
  3. `gh repo create scrollege` and push.
  4. `vercel --prod` with the env vars copied in.
  5. Print the URL and a QR code PNG for it.
- `DEVPOST.md` draft and `DEMO.md` (a 2-minute script).

## 9. Tests
- **Playwright smoke tests** at a 390×844 viewport, in **both themes**:
  - onboarding and the brain card
  - make (all 4 inputs, with the AI mocked), including **a real 3-page test PDF** whose page text is extracted and shown
  - **Quiz Run 3D** played to the end with keyboard and buttons (right and wrong answers, no-timer waiting); **Step Tower 3D** completed
  - every reel mode
  - wrong then right answers
  - jingle, Ask (in notes vs not in notes), Teach Scrolly
  - focus timer, overwhelmed flow, daily limit
  - Me toggles, back navigation
- **No horizontal scroll** at 390 px.
- **axe-core:** 0 serious issues.
- **Screenshot comparison** against `scrollege.html` for each screen (≤2% difference).
- **Grounding test:** a deck reel with a made-up quote gets rejected.

## 10. Build order
1. Split the mockup into files with Vite (three.js + pdf.js from npm) + PWA (manifest, service worker, icons, offline) + DEMO_MODE.
2. `/api/source` + `/api/deck` + the grounding check, then real decks flowing into the feed.
3. Ask, Teach, Jingle, Translate.
4. Saving decks, XP, pet and review pile in IndexedDB, plus spaced review (missed and "Later" reels come back the next day).
5. 🌍 Around (`/api/around`) with real news + sources, 🎬 3D video reels, 🃏 meme cards and the binder.
6. Polish, tests, the deploy kit.

## 11. Apps and APIs to connect (accuracy, sources, smooth journey)
All keys go in `.env.local` only. Each one has a DEMO_MODE mock. Start with the **must-haves**.

| Priority | App / API | What it does in Scrollege |
|---|---|---|
| Must | **Anthropic API** (Claude) | Decks, Ask, Teach Scrolly, cards, news summaries, grounding check |
| Must | **Firecrawl** (sponsor) | Any link → clean text; fetch full news articles for Around before summarizing |
| Must | **pdf.js** (already in) | Reads PDFs in the browser |
| Must | **A web/news search API** (Keenable, Exa, or Tavily) | Around → Fresh in AI, with real URLs and dates |
| Nice | **arXiv API** + **Semantic Scholar API** (free) | "Go deeper" papers for a topic, with citations |
| Nice | **Wikipedia REST API** (free) | Short definitions and "next topics" checks |
| Nice | **YouTube Data API** | 1–2 related explainer videos per topic (link out, no download) |
| Nice | **Wolfram\|Alpha API** | Double-checks math in quiz answers and the fit-line lab |
| Nice | **OpenStax** (free textbooks) | Trusted extra reading links |
| Later | **Google Drive / Canvas LMS / Notion** import | Pull class slides and notes straight in |
| Later | **ElevenLabs** | Nicer narrator voices for Listen and 3D videos |
| Later | **Supabase** | Accounts and sync across devices (no accounts in Jr) |
| Sponsor | **Lovable** | Teacher/parent page |
| Sponsor | **Cleanshot** | Recording the demo video |
- **Sources everywhere:** every reel, news card and answer shows where it came from (page/line, or outlet + date + link).
- Check model names, prices and rate limits on each provider's docs before wiring them in.

---

## Kickoff message (paste into Claude Code)
```
Read SCROLLEGE_BUILD_PROMPT.md fully, then read scrollege.html fully.
scrollege.html is the approved design: build ON TOP of it, no redesign (section 0).
Work locally only: git init, commit often, add a pre-push hook that blocks pushing,
no remote, no deploy until I say "deploy it". Don't wait for API keys: use DEMO_MODE
mocks until I add them to .env.local. Follow the build order in section 10, run the
tests in section 9 after each step, and give me the 3-line status each time.
At the end, list the keys I need and where to get each.
```
