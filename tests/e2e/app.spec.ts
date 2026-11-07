import { test, expect, mockAI, MOCK_DECK } from "./fixtures";

test("onboarding → brain card → buddy → Make", async ({ page, app, theme }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hi! I'm Scrolly 👋" })).toBeVisible();
  await page.locator(`[data-th="${theme}"]`).click();
  await expect(page.locator("html")).toHaveClass(theme === "ink" ? /night/ : theme === "sage" ? /th-sage/ : /^(?!.*(night|th-sage))/);
  await page.getByRole("button", { name: "Let's go!" }).click();
  await page.locator('[data-l="listen"]').click();
  await expect(page.locator("#xpN")).toHaveText("10 XP");
  await page.getByRole("button", { name: "Level up →" }).click();
  await expect(page.getByRole("heading", { name: "Your brain card!" })).toBeVisible();
  await expect(page.locator(".bcard h4")).toContainText("Audio Explorer");
  await page.locator('[data-pet="frog"]').click();
  await page.getByRole("button", { name: /Make my first feed/ }).click();
  await expect(page.getByRole("heading", { name: "Make a feed" })).toBeVisible();
  await app.noHorizontalScroll();
  // brain quiz answers turned settings on, and they survive a reload
  await page.reload();
  await expect(page.locator(".onb")).toHaveCount(0);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("scrollege:v1")!));
  expect(saved).toMatchObject({ onboarded: true, pet: "frog", theme });
});

test("Make: notes → real deck from the (mocked) AI, with line sources", async ({ page, app }) => {
  await app.open({ built: false });
  const calls = await mockAI(page);
  await app.tab("Make");
  await page.locator('[data-in="notes"]').click();
  await page.locator("#inT").fill("Cells are the basic unit of life.\nThe nucleus holds DNA.\nMitochondria release energy.");
  await page.getByRole("button", { name: /Cook my feed/ }).click();
  await expect(app.slot(0).locator("h3")).toHaveText(MOCK_DECK.reels[0].t, { timeout: 15_000 });
  await expect(app.slot(1).locator(".src")).toHaveText("📎 From your notes, line 2");
  expect(calls.source[0]).toMatchObject({ type: "notes" });
  expect(calls.deck[0].lines).toHaveLength(3);
});

test("Make: photo is shrunk and sent for vision", async ({ page, app }) => {
  await app.open({ built: false });
  const calls = await mockAI(page, "your photo");
  await app.tab("Make");
  await page.locator('[data-in="photo"]').click();
  await page.locator("#inP").setInputFiles("public/icons/icon-512.png");
  await expect(page.locator("#pPrev img")).toBeVisible();
  await page.getByRole("button", { name: /Cook my feed/ }).click();
  await expect(app.slot(0).locator(".src")).toContainText("your photo", { timeout: 15_000 });
  expect(calls.source[0].type).toBe("photo");
  expect(calls.source[0].data).toMatch(/^data:image\/jpeg;base64,/);
});

test("Make: a real 3-page PDF is read in the browser, page by page", async ({ page, app }) => {
  await app.open({ built: false });
  const calls = await mockAI(page, "three-pages.pdf", true);
  await app.tab("Make");
  await page.locator("#inPdf").setInputFiles("tests/fixtures/three-pages.pdf");
  await expect(page.locator("#pdfOut")).toContainText("3 pages · 20 words");
  await expect(page.locator("#pdfOut")).toContainText("The nucleus holds the DNA of the cell.");
  await page.getByRole("button", { name: /Cook my feed/ }).click();
  await expect(app.slot(1).locator(".src")).toHaveText("📎 From three-pages.pdf, page 2", { timeout: 15_000 });
  const pages = calls.source[0].data.pages;
  expect(calls.source[0].type).toBe("pdf");
  expect(pages.map((p: any) => p.n)).toEqual([1, 2, 3]);
  expect(pages[1].text).toBe("The nucleus holds the DNA of the cell.");
});

