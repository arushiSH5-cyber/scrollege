# Scrollege: Update Prompt for Claude Code (v7: break activities + Play mode games)

Apply this **after** SCROLLEGE_UPDATE_v5.md and v6.md. I replaced `scrollege.html` again; it's still the source of truth.
Re-read it, diff it against what you built, and bring the changes below in **exactly as they look and behave in the mockup**. All earlier rules still apply (local only, no push or deploy, secrets in `.env.local`, DEMO_MODE, tests after each step).

---

## 1. Play mode: a different game on each reel (no more Quiz Run everywhere)
- Before, every reel in 🎮 Play mode showed the same "Quiz Run 3D" card. Now each reel features a **different game** (`FEAT = ["run","bubble","whack","hoop","fish"]`, by reel index).
- The Play card (`.playcard`) shows the game's doodle icon, name and one line, a big **▶ Play**, and two chips: **🎮 Other games** (opens the picker) and **Simple tap quiz**.
- The tap quiz's "Play it as a game instead" opens that reel's featured game.
- `[data-run="<game>"]` → `playGame(key, reelIndex)`; `[data-gp]` → `gamePicker(i)`. The old `ROAD` picture is no longer used on reels.

## 2. 🫧 Break bubble: real relax activities
The 🫧 header button now opens a **break menu** (`breathe()` → `.ov.relax`) instead of just one breathing screen:
- **"How do you feel?"** 4 small Scrolly faces (stressed, tired, stiff, okay). Tapping one highlights a suggested activity (stressed → Box breathing, tired → Water + wiggle, stiff → Desk stretch, okay → Eye break). Never required; don't store moods.
- **7 activity cards** (`RELAX`, with doodle icons from `RIC`):
  1. **Box breathing** (1 min): in 4, hold 4, out 4, hold 4; a dot travels around a square while Scrolly grows and shrinks.
  2. **Desk stretch** (2 min): neck tilts, shoulder rolls, reach up, seated twist, wrist circles. Ends with "Stop any move that hurts."
  3. **Squeeze & let go** (1 min): fists, shoulders, face, feet: hold 5 s, then release.
  4. **Eye break 20-20-20** (20 s): look about 20 feet away for 20 seconds, then blink.
  5. **5-4-3-2-1** (1 min): see, feel, hear, smell, taste.
  6. **Water + wiggle** (2 min): get water, shake out, walk once around the room.
  7. **Bubble wrap:** 30 bubbles to pop, each with the `pop` sound.
- **Guided player** (shared by activities 1–6):
  - one short step at a time in big text, a seconds countdown, an overall progress bar, ⏸ Pause / Next →, and a Scrolly animation per activity
  - steps are read aloud with **Cartesia** (Web Speech fallback) unless Sounds is off or Calm is on
- **After any activity:** "Nice break 💛" with **▶ Watch just 1 reel**, **Another break**, and **I'm done for today**.
- **Footer line** in the menu: "If you feel really low or unsafe, please talk to someone you trust or your school counselor."
- **Rules:**
  - Keep the wording gentle and physical (no medical claims).
  - Calm mode turns off all the animations.
  - Every step can be skipped.
  - Nothing is timed against the student.

## Tests to add
- In Play mode, reels 1–5 show 5 different games, and ▶ Play opens that game.
- Other games opens the picker; Simple tap quiz still works.
- The 🫧 menu shows 7 activities; a mood face highlights the suggested one.
- Each guided activity can be paused, skipped to the end, and reaches the "Nice break" screen.
- Bubble wrap counts pops; ← always returns to the menu, and ← on the menu closes it.

When done, give me the 3-line status: works for real / demo / next.
