# Scrollege: Update Prompt for Claude Code (v9: live 3D reels that act out the captions)

Apply this **after** v5–v8. I replaced `scrollege.html` again; it's still the source of truth.
Re-read it, diff it against what you built, and bring the changes below in **exactly as they look and behave in the mockup**. All earlier rules still apply (local only, no push or deploy, secrets in `.env.local`, DEMO_MODE, tests after each step).

---

## 1. The problem we fixed
- The reel's Watch picture was a still SVG, so it looked frozen.
- The 3D video played one animation and then stopped.
- Neither matched the words on screen.

**Now every reel is a moving 3D scene, and each caption line ("beat") has its own action that acts out that exact sentence. Nothing ever freezes: idle motion, bobbing and a slow camera orbit keep running.**

## 2. One scene engine, used in two places
- **`V3K[kind](sc, kit)`** returns `{hw, hv, oc, beat(k), tick(dt, t, beatTime, k)}`:
  - `beat(k)` resets or starts that beat's action.
  - `tick` animates every frame.
  - `hw` / `hv` / `oc` let `v3cam()` auto-fit the camera to any screen shape.
  - `v3kit()` gives helpers: `ball`, `box`, `lab` (always-facing text sprites), `stick` (a cylinder between two points), `ease`.
- **In the reel (Watch mode): `liveStart()` / `liveMount()` / `liveStop()`.**
  - A transparent WebGL canvas sits inside `.live3d` on the reel you're looking at, with a shadow-only floor so the watercolor background shows through. The old SVG stays underneath as the fallback.
  - **Only one renderer exists at a time.** It's disposed on scroll, mode change, tab change, and when any game, recap or break opens; it's remounted when you come back.
  - When a new reel comes into view, captions restart at line 1 (`capK = 0`), so the story always starts from the beginning.
- **Captions drive the beats:** `tickCaps()` calls `LIVE.setBeat(capK % lines)`, so the picture always matches the sentence. A beat lasts 3.8 s (4.8 s in Calm).
- **Full-screen 🎬 Watch 3D (`video3d()`)** uses the same scenes, bigger, with Cartesia narration (Web Speech fallback) and a progress bar. After the voice ends, **the scene keeps looping** and "↻ Replay with voice / Done" buttons appear under the caption (no popup covering the scene).

## 3. The 10 scenes (`reel.v3`), one action per caption
**ML Basics (My notes):**
| Reel | `v3` | Beat 1 | Beat 2 | Beat 3 |
|---|---|---|---|---|
| What is ML? | `sort` | "Learn from examples": colored balls keep dropping into the "cats" and "dogs" bins | "Not hand-written rules": a rulebook page shakes and shrinks away ("too many rules ✗") | "Predict new things": a gray "new photo?" ball pauses, spins, turns the right color and lands in the right bin ("a cat!") |
| Features and labels | `features` | Clue tags (size, rooms, yard) orbit and pulse around a house | A "price: $450k" label pops up with a bounce | Sparks flow from each clue into the price |
| Supervised vs unsupervised | `cluster` | Balls wear name tags (cat, dog, bird) | Tags float away, balls turn gray | Balls drift into groups on their own and get colored rings |
| Training and test sets | `split` | 20 cubes fly into an 80% train pad and a 20% test pad | A critter hops over the training cubes (they glow): "studying…" | The critter hops to the test cubes and ✓ marks pop up |
| Classification vs regression | `clsreg` | A spinning "?" block | Balls drop into "spam" / "not spam" bins: "category → classification" | A ball rolls along a number line to 72°F / $450k / 8 hrs: "number → regression" |

**AI fun facts (Explore):**
| Reel | `v3` | Beat 1 | Beat 2 | Beat 3 |
|---|---|---|---|---|
| Linear regression | `scatter` | Dots pop onto the graph | The line wiggles into the best fit while orange error sticks shrink | A glowing "prediction!" point rides along the line |
| Gradient descent | `hill` | The ball wobbles on the rim of the error bowl | It takes small hops downhill, leaving footprints; the error bar shrinks | It reaches the bottom with sparkles |
| Overfitting | `overfit` | A wiggly line draws itself through every dot | "100% on practice!": the dots pulse green | New red dots miss the curve ("oops!"), then a simple straight line fades in |
| Neural networks | `net` | The layers pop in left to right | Weighted connections appear with pulses flowing | The weights thicken and thin (learning) and the output lights up |
| How chatbots write | `tokens` | Word blocks drop in one at a time | "playing" splits into "play" + "ing" | Candidates mat 70% / hat 20% / car 10% with bars; "mat" flies into the sentence |

## 4. Real app: scenes for any PDF
- The deck generator (`/api/deck`) must pick a `v3` for each reel from the 10 kinds and write the captions **so each line matches its beat** (line 1 = beat 1 action, and so on). Add `v3` to the deck schema and the grounding check.
- When no kind fits, use `scatter` or `sort` as the default and keep the captions literal.
- **Later:** let Claude choose words for the labels inside the scene (e.g. the bin names, the tag texts) via a small `v3labels` object, checked against the notes.

## 5. Performance and accessibility
- Pixel ratio ≤2, one live renderer, dispose everything, and pause when the tab is hidden.
- Calm mode: no camera orbit, slower beats. Reduced motion: show the SVG instead of live 3D. No WebGL: SVG.
- Captions always show; the 3D scene is `aria-hidden` because the caption carries the meaning.

## 6. Small fix
Squad header: removed the "Study together. Cheer each other on." subtitle.

## Tests to add
- In Watch mode, exactly one `.live3d canvas` exists, on the visible reel; scrolling moves it; switching to Listen removes it.
- Changing the caption changes the beat (`LIVE.setBeat` called with the same index).
- Every one of the 10 `v3` kinds renders all 3 beats without errors for 10 s each.
- Full-screen video keeps rendering after the narration ends, and Replay restarts the voice.

When done, give me the 3-line status: works for real / demo / next.
