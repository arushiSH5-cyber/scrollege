// Records short looping GIFs of the app for the README (npm run dev first; audio muted).
//   node scripts/demo-gif.mjs [http://localhost:5173]
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://localhost:5173";
mkdirSync("docs/gifs", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--mute-audio"] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function record(name, state, { frames = 40, every = 200, width = 300, before } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.addInitScript((st) => localStorage.setItem("scrollege:v1", JSON.stringify(st)),
    { onboarded: true, built: true, sound: false, natVoice: false, learn: ["watch"], hard: [], ...state });
  await page.goto(base);
  await page.waitForSelector("#nav button");
  await page.evaluate(() => document.fonts.ready);
  if (before) await before(page);
  const shots = [];
  for (let i = 0; i < frames; i++) {
    shots.push(await sharp(await page.screenshot()).resize(width).png().toBuffer());
    await wait(every);
  }
  await sharp(shots, { join: { animated: true } }).gif({ delay: Array(frames).fill(every), loop: 0, effort: 7, colours: 96 }).toFile(`docs/gifs/${name}.gif`);
  await ctx.close();
  console.log("gif ->", name);
}

// a live 3D reel acting out its captions
await record("live-reel", { theme: "sky", feed: "explore", mode: "watch" }, { frames: 48, before: async () => { await wait(1500); } });
// the break menu → box breathing
await record("break", { theme: "sage", feed: "mine" }, {
  frames: 30, before: async (p) => { await p.locator("#breakBtn").click(); await wait(500); await p.locator('[data-rx="box"]').click(); await wait(300); },
});
// a mini-game
await record("game", { theme: "sky", feed: "mine", notimer: false }, {
  frames: 36, before: async (p) => { await p.locator(".slot[data-i] [data-a='g3']").first().click(); await p.locator("#sheet [data-g='bubble']").click(); await wait(1500); },
});
await browser.close();
