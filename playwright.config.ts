import { defineConfig, devices } from "@playwright/test";
import type { Opts } from "./tests/e2e/fixtures";

const phone = { ...devices["Pixel 7"], viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 };
export default defineConfig<Opts>({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:5174", trace: "retain-on-failure", launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } },
  webServer: { command: "npx vite --port 5174 --strictPort", url: "http://localhost:5174", reuseExistingServer: false, env: { DEMO_MODE: "true" } },
  projects: [
    { name: "phone-pastel", use: { ...phone, theme: "pastel" }, testIgnore: /desktop/ },
    { name: "phone-night", use: { ...phone, theme: "night" }, testIgnore: /desktop|visual/ },
    { name: "desktop", use: { viewport: { width: 1280, height: 800 }, theme: "pastel" }, testMatch: /desktop/ },
  ],
});
