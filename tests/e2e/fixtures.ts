import { test as base, expect, type Page } from "@playwright/test";
export type Look = "sky" | "sage" | "ink";
export type Opts = { theme: Look };
export const test = base.extend<Opts & { app: App }>({
  theme: ["sky", { option: true }],
  app: async ({ page, theme }, use) => {
    page.on("pageerror", (e) => console.log("[pageerror]", e.message));
    await use(new App(page, theme));
  },
});
export { expect };

export class App {
  constructor(public page: Page, public theme: Look) {}
  /** Start already onboarded (skips the quiz) with optional saved state. Runs once per tab. */
  async seed(extra: Record<string, unknown> = {}) {
    await this.page.addInitScript(([look, extra]) => {
      if (sessionStorage.getItem("seeded")) return;
      sessionStorage.setItem("seeded", "1");
      localStorage.setItem("scrollege:v1", JSON.stringify({ onboarded: true, theme: look, built: true, learn: ["watch"], hard: [], sound: false, lastDay: null, ...extra }));
    }, [this.theme, extra] as const);
  }
  async open(extra: Record<string, unknown> = {}) { await this.seed(extra); await this.page.goto("/"); await this.ready(); }
  async ready() { await expect(this.page.locator("#nav button")).toHaveCount(3); }
  tab(name: "Feed" | "Make" | "Me") { return this.page.locator("#nav button", { hasText: name }).click(); }
  slot(n: number) { return this.page.locator(".slot[data-i]").nth(n); }
  async noHorizontalScroll() {
    const over = await this.page.evaluate(() => {
      const W = document.documentElement.clientWidth, bad: string[] = [];
      if (document.documentElement.scrollWidth > W) bad.push("html " + document.documentElement.scrollWidth);
      document.querySelectorAll(".view,.onb,.ov,.sheet").forEach((e) => { if (e.scrollWidth > e.clientWidth + 1) bad.push(e.className + " " + e.scrollWidth + ">" + e.clientWidth); });
      return bad;
    });
    expect(over, "no horizontal scroll").toEqual([]);
  }
}

/* ---------- AI mocks (the real client code runs; only the network answer is faked) ---------- */
export const MOCK_DECK = {
  title: "Cells",
  reels: [0, 1, 2, 3, 4].map((k) => ({
    t: ["What is a cell?", "The nucleus", "Mitochondria", "Cell membrane", "Why cells matter"][k],
    cap: ["cap one", "cap two", "cap three"], read: [`Fact ${k} a`, `Fact ${k} b`, `Fact ${k} c`],
    quotes: ["Cells are the basic unit of life."], simple: `Simple ${k}`, story: ["s1", "s2", "s3"],
    pod: [["Scrolly", "What is it?"], ["Pip", `It is thing ${k}.`]],
    q: [`Question ${k}?`, [`Right ${k}`, `Wrong ${k}a`, `Wrong ${k}b`], 0, `Because ${k}.`], jingle: ["la la", "la la"], line: k === 1 ? 2 : 1, v3: "sort",
  })),
  steps: ["Step A", "Step B", "Step C", "Step D"], sort: [], cards: [["Quiz Card", "SPELL CARD", "shield", "Cells are the basic unit of life. Now you know."]],
};
export async function mockAI(page: Page, sourceLabel = "your notes", pageNums = false) {
  const lines = [1, 2, 3].map((n) => ({ n, text: ["Cells are the basic unit of life.", "The nucleus holds DNA.", "Mitochondria release energy."][n - 1], ...(pageNums ? { page: n } : {}) }));
  const calls: Record<string, any[]> = {};
  const reply = (name: string, body: any) => page.route(`**/api/${name}`, async (r) => {
    (calls[name] ||= []).push(r.request().postDataJSON());
    await r.fulfill({ json: typeof body === "function" ? body(r.request().postDataJSON()) : body });
  });
  await reply("source", { text: lines.map((l) => l.text).join("\n"), sourceLabel, lines });
  await reply("deck", { deck: MOCK_DECK });
  await reply("ask", (b: any) => (/darwin/i.test(b.question) ? { answer: null } : { answer: "The nucleus holds DNA.", line: 2 }));
  await reply("teach", { stars: 2, mentioned: ["DNA"], missing: ["nucleus"] });
  await reply("jingle", { jingle: ["new line one", "new line two"] });
  return calls;
}
