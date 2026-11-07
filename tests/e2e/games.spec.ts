import { test, expect } from "./fixtures";

const DEMO_Q: Record<string, string> = {
  "What does photosynthesis make for the plant?": "Food (sugar)",
  "Which gas does a plant take IN?": "Carbon dioxide",
  "Why are most leaves green?": "Chlorophyll reflects green light",
  "What does a plant release that we breathe?": "Oxygen",
  "Why do most food chains start with plants?": "They make their own food from light",
};

test("Quiz Run 3D: keyboard + buttons, wrong answer replays, no-timer waits", async ({ page, app }) => {
  test.setTimeout(150_000);
  await app.open({ notimer: true });
  await app.slot(0).locator('[data-a="g3"]').click();
  await expect(page.locator(".g3 canvas")).toBeVisible();
  const q = page.locator("#g3q"), pad = page.locator("#g3pad button");
  let wrongDone = false, rounds = 0, usedKeys = false, usedButtons = false;
  while (rounds++ < 12) {
    await expect(q).not.toHaveText("Quiz Run", { timeout: 10_000 });
    const text = (await q.textContent())!.trim();
    if (text === "You did it!") break;
    if (!(text in DEMO_Q)) { await page.waitForTimeout(300); rounds--; continue; }
    await expect(pad).toHaveCount(3);
    const labels = (await pad.allTextContents()).map((s) => s.replace(/^\S+\s/, ""));
    const right = labels.indexOf(DEMO_Q[text]);
    expect(right).toBeGreaterThanOrEqual(0);
    if (rounds === 1) {
      // no-timer: nothing pressed for 6s and the gate is still waiting on the same question
      await page.waitForTimeout(6000);
      await expect(q).toHaveText(text);
    }
    let pick = right;
    if (!wrongDone) { pick = (right + 1) % 3; wrongDone = true; }
    if (rounds % 2) { await page.keyboard.press(String(pick + 1)); usedKeys = true; } else { await pad.nth(pick).click(); usedButtons = true; }
    if (pick !== right) await expect(page.locator("#g3m")).toContainText("Not quite", { timeout: 15_000 });
    else await expect(page.locator("#g3m")).toContainText("Yes!", { timeout: 15_000 });
    await expect(q).not.toHaveText(text, { timeout: 10_000 }).catch(() => {}); // replayed question may repeat later
  }
  await expect(q).toHaveText("You did it!", { timeout: 20_000 });
  await expect(page.locator("#g3m")).toContainText("Run complete!");
  await expect(page.locator("#g3m")).toContainText("1 to review");
  expect(usedKeys && usedButtons).toBe(true);
  await page.locator("#g3m").getByRole("button", { name: "Done" }).click();
  await expect(page.locator(".g3")).toHaveCount(0);
});

test("Step Tower 3D: stack all steps in order", async ({ page, app }) => {
  await app.open();
  const steps = ["Roots take in water", "Leaves take in CO₂", "Chlorophyll catches sunlight", "The plant makes glucose", "Oxygen is released"];
  await page.locator(".slot[data-game] [data-g=tower]").click();
  await expect(page.locator(".g3 canvas")).toBeVisible();
  // a wrong block first: it shakes with a hint
  await expect(page.locator("#g3pad button")).toHaveCount(3);
  const wrong = page.locator("#g3pad button").filter({ hasNotText: steps[0] }).first();
  await wrong.click();
  await expect(page.locator("#g3m")).toContainText("Not yet!");
  for (const s of steps) {
    await page.locator("#g3pad button", { hasText: s }).click();
  }
  await expect(page.locator("#g3m")).toContainText("Tower complete!", { timeout: 10_000 });
});