test("every reel mode works", async ({ page, app }) => {
  await app.open();
  const s = app.slot(0);
  await expect(s.locator(".cap")).not.toBeEmpty();
  await s.locator('[data-m="listen"]').click();
  await expect(s.locator("[data-play]")).toBeVisible();
  await expect(s.locator(".kar w").first()).toHaveText("So");
  await s.locator('[data-m="read"]').click();
  await expect(s.locator("[data-read] li")).toHaveCount(3);
  await s.locator("[data-bion]").click();
  await expect(s.locator("[data-read] li b").first()).toBeVisible();
  await s.locator("[data-rul]").click();
  await expect(s.locator(".box.ruled")).toBeVisible();
  await s.locator("[data-simple]").click();
  await expect(s.locator("[data-read]")).toContainText("You show the computer lots of examples, and it learns the pattern.");
  await s.locator('[data-m="play"]').click();
  await expect(s.locator(".playcard b")).toHaveText("Quiz Run");
  await s.locator("[data-tapq]").click();
  await expect(s.locator("[data-ans]")).toHaveCount(3);
  await app.noHorizontalScroll();
});

test("wrong then right answer, and the miss goes to the review pile", async ({ page, app }) => {
  await app.open({ mode: "play", tapQuiz: true });
  const s = app.slot(1);
  await s.getByRole("button", { name: "The number of rooms" }).click();
  await expect(s.getByText("Not quite, that's okay.")).toBeVisible();
  await s.getByRole("button", { name: "Try again" }).click();
  await s.getByRole("button", { name: "The price" }).click();
  await expect(s.getByText("🎉 Yes!")).toBeVisible();
  const review = await page.evaluate(() => JSON.parse(localStorage.getItem("scrollege:v1")!).review);
  expect(review).toEqual([expect.objectContaining({ d: "demo", i: 1, step: 0 })]);
});

test("jingle, Ask (in notes vs not) and Teach Scrolly", async ({ page, app }) => {
  await app.open();
  const s = app.slot(0);
  await s.locator('[data-a="more"]').click();
  await page.locator('[data-mo="jingle"]').click();
  await expect(page.locator("#sheet .lyric")).toHaveCount(2);
  await page.locator("#jPlay").click();
  await page.locator("#sheet .x").click();

  await s.locator('[data-a="ask"]').click();
  await page.getByRole("button", { name: "What is a label?" }).click();
  await expect(page.locator("#chat .bot").last()).toContainText("The label is what we want to predict");
  await expect(page.locator("#chat .bot .src").last()).toContainText("line 2");
  await page.locator("#aq").fill("Who was Darwin?");
  await page.locator("#aq").press("Enter");
  await expect(page.locator("#chat .bot").last()).toContainText("not in your notes");
  await page.locator("#sheet .x").click();

  await s.locator('[data-a="more"]').click();
  await page.locator('[data-mo="teach"]').click();
  await page.locator("#tb").fill("Machine learning means the computer learns patterns from data and examples so it can make predictions.");
  await page.locator("#tbGo").click();
  await expect(page.locator("#tbR")).toContainText("⭐");
});

test("Ask and Teach use the AI for a real deck", async ({ page, app }) => {
  await app.open({ built: false });
  await mockAI(page);
  await app.tab("Make");
  await page.locator('[data-in="notes"]').click();
  await page.getByRole("button", { name: /Cook my feed/ }).click();
  await expect(app.slot(0).locator("h3")).toHaveText("What is a cell?", { timeout: 15_000 });
  await app.slot(0).locator('[data-a="ask"]').click();
  await page.locator("#aq").fill("What holds DNA?");
  await page.locator("#aq").press("Enter");
  await expect(page.locator("#chat .bot").last()).toContainText("The nucleus holds DNA.");
  await expect(page.locator("#chat .bot .src").last()).toContainText("your notes, line 2");
  await page.locator("#aq").fill("Who was Darwin?");
  await page.locator("#aq").press("Enter");
  await expect(page.locator("#chat .bot").last()).toContainText("not in your notes");
});

