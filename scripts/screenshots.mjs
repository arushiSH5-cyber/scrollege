// Takes the README screenshots from the running app (npm run dev first).
//   node scripts/screenshots.mjs [http://localhost:5173]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://localhost:5173";
mkdirSync("docs/shots", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--mute-audio"] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function phone(name, state, go) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.addInitScript((st) => { localStorage.setItem("scrollege:v1", JSON.stringify(st)); }, { onboarded: true, built: true, sound: false, learn: ["watch"], hard: [], ...state });
  await page.goto(base);
  await page.waitForSelector("#nav button");
  await page.evaluate(() => document.fonts.ready);
  if (go) await go(page);
  await wait(700);
  await page.screenshot({ path: `docs/shots/${name}.png` });
  await ctx.close();
}

await phone("hello", { onboarded: false });
await phone("feed-sky", { theme: "sky", feed: "mine" });
await phone("read-sage", { theme: "sage", feed: "mine", mode: "read" });
await phone("around-ink", { theme: "ink", feed: "around" });
await phone("fit-lab", { theme: "sky", feed: "explore" }, async (p) => { await p.locator(".slot[data-i] [data-try]").first().click(); await wait(500); });
await phone("meme-card", { theme: "sage", feed: "mine" }, async (p) => { await p.locator(".slot[data-limit] .mback").click({ force: true }); await wait(600); });
await phone("quiz-run", { theme: "sky", feed: "mine", notimer: true }, async (p) => { await p.locator(".slot[data-i] [data-a='g3']").first().click(); await wait(2500); });

const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.addInitScript(() => localStorage.setItem("scrollege:v1", JSON.stringify({ onboarded: true, built: true, sound: false, theme: "sky", feed: "mine" })));
await page.goto(base); await page.waitForSelector("#nav button"); await wait(800);
await page.screenshot({ path: "docs/shots/desktop.png" });
await browser.close();
console.log("screenshots -> docs/shots/");
