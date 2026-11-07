// The built app must look like the approved mockup (reference/studyrot-v3.html): ≤2% pixel difference per screen.
import { test, expect } from "./fixtures";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import path from "node:path";

const MOCKUP = "file://" + path.resolve("reference/studyrot-v3.html");
const FREEZE = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.about{display:none!important}`;

async function shot(page: any) {
  await page.addStyleTag({ content: FREEZE });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  return PNG.sync.read(await page.locator("#screen").screenshot());
}
function diff(a: PNG, b: PNG) {
  const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
  const crop = (p: PNG) => { const o = new PNG({ width: w, height: h }); PNG.bitblt(p, o, 0, 0, w, h, 0, 0); return o; };
  return pixelmatch(crop(a).data, crop(b).data, null, w, h, { threshold: 0.15 }) / (w * h);
}

const SCREENS: [string, (p: any) => Promise<void>][] = [
  ["hello", async () => {}],
  ["brain quiz", async (p) => { await p.getByRole("button", { name: "Let's go!" }).click(); }],
  ["make", async (p) => { await p.evaluate(() => { document.querySelector(".onb")?.remove(); (window as any).show("make"); }); }],
];

for (const [name, go] of SCREENS) {
  test(`looks like the mockup: ${name}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mock = await ctx.newPage(), mine = await ctx.newPage();
    await mock.goto(MOCKUP); await mine.goto("/");
    await expect(mock.locator(".about h1")).toHaveCount(1); // really the mockup
    await expect(mine.locator(".about")).toHaveCount(0);    // really the app
    // the mockup's show() is a script global; ours is exposed on window
    await mock.evaluate(() => { (window as any).show = (window as any).show || (globalThis as any).show; });
    await go(mock); await go(mine);
    // Link input was removed on purpose (no Firecrawl for now): drop it from the mockup before comparing
    await mock.evaluate(() => { document.querySelector('[data-in="link"]')?.remove(); const t = document.querySelector(".input-tabs") as HTMLElement | null; if (t) t.style.gridTemplateColumns = "repeat(3,1fr)"; });
    const d = diff(await shot(mock), await shot(mine));
    console.log(`${name}: ${(d * 100).toFixed(2)}% different`);
    expect(d).toBeLessThanOrEqual(0.02);
    await ctx.close();
  });
}