test("focus timer (study with Scrolly)", async ({ page, app }) => {
  await app.open({ xp: 0 });
  await app.tab("Me");
  await page.getByText("🎯 Focus tools").click();
  await page.getByRole("button", { name: /Study with Scrolly, 10 min/ }).click();
  await expect(page.locator("#bt")).toHaveText("10:00");
  await expect(page.locator("#bt")).toHaveText(/9:5\d/, { timeout: 4000 });
  await page.locator("#bp").click();
  await expect(page.locator("#bp")).toHaveText("▶ Resume");
  await page.locator("#bdone").click();
  await expect(page.locator(".toast")).toContainText("+15 XP");
});

test("🫧 break menu: 7 activities, a mood suggests one, ← closes it", async ({ page, app }) => {
  await app.open();
  await page.locator("#breakBtn").click();
  const menu = page.locator(".ov.relax");
  await expect(menu.getByRole("heading", { name: "Need a break?" })).toBeVisible();
  await expect(menu.locator("[data-rx]")).toHaveCount(7);
  await expect(menu).toContainText("talk to someone you trust or your school counselor");
  for (const [mood, act] of [["box", "box"], ["move", "move"], ["stretch", "stretch"], ["eyes", "eyes"]]) {
    await menu.locator(`[data-mood="${mood}"]`).click();
    await expect(menu.locator(`[data-rx="${act}"]`)).toHaveClass(/pick/);
    await expect(menu.locator(".rcard.pick")).toHaveCount(1);
  }
  await menu.locator(".back").click();
  await expect(page.locator(".ov.relax")).toHaveCount(0);
});

test("every guided break can pause, skip to the end and says Nice break", async ({ page, app }) => {
  test.setTimeout(120_000);
  await app.open();
  for (const k of ["box", "stretch", "squeeze", "eyes", "ground", "move"]) {
    await page.locator("#breakBtn").click();
    const o = page.locator(".ov.relax");
    await o.locator(`[data-rx="${k}"]`).click();
    await expect(o.locator("#rt")).not.toBeEmpty();
    await o.locator("#rp").click();
    await expect(o.locator("#rp")).toHaveText("▶ Resume");
    const before = await o.locator("#rs").textContent();
    await page.waitForTimeout(1300);
    await expect(o.locator("#rs")).toHaveText(before!); // paused: the countdown stops
    for (let n = 0; n < 30 && !(await o.getByRole("heading", { name: "Nice break 💛" }).count()); n++) await o.locator("#rn").click();
    await expect(o.getByRole("heading", { name: "Nice break 💛" })).toBeVisible();
    await o.locator(".back").click();               // ← goes back to the menu
    await expect(o.locator("[data-rx]")).toHaveCount(7);
    await o.locator(".back").click();               // ← on the menu closes it
    await expect(page.locator(".ov.relax")).toHaveCount(0);
  }
  await page.locator("#breakBtn").click();
  await page.locator('.ov.relax [data-rx="box"]').click();
  for (let n = 0; n < 30 && !(await page.locator("#tiny").count()); n++) await page.locator("#rn").click();
  await page.locator("#tiny").click();                // ▶ Watch just 1 reel
  await expect(page.locator(".ov")).toHaveCount(0);
  await expect(app.slot(0)).toBeVisible();
});

test("bubble wrap counts pops", async ({ page, app }) => {
  await app.open();
  await page.locator("#breakBtn").click();
  await page.locator('.ov.relax [data-rx="wrap"]').click();
  const bubbles = page.locator(".wrapg .wb");
  await expect(bubbles).toHaveCount(30);
  await bubbles.nth(0).click(); await bubbles.nth(1).click(); await bubbles.nth(1).click();
  await expect(page.locator("#wc")).toHaveText("2 popped");
  await page.locator(".ov.relax .back").click();
  await expect(page.locator(".ov.relax [data-rx]")).toHaveCount(7);
});

