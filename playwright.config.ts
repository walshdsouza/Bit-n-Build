import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 90_000,
  expect: { timeout: 20_000 },
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "logs/browser-report" }]],
  outputDir: "logs/browser-results",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3111",
    viewport: { width: 1440, height: 1000 },
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: { args: ["--enable-webgl", "--ignore-gpu-blocklist"] },
  },
});
