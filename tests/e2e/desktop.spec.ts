import { test, expect } from "./fixtures";

test("desktop: tabs in a left rail, reels in a centered column, keys move reels", async ({ page, app }) => {
  await app.open();
  const nav = await page.locator("#nav").boundingBox();
  expect(nav!.x).toBeLessThanOrEqual(12);
  expect(nav!.width).toBeLessThan(130);
  expect(nav!.height).toBeGreaterThan(700);
  const slot = await app.slot(0).boundingBox();
  expect(slot!.width).toBeLessThanOrEqual(560);
  expect(Math.abs(slot!.x + slot!.width / 2 - (120 + (1280 - 120) / 2))).toBeLessThan(4);
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => page.locator("#feedV").evaluate((v) => Math.round(v.scrollTop / v.clientHeight)), { timeout: 30_000 }).toBe(1);
  await app.slot(1).locator('[data-a="ask"]').click();
  await expect(page.locator("#sheet")).toHaveClass(/on/);
  await page.keyboard.press("Escape");
  await expect(page.locator("#sheet")).not.toHaveClass(/on/);
  const w = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(w).toBeLessThanOrEqual(1280);
});