test("Play mode: a different game on each reel, Other games, Simple tap quiz", async ({ page, app }) => {
  await app.open({ mode: "play", tapQuiz: false });
  const names = await page.locator(".slot[data-i] .playcard b").allTextContents();
  expect(names).toEqual(["Quiz Run", "Bubble Pop", "Whack-a-Word", "Hoop Shot", "Gone Fishing"]);
  await app.slot(1).locator(".playcard [data-run]").click();
  await expect(page.locator(".g3 canvas")).toBeVisible();
  await page.locator(".g3 .back").click();
  await expect(page.locator(".g3")).toHaveCount(0);
  await app.slot(2).locator("[data-gp]").click();
  await expect(page.locator("#sheet .gtile")).toHaveCount(8);
  await page.locator("#sheet .x").click();
  await app.slot(0).locator("[data-tapq]").click();
  await expect(app.slot(0).locator("[data-ans]")).toHaveCount(3);
});

test("daily limit: 3 reels then the celebration", async ({ page, app }) => {
  await app.open();
  await app.tab("Me");
  await page.getByText("🎯 Focus tools").click();
  await page.locator('[data-limit="3"]').click();
  await app.tab("Feed");
  await expect(page.locator(".slot[data-i]")).toHaveCount(3);
  await expect(page.locator(".slot[data-limit] h2")).toHaveText("That's your 3 for today! 🎉");
  await expect(page.locator(".slot[data-game]")).toHaveCount(1);
});

test("spaced review: a reel due today comes first", async ({ page, app }) => {
  const today = new Date(); today.setHours(12); const k = today.toISOString().slice(0, 10);
  await app.open({ review: [{ d: "demo", i: 3, due: k, step: 0 }], mode: "play", tapQuiz: true });
  await expect(app.slot(0).locator("h3")).toHaveText("Training and test sets");
  await expect(app.slot(0).locator(".info")).toContainText("🔁 Back for review");
  await app.slot(0).getByRole("button", { name: "To check how it does on new, unseen data" }).click();
  const review = await page.evaluate(() => JSON.parse(localStorage.getItem("scrollege:v1")!).review);
  expect(review[0].step).toBe(1); // comes back in 3 days
  expect(review[0].due > k).toBe(true);
});

test("Me toggles, tint and back navigation", async ({ page, app, theme }) => {
  await app.open();
  await app.tab("Make");
  await app.tab("Me");
  await page.getByText("🧠 Brain modes").click();
  for (const [k, cls] of [["calm", "calm"], ["dys", "dys"], ["big", "big"]] as const) {
    const sw = page.locator(`[data-set="${k}"]`);
    await sw.click();
    await expect(sw).toHaveAttribute("aria-checked", "true");
    await expect(page.locator("#screen")).toHaveClass(new RegExp(cls));
    await sw.click();
    await expect(page.locator("#screen")).not.toHaveClass(new RegExp(cls));
  }
  for (const k of ["bionic", "ruler", "notimer", "voice", "sound"]) {
    const sw = page.locator(`[data-set="${k}"]`), before = await sw.getAttribute("aria-checked");
    await sw.click();
    await expect(sw).not.toHaveAttribute("aria-checked", before!);
  }
  await page.locator('[data-look="sage"]').click();
  await expect(page.locator("html")).toHaveClass(/th-sage/);
  await page.locator('[data-look="ink"]').click();
  await expect(page.locator("html")).toHaveClass(/night/);
  await page.locator('[data-tint="blue"]').click();
  await expect(page.locator("#tint")).toHaveCSS("background-color", "rgba(185, 216, 234, 0.35)");
  await app.noHorizontalScroll();
  await page.locator("#backBtn").click();
  await expect(page.getByRole("heading", { name: "Make a feed" })).toBeVisible();
  await page.locator("#backBtn").click();
  await expect(app.slot(0)).toBeVisible();
});

