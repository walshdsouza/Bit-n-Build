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

test("settings shows only the essential profile on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/settings");
  const nav = page.getByRole("navigation", { name: "Settings sections" });
  await expect(nav.getByRole("link")).toHaveCount(1);
  await expect(nav.getByRole("link", { name: "Profile", exact: true })).toHaveAttribute("aria-current", "page");
  const profile = page.getByRole("region", { name: "Profile", exact: true });
  await expect(profile.locator("dt")).toHaveText(["Name", "Email"]);
  await expect(profile.locator("dd")).toHaveText(["Guest", "Not signed in"]);
  await expect(page.getByText(/API Keys|Provider keys|Neural Engine|Avatar Configuration/)).toHaveCount(0);
  await expect(profile.getByText("Your account on this deployment.")).toHaveCount(0);
  await nav.getByRole("link", { name: "Profile", exact: true }).click();
  await expect(profile).toBeInViewport();
  await page.reload();
  await expect(profile.locator("dt")).toHaveText(["Name", "Email"]);
  await noOverflow(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "logs/settings-mobile-final.png", fullPage: true, style: "nextjs-portal { display: none; }" });
});

test("new translation has a restrained style and navigates to the dashboard", async ({ page }) => {
  await page.goto("/settings");
  const link = page.getByRole("banner").getByRole("link", { name: "New Translation", exact: true });
  await expect(link).toBeVisible();
  await link.focus();
  await expect(link).toBeFocused();
  const style = await link.evaluate((node) => {
    const css = getComputedStyle(node);
    return { backgroundImage: css.backgroundImage, boxShadow: css.boxShadow, height: node.getBoundingClientRect().height };
  });
  expect(style.backgroundImage).toBe("none");
  expect(style.boxShadow).toBe("none");
  expect(style.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/dashboard$/);
});
