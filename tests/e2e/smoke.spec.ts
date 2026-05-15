import { test, expect } from "@playwright/test";

test("homepage renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/.+/);
  await expect(page.locator("body")).toContainText("加密");
});

test("article page renders title, breadcrumb, FAQ, and 2 JSON-LD blocks", async ({ page }) => {
  await page.goto("/max-vs-binance");
  await expect(page.locator("article h1")).toContainText("MAX vs 幣安");
  await expect(page.locator('nav[aria-label="breadcrumb"]')).toBeVisible();
  await expect(page.locator("dl")).toBeVisible();
  const jsonLdCount = await page.locator('script[type="application/ld+json"]').count();
  expect(jsonLdCount).toBeGreaterThanOrEqual(2);
});

test("article JSON-LD includes Article + BreadcrumbList @type", async ({ page }) => {
  await page.goto("/max-vs-binance");
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = scripts.map((s) => (JSON.parse(s) as { "@type": string })["@type"]);
  expect(types).toContain("Article");
  expect(types).toContain("BreadcrumbList");
});

test("about / disclosure / privacy static pages render", async ({ page }) => {
  for (const slug of ["about", "disclosure", "privacy"]) {
    await page.goto(`/${slug}`);
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("404 page on unknown slug", async ({ request }) => {
  // In dev, Next's error boundary wraps not-found.tsx in a hidden div until
  // client hydration commits; checking the raw HTML is the reliable signal.
  const res = await request.get("/random-nonsense");
  expect(res.status()).toBe(404);
  const html = await res.text();
  expect(html).toContain("找不到這個頁面");
});

test("invalid slug shape (caps / special chars) also 404s", async ({ page }) => {
  const response = await page.goto("/UPPER_CASE_BAD");
  expect(response?.status()).toBe(404);
});

test("/go/max redirects 302 with UTM params and Cache-Control: private, no-store", async ({
  request,
}) => {
  const res = await request.get("/go/max?from=test-source", { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  const location = res.headers()["location"];
  expect(location).toContain("max.maicoin.com");
  expect(location).toContain("utm_source=littlefoxmoney");
  expect(location).toContain("utm_medium=article-cta");
  expect(location).toContain("utm_campaign=test-source");
  expect(res.headers()["cache-control"]).toBe("private, no-store");
});

test("/go/unknown returns 404", async ({ request }) => {
  const res = await request.get("/go/unknown");
  expect(res.status()).toBe(404);
});

test("sitemap and robots.txt are served", async ({ request }) => {
  // next-sitemap emits /sitemap.xml as an index pointing at /sitemap-0.xml.
  const indexRes = await request.get("/sitemap.xml");
  expect(indexRes.status()).toBe(200);
  expect(await indexRes.text()).toContain("<sitemapindex");

  const urlsetRes = await request.get("/sitemap-0.xml");
  expect(urlsetRes.status()).toBe(200);
  const urlsetText = await urlsetRes.text();
  expect(urlsetText).toContain("<urlset");
  expect(urlsetText).toContain("/max-vs-binance");

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Disallow: /go/");
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

test("article TOC is visible on desktop and contains entry from MDX h2", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/max-vs-binance");
  const toc = page.locator('nav[aria-label="文章目錄"]');
  await expect(toc).toBeVisible();
  const links = toc.locator("a");
  expect(await links.count()).toBeGreaterThan(0);
});