test("saving: decks survive a reload and can be switched and deleted", async ({ page, app }) => {
  await app.open({ built: false });
  await mockAI(page);
  await app.tab("Make");
  await page.locator('[data-in="notes"]').click();
  await page.getByRole("button", { name: /Cook my feed/ }).click();
  await expect(app.slot(0).locator("h3")).toHaveText("What is a cell?", { timeout: 15_000 });
  await page.reload();
  await expect(app.slot(0).locator("h3")).toHaveText("What is a cell?");
  await app.tab("Me");
  await page.getByText("📚 My decks").click();
  await expect(page.locator("#deckList .opt")).toHaveCount(1);
  await expect(page.locator("#deckList")).toContainText("Cells");
  page.once("dialog", (d) => d.accept());
  await page.locator("#deckList [data-del]").click();
  await expect(page.locator("#deckList")).toContainText("No saved decks yet");
  await app.tab("Feed");
  await expect(page.getByRole("heading", { name: "No feed yet" })).toBeVisible();
});

test("no horizontal scroll on any screen at 390px", async ({ page, app }) => {
  await page.goto("/");
  await app.noHorizontalScroll();
  await page.getByRole("button", { name: "Let's go!" }).click();
  await app.noHorizontalScroll();
  await page.evaluate(() => { document.querySelector(".onb")!.remove(); (window as any).S.built = true; (window as any).show("feed"); });
  for (const t of ["Feed", "Make", "Me"] as const) { await app.tab(t); await app.noHorizontalScroll(); }
  await app.tab("Me");
  await page.locator("details.more summary").evaluateAll((els) => els.forEach((e) => (e as HTMLElement).click()));
  await app.noHorizontalScroll();
});

test("Explore → AI fun facts pack, Ask from the pack, fit-the-line lab", async ({ page, app }) => {
  await app.open({ built: false });
  await page.getByRole("tab", { name: "Explore" }).click();
  await page.locator("[data-xp]").click();
  await expect(app.slot(0).locator("h3")).toHaveText("Linear regression");
  await expect(page.locator(".slot[data-i] h3")).toHaveText(["Linear regression", "Gradient descent", "Overfitting", "Neural networks", "How chatbots write"]);
  await expect(app.slot(0).locator(".src")).toHaveText("🤯 AI fun facts · from Explore");
  await expect(page.locator(".slot[data-game] .gtile")).toHaveCount(8);
  // fit-the-line lab: real least-squares on the starting dots
  await app.slot(0).locator("[data-try]").click();
  await expect(page.locator("#eq")).toHaveText("y = 0.81x + 0.99");
  await page.locator("#fitOut").click();
  await expect(page.locator("#eq")).toHaveText("y = 0.20x + 2.61");
  await page.locator("#fitClear").click();
  await expect(page.locator("#eq")).toHaveText("Add 2+ dots");
  const box = (await page.locator("#fit").boundingBox())!;
  await page.mouse.click(box.x + box.width * 0.3, box.y + box.height * 0.7);
  await page.mouse.click(box.x + box.width * 0.7, box.y + box.height * 0.3);
  await expect(page.locator("#eq")).toHaveText(/^y = 1\.\d\dx/);
  await page.locator("#sheet .x").click();
  // Ask answers only from the pack
  await app.slot(0).locator('[data-a="ask"]').click();
  await page.getByRole("button", { name: "What is a token?" }).click();
  await expect(page.locator("#chat .bot").last()).toContainText("token");
  await expect(page.locator("#chat .bot .src").last()).toContainText("Explore:");
  await page.getByRole("button", { name: "Who invented the iPhone?" }).click();
  await expect(page.locator("#chat .bot").last()).toContainText("not in this feed");
  await page.locator("#sheet .x").click();
  // the choice is remembered, and My notes still works
  await page.reload();
  await expect(app.slot(0).locator("h3")).toHaveText("Linear regression");
  await page.getByRole("tab", { name: "My notes" }).click();
  await expect(page.getByRole("heading", { name: "No feed yet" })).toBeVisible();
});

