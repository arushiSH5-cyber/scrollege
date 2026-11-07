// Takes the README screenshots from the running app (npm run dev first).
//   node scripts/screenshots.mjs [http://localhost:5173]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://localhost:5173";
mkdirSync("docs/shots", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--mute-audio"] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function phone(name, state, go, motion = false) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: motion ? "no-preference" : "reduce" });
  const page = await ctx.newPage();
  await page.addInitScript((st) => { localStorage.setItem("scrollege:v1", JSON.stringify(st)); }, { onboarded: true, built: true, sound: false, natVoice: false, learn: ["watch"], hard: [], ...state });
  await page.goto(base);
  await page.waitForSelector("#nav button");
  await page.evaluate(() => document.fonts.ready);
  if (go) await go(page);
  await wait(700);
  await page.screenshot({ path: `docs/shots/${name}.png` });
  await ctx.close();
}

await phone("hello", { onboarded: false });
await phone("live3d-sky", { theme: "sky", feed: "mine", mode: "watch" }, async (p) => { await wait(9000); }, true);
await phone("live3d-ink", { theme: "ink", feed: "explore", mode: "watch" }, async (p) => { await wait(9000); }, true);
await phone("read-sage", { theme: "sage", feed: "mine", mode: "read" });
await phone("play-sky", { theme: "sky", feed: "mine", mode: "play", tapQuiz: false });
await phone("games-sage", { theme: "sage", feed: "mine" }, async (p) => { await p.locator(".slot[data-i] [data-a='g3']").first().click(); await wait(600); });
await phone("break-sky", { theme: "sky", feed: "mine" }, async (p) => { await p.locator("#breakBtn").click(); await wait(600); });
await phone("explore-ink", { theme: "ink", feed: "around" });
await phone("fit-lab", { theme: "sky", feed: "explore" }, async (p) => { await p.locator(".slot[data-i] [data-try]").first().click(); await wait(500); });
await phone("meme-card", { theme: "sage", feed: "mine" }, async (p) => { await p.locator(".slot[data-limit] .mback").click({ force: true }); await wait(600); });
await phone("squad-sky", { theme: "sky", feed: "mine" }, async (p) => { await p.locator("#nav [data-v='squad']").click(); await wait(500); });
await phone("recap-sage", { theme: "sage", feed: "mine" }, async (p) => { await p.locator("#nav [data-v='me']").click(); await wait(300); await p.locator(".wrapban").click(); await wait(900); await p.locator(".recap").click({ position: { x: 300, y: 400 } }).catch(() => {}); await wait(900); });
await phone("quiz-run", { theme: "sky", feed: "mine", notimer: true }, async (p) => { await p.locator(".slot[data-i] [data-a='g3']").first().click(); await p.locator("#sheet [data-g='run']").click(); await wait(3000); });

const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
await page.addInitScript(() => localStorage.setItem("scrollege:v1", JSON.stringify({ onboarded: true, built: true, sound: false, natVoice: false, theme: "sky", feed: "mine", mode: "watch" })));
await page.goto(base); await page.waitForSelector("#nav button"); await wait(6000);
await page.screenshot({ path: "docs/shots/desktop.png" });
await browser.close();
console.log("screenshots -> docs/shots/");
