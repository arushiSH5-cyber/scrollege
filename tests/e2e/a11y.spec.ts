import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

async function axe(page: any, where: string) {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  const bad = r.violations.filter((v: any) => v.impact === "serious" || v.impact === "critical")
    .map((v: any) => `${where}: ${v.id} (${v.impact}) → ${v.nodes.slice(0, 3).map((n: any) => n.target.join(" ")).join(" | ")}`);
  expect(bad, bad.join("\n")).toEqual([]);
}

test("axe: onboarding has no serious issues", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(500);
  await axe(page, "onboarding");
});

test("axe: feed, make, me and a sheet have no serious issues", async ({ page, app }) => {
  await app.open();
  await page.waitForTimeout(500);
  await axe(page, "feed");
  await app.tab("Make"); await axe(page, "make");
  await app.tab("Me");
  await page.locator("details.more summary").evaluateAll((els) => els.forEach((e) => (e as HTMLElement).click()));
  await axe(page, "me");
  await app.tab("Feed");
  await app.slot(0).locator('[data-a="ask"]').click();
  await page.waitForTimeout(500);
  await axe(page, "ask sheet");
});