test("Explore: fun facts, news with sources, next topics, projects", async ({ page, app }) => {
  await app.open();
  await page.getByRole("tab", { name: "Explore" }).click();
  await expect(page.getByRole("heading", { name: "Explore ML Basics" })).toBeVisible();
  await expect(page.locator(".around .lbl")).toHaveText(["📰 Fresh in AI", "🧭 Next topics for you", "🛠 Try a project"]);
  const news = page.locator(".card.news");
  await expect(news).toHaveCount(3);
  for (let k = 0; k < 3; k++) {
    await expect(news.nth(k).locator(".why")).toContainText("Why it matters");
    await expect(news.nth(k).locator("a.srcl")).toHaveAttribute("href", /^https:\/\//);
    await expect(news.nth(k).locator("a.srcl")).toContainText("2026");
  }
  await expect(page.locator("[data-nx]")).toHaveCount(6);
  await page.locator("[data-pj]").first().click();
  await expect(page.locator("#sheet ol li")).toHaveCount(4);
  await page.getByRole("button", { name: "Save this project" }).click();
  // a next-topic chip that exists in the pack jumps to that reel
  await page.locator("[data-nx]", { hasText: "Linear regression" }).click();
  await expect(app.slot(0).locator("h3")).toHaveText("Linear regression");
  await app.noHorizontalScroll();
});

test("Watch in 3D plays captions, then shows Replay / Done under the caption", async ({ page, app }) => {
  test.setTimeout(180_000);
  await app.open({ calm: false });
  await app.slot(0).locator('[data-a="v3"]').click();
  await expect(page.locator(".g3.vid canvas")).toBeVisible();
  await expect(page.locator("#vcap")).toContainText("Computers learn from examples");
  await expect(page.locator("#vend")).toBeVisible({ timeout: 120_000 }); // software 3D in CI can be slow
  await page.locator("#vend [data-done]").click();
  await expect(page.locator(".g3")).toHaveCount(0);
});

test("meme card: flip at the end of the feed, then it's in the binder", async ({ page, app }) => {
  await app.open();
  await page.locator(".slot[data-limit] .mback").click({ force: true }); // it wobbles on purpose
  await expect(page.locator("#sheet .mcard")).toBeVisible();
  await expect(page.locator("#sheet .mfoot")).toHaveText("SCROLLEGE · STUDY CARD");
  const title = (await page.locator("#sheet .mtitle b").textContent())!;
  expect(["Overfit Trap", "Test Set Shield", "Label Detective"]).toContain(title);
  await page.locator("#sheet .x").click();
  await app.tab("Me");
  await expect(page.getByText("🃏 My card binder (1/6)")).toBeVisible();
  await expect(page.locator(".binder .mcard")).toHaveCount(1);
  await page.reload();
  await app.tab("Me");
  await expect(page.getByText("🃏 My card binder (1/6)")).toBeVisible();
});

test("natural voice: Read aloud asks /api/tts when a voice is set up, and stops cleanly", async ({ page, app }) => {
  const asked: any[] = [];
  await page.route("**/api/tts*", async (r) => {
    const u = new URL(r.request().url());
    if (!u.searchParams.get("text")) return r.fulfill({ json: { on: true } });
    asked.push(Object.fromEntries(u.searchParams));
    await r.fulfill({ status: 200, contentType: "audio/wav", body: silentWav(1) });
  });
  await app.open({ mode: "read", calm: false });
  await app.slot(0).locator("[data-ra]").click();
  await expect.poll(() => asked.length).toBe(1);
  expect(asked[0].text).toContain("What is machine learning?");
  expect(asked[0].mood).toBe("content");
  // Me shows the natural-voice switch only when a voice is set up
  await app.tab("Me");
  await page.getByText("🧠 Brain modes").click();
  await expect(page.locator('[data-set="natVoice"]')).toBeVisible();
});

test("no natural voice set up: falls back to the device voice, no switch in Me", async ({ page, app }) => {
  let posts = 0;
  await page.route("**/api/tts*", async (r) => { if (!new URL(r.request().url()).searchParams.get("text")) return r.fulfill({ json: { on: false } }); posts++; await r.fulfill({ status: 503, json: {} }); });
  await app.open({ mode: "read" });
  await app.slot(0).locator("[data-ra]").click();
  await page.waitForTimeout(300);
  expect(posts).toBe(0);
  await app.tab("Me");
  await page.getByText("🧠 Brain modes").click();
  await expect(page.locator('[data-set="natVoice"]')).toHaveCount(0);
});

/** a silent WAV clip, `sec` seconds long (so tests can "play" the voice without any sound) */
function silentWav(sec: number) {
  const rate = 8000, n = rate * sec, b = Buffer.alloc(44 + n);
  b.write("RIFF", 0); b.writeUInt32LE(36 + n, 4); b.write("WAVE", 8); b.write("fmt ", 12); b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate, 28); b.writeUInt16LE(1, 32); b.writeUInt16LE(8, 34);
  b.write("data", 36); b.writeUInt32LE(n, 40); b.fill(128, 44);
  return b;
}

