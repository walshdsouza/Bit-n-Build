import { test, expect, type Page } from "@playwright/test";

async function noOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(sizes.page).toBeLessThanOrEqual(sizes.viewport + 1);
}

for (const width of [320, 390, 1440]) {
  test(`branding, navigation and features remain usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("AI Sign Translation");
    const logo = page.locator('header img[src="/brand/unmute-logo.jpg"]');
    await expect(logo).toBeVisible();
    expect(await logo.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth === 1024)).toBe(true);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", /icon.svg/);
    const nav = width < 1024 ? page.getByRole("navigation", { name: "Mobile navigation" }) : page.getByRole("navigation", { name: "Website navigation" });
    if (width < 1024) await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(nav.getByRole("link", { name: "Live Meetings" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Live Meetings" })).toHaveAttribute("href", "/live");
    await nav.getByRole("link", { name: "Features", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("visible signs");
    const screenshots = page.locator('main figure img');
    await expect(screenshots).toHaveCount(3);
    for (const picture of await screenshots.all()) {
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(() => picture.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
    }
    await noOverflow(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `logs/features-${width}.png`, fullPage: true, style: "nextjs-portal { display: none; }" });
  });
}

test("settings exposes only useful sections and persists optional YouTube credentials", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/settings");
  const nav = page.getByRole("navigation", { name: "Settings sections" });
  await expect(nav.getByRole("button")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Profile editing unavailable" })).toHaveCount(0);
  await nav.getByRole("button", { name: /API Keys/ }).click();
  await page.getByLabel("Supadata API Key", { exact: true }).fill("test-supadata-local-only");
  await page.getByRole("button", { name: "Save API Keys" }).click();
  await expect(page.getByRole("status")).toHaveText("API keys saved in this browser.");
  await page.reload();
  await nav.getByRole("button", { name: /API Keys/ }).click();
  await expect(page.getByLabel("Supadata API Key", { exact: true })).toHaveValue("test-supadata-local-only");
  await expect(page.getByLabel("Supadata API Key", { exact: true })).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show Supadata API Key" }).click();
  await expect(page.getByLabel("Supadata API Key", { exact: true })).toHaveAttribute("type", "text");
  await page.getByLabel("Supadata API Key", { exact: true }).fill("");
  await page.getByRole("button", { name: "Save API Keys" }).click();
  await expect(page.getByRole("status")).toHaveText("Saved API keys removed from this browser.");
  expect(await page.evaluate(() => localStorage.getItem("gesturesync.apiKeys"))).toBeNull();
  await noOverflow(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "logs/settings-mobile-final.png", fullPage: true, style: "nextjs-portal { display: none; }" });
});
