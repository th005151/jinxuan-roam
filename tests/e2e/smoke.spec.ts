import { test, expect } from "@playwright/test";

test("homepage renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/.+/);
  await expect(page.locator("h1")).toBeVisible();
});

test("about / disclosure / privacy static pages render", async ({ page }) => {
  for (const slug of ["about", "disclosure", "privacy"]) {
    await page.goto(`/${slug}`);
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("404 page on unknown slug", async ({ request }) => {
  const res = await request.get("/random-nonsense");
  expect(res.status()).toBe(404);
  const html = await res.text();
  expect(html).toContain("找不到這個頁面");
});

test("invalid slug shape (caps / special chars) also 404s", async ({ page }) => {
  const response = await page.goto("/UPPER_CASE_BAD");
  expect(response?.status()).toBe(404);
});

test("sitemap and robots.txt are served", async ({ request }) => {
  const indexRes = await request.get("/sitemap.xml");
  expect(indexRes.status()).toBe(200);
  expect(await indexRes.text()).toContain("<sitemapindex");

  const urlsetRes = await request.get("/sitemap-0.xml");
  expect(urlsetRes.status()).toBe(200);
  expect(await urlsetRes.text()).toContain("<urlset");

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
});

test("theme toggle switches html class between light and dark", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('button[aria-label="Toggle theme"]');
  const html = page.locator("html");

  await page.click('button[aria-label="Toggle theme"]');
  const afterFirst = await html.getAttribute("class");
  expect(afterFirst === null ? "" : afterFirst).toMatch(/dark|light/);

  await page.click('button[aria-label="Toggle theme"]');
  const afterSecond = await html.getAttribute("class");
  if (afterFirst?.includes("dark")) {
    expect(afterSecond ?? "").not.toContain("dark");
  } else {
    expect(afterSecond ?? "").toContain("dark");
  }
});