test("Read aloud and Listen can pause and resume the voice", async ({ page, app }) => {
  await page.route("**/api/tts*", async (r) => {
    if (!new URL(r.request().url()).searchParams.get("text")) return r.fulfill({ json: { on: true } });
    await r.fulfill({ status: 200, contentType: "audio/wav", body: silentWav(3) });
  });
  await app.open({ mode: "read", calm: false, sound: true });
  const ra = app.slot(0).locator("[data-ra]");
  await ra.click();
  await expect(ra).toHaveText("⏸ Pause");
  await ra.click();
  await expect(ra).toHaveText("▶ Resume");
  await page.waitForTimeout(3500);                 // paused: it must not finish on its own
  await expect(ra).toHaveText("▶ Resume");
  await ra.click();
  await expect(ra).toHaveText("⏸ Pause");
  await expect(ra).toHaveText("🔊 Read aloud", { timeout: 25_000 }); // finished → back to idle

  await app.slot(1).locator('[data-m="listen"]').click();
  const play = app.slot(1).locator("[data-play]");
  await play.click();
  await expect(play).toHaveAttribute("aria-label", "Pause");
  await expect(play).toHaveText("⏸");
  await play.click();
  await expect(play).toHaveAttribute("aria-label", "Resume");
  await play.click();
  await expect(play).toHaveAttribute("aria-label", "Pause");
});

test.describe("v9 live 3D reels", () => {
  test("one live canvas, on the visible reel; it moves on scroll and leaves in Listen", async ({ page, app }) => {
    test.setTimeout(90_000);
    await app.open({ mode: "watch", calm: false });
    await expect(page.locator(".live3d canvas")).toHaveCount(1);
    await expect(app.slot(0).locator(".live3d canvas")).toHaveCount(1);
    await page.locator("#feedV").evaluate((v) => (v.scrollTop = v.clientHeight));
    await expect(app.slot(1).locator(".live3d canvas")).toHaveCount(1, { timeout: 10_000 });
    await expect(page.locator(".live3d canvas")).toHaveCount(1);
    await app.slot(1).locator('[data-m="listen"]').click();
    await expect(page.locator(".live3d canvas")).toHaveCount(0);
  });

  test("the caption line and the scene beat stay in step", async ({ page, app }) => {
    test.setTimeout(90_000);
    await app.open({ mode: "watch", calm: false });
    await expect(page.locator(".live3d canvas")).toHaveCount(1);
    for (let n = 0; n < 3; n++) {
      const { capK, beat } = await page.evaluate(() => ({ capK: (window as any).__v3.capK(), beat: (window as any).__v3.live()?.beat }));
      expect(beat).toBe(capK % 3);
      await expect.poll(() => page.evaluate(() => (window as any).__v3.capK()), { timeout: 10_000 }).toBeGreaterThan(capK);
    }
  });

  test("all 10 scene kinds play all 3 beats for 10 s each without errors", async ({ page, app }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await app.open({ mode: "read" });
    const res = await page.evaluate(() => {
      const T = (window as any).THREE, V = (window as any).__v3, out: string[] = [];
      const cv = document.createElement("canvas"); cv.width = 320; cv.height = 240;
      const R = new T.WebGLRenderer({ canvas: cv });
      for (const kind of ["sort", "features", "cluster", "split", "clsreg", "scatter", "hill", "overfit", "net", "tokens"]) {
        try {
          const sc = new T.Scene(), cam = new T.PerspectiveCamera(48, 4 / 3, 0.1, 100); V.v3lights(sc);
          const s = V.v3scene(kind, sc, true); cam.position.set(0, 3, 9); cam.lookAt(0, 1, 0);
          for (let k = 0; k < 3; k++) { s.beat(k); let bt = 0; for (let f = 0; f < 300; f++) { bt += 1 / 30; s.tick(1 / 30, k * 10 + bt, bt, k); if (f % 60 === 0) R.render(sc, cam); } }
          out.push(kind + ":ok");
        } catch (e: any) { out.push(kind + ":" + e.message); }
      }
      R.dispose(); return out;
    });
    expect(res).toEqual(["sort", "features", "cluster", "split", "clsreg", "scatter", "hill", "overfit", "net", "tokens"].map((k) => k + ":ok"));
    expect(errors).toEqual([]);
  });

  test("full-screen video keeps moving after the voice ends; Replay restarts the voice", async ({ page, app }) => {
    test.setTimeout(240_000);
    // count every line the app speaks (device voice; audio is muted in tests)
    await page.route("**/api/tts*", (r) => r.fulfill({ json: { on: false } }));
    await page.addInitScript(() => { (window as any).__spoken = 0; const o = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = (u: any) => { (window as any).__spoken++; o(u); }; });
    await app.open({ calm: false, sound: true });
    await app.slot(0).locator('[data-a="v3"]').click();
    await expect(page.locator(".g3.vid canvas")).toBeVisible();
    await expect(page.locator("#vend")).toBeVisible({ timeout: 180_000 });   // voice part finished
    const before = await page.locator("#vcap").textContent();
    await expect.poll(() => page.locator("#vcap").textContent(), { timeout: 30_000 }).not.toBe(before); // still looping
    const n = await page.evaluate(() => (window as any).__spoken);
    await page.locator("#vend [data-replay]").click();
    await expect(page.locator("#vend")).toBeHidden();
    await expect.poll(() => page.evaluate(() => (window as any).__spoken), { timeout: 15_000 }).toBeGreaterThan(n);
    await page.locator(".g3 .back").click();
    await expect(page.locator(".g3")).toHaveCount(0);
  });

  test("Squad tab and the weekly recap open", async ({ page, app }) => {
    await app.open();
    await app.tab("Squad");
    await expect(page.locator("#P")).toContainText("Friends this week", { ignoreCase: true });
    await app.tab("Me");
    await page.locator(".wrapban").click();
    await expect(page.locator(".recap")).toBeVisible();
  });
});

test("if the natural voice fails twice, the app switches to the device voice", async ({ page, app }) => {
  let clipAsks = 0;
  await page.route("**/api/tts*", async (r) => {
    if (!new URL(r.request().url()).searchParams.get("text")) return r.fulfill({ json: { on: true } });
    clipAsks++; await r.fulfill({ status: 503, json: { fallback: "device" } });
  });
  await page.addInitScript(() => { (window as any).__spoken = 0; const o = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = (u: any) => { (window as any).__spoken++; o(u); }; });
  await app.open({ mode: "read", sound: true });
  for (let n = 1; n <= 3; n++) {
    await page.evaluate((k) => (window as any).say("Line number " + k), n);
    await expect.poll(() => page.evaluate(() => (window as any).__spoken)).toBeGreaterThanOrEqual(n);
  }
  expect(clipAsks).toBe(2); // after 2 failures it stops asking and just uses the device voice
});
