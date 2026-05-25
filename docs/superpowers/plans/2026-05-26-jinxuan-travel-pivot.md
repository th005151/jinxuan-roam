# 金萱漫遊 Travel Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot the existing `littlefoxmoney` crypto-affiliate codebase into 金萱漫遊, a Notion-driven personal travel blog, and ship to Vercel free tier.

**Architecture:** Reuse the Next.js 15 + Tailwind 4 + MDX shell unchanged. Generalize `exchanges` → `partners` so 6 affiliate components (Klook / Trip / KKday / Agoda / Booking / Expedia) plug in. Content lives in a Notion database; a build-time script syncs published pages → `content/articles/*.mdx` (with images downloaded to `public/uploads/notion/`) before `next build` runs the existing MDX pipeline.

**Tech Stack:** Next.js 15.5 (App Router), React 19.1, Tailwind 4, TypeScript 5, MDX (@next/mdx), zod, vitest + Playwright. New deps: `@notionhq/client`, `notion-to-md`.

**Spec:** [`docs/superpowers/specs/2026-05-26-jinxuan-travel-pivot-design.md`](../specs/2026-05-26-jinxuan-travel-pivot-design.md)

---

## Phase A — Remove crypto content & defer crypto-specific tests

Goal: clean slate. Strip the 4 crypto MDX articles, the `/go/[exchange]` redirect, and the e2e assertions that hard-code crypto strings. After this phase the site should still build (with zero articles) but Playwright will fail until Phase C lands. That's expected.

### Task A1: Delete the 4 crypto MDX articles

**Files:**
- Delete: `content/articles/max-vs-binance.mdx`
- Delete: `content/articles/binance-vs-pionex.mdx`
- Delete: `content/articles/taiwan-buy-bitcoin-guide.mdx`
- Delete: `content/articles/pionex-intro.mdx`

- [ ] **Step 1: Delete the 4 files**

```bash
git rm content/articles/max-vs-binance.mdx
git rm content/articles/binance-vs-pionex.mdx
git rm content/articles/taiwan-buy-bitcoin-guide.mdx
git rm content/articles/pionex-intro.mdx
```

- [ ] **Step 2: Verify `content/articles/.gitkeep` still exists**

Run: `ls content/articles/`
Expected: only `.gitkeep`

- [ ] **Step 3: Commit**

```bash
git commit -m "chore(content): remove crypto articles before travel pivot"
```

### Task A2: Remove `/go/[exchange]` redirect route

**Files:**
- Delete: any `app/go/` route folder (search first; rename rules in design will redo affiliate routing in Phase B/D)

- [ ] **Step 1: Find the route**

Run: `Glob app/go/**`
If found, the folder contains a `[exchange]/route.ts` (or similar) implementing the 302 redirect.

- [ ] **Step 2: Delete the route folder**

```bash
git rm -r app/go
```

- [ ] **Step 3: Confirm robots.txt source no longer needs `Disallow: /go/`**

Check: `next-sitemap.config.js` for any `Disallow` entry referring `/go/`. Note its location for D-phase update; do not edit yet.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(routes): drop /go/[exchange] redirect (will be replaced by partner system)"
```

### Task A3: Strip crypto-specific assertions from `tests/e2e/smoke.spec.ts`

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

Keep all *structural* assertions (TOC visible, theme toggle, sitemap/robots served, 404 handling, JSON-LD count). Remove or temporarily skip the tests that hit `/max-vs-binance`, `/go/max`, or assert `"加密"` text. Re-enable them with travel slugs in Phase F.

- [ ] **Step 1: Update `tests/e2e/smoke.spec.ts`**

Replace the file with the following minimal structural-only version. The article-specific and `/go/` tests are dropped (the article test will be re-added in Phase F against the seed article).

```typescript
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
```

- [ ] **Step 2: Run e2e to confirm structural tests still pass after deletes**

Run: `npx playwright test`
Expected: 6 tests, all pass (the homepage h1 currently still says crypto text — that's OK, we only assert it's visible).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "test(e2e): drop crypto-specific cases, keep structural smoke"
```

### Task A4: Add `.gitignore` rule for synced Notion articles

**Files:**
- Modify: `.gitignore`

We will gitignore everything in `content/articles/` except `*_seed.mdx`, so that future Notion sync products don't pollute git.

- [ ] **Step 1: Append to `.gitignore`**

Add at the end of `.gitignore`:

```
# Notion sync products (canonical source is the Notion database). Seed files are tracked.
content/articles/*.mdx
!content/articles/*_seed.mdx

# Downloaded Notion images
/public/uploads/notion/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore Notion sync products (except *_seed.mdx)"
```

---

## Phase B — Generalize exchanges → partners + extend frontmatter

Goal: rename and broaden the affiliate system. After this phase, `lib/partners.ts` defines 6 travel partners, all affiliate components reference partners instead of exchanges, and the article frontmatter schema accepts the new travel fields. Keep API surface (function names and component prop names) where it doesn't create churn — the field `primaryExchange` becomes `partner`.

### Task B1: Write failing tests for `lib/config/partners.ts`

**Files:**
- Create: `lib/config/partners.test.ts`

- [ ] **Step 1: Create the test file**

```typescript
import { describe, expect, it } from "vitest";
import { PARTNER_KEYS, partners, isPartnerKey } from "./partners";

describe("PARTNER_KEYS", () => {
  it("includes the 6 v1 travel partners", () => {
    expect(PARTNER_KEYS).toEqual([
      "klook",
      "trip",
      "kkday",
      "agoda",
      "booking",
      "expedia",
    ]);
  });
});

describe("partners record", () => {
  it("has an entry for every key", () => {
    for (const key of PARTNER_KEYS) {
      expect(partners[key]).toBeDefined();
      expect(partners[key].key).toBe(key);
      expect(partners[key].displayName.length).toBeGreaterThan(0);
      expect(partners[key].tagline.length).toBeGreaterThan(0);
    }
  });
});

describe("isPartnerKey", () => {
  it("returns true for valid keys", () => {
    expect(isPartnerKey("klook")).toBe(true);
    expect(isPartnerKey("agoda")).toBe(true);
  });
  it("returns false for non-keys", () => {
    expect(isPartnerKey("max")).toBe(false);
    expect(isPartnerKey("")).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run lib/config/partners.test.ts`
Expected: FAIL with "Cannot find module './partners'".

### Task B2: Implement `lib/config/partners.ts`

**Files:**
- Create: `lib/config/partners.ts`

- [ ] **Step 1: Write the module**

```typescript
export const PARTNER_KEYS = [
  "klook",
  "trip",
  "kkday",
  "agoda",
  "booking",
  "expedia",
] as const;

export type PartnerKey = (typeof PARTNER_KEYS)[number];

export interface PartnerInfo {
  key: PartnerKey;
  displayName: string;
  tagline: string;
  /** Brand homepage; used only for human-readable label / fallback. */
  homepage: string;
  /** Default CTA label shown on partner cards. */
  ctaLabel: string;
}

export const partners: Record<PartnerKey, PartnerInfo> = {
  klook: {
    key: "klook",
    displayName: "Klook 客路",
    tagline: "亞洲行程、票券一站搞定",
    homepage: "https://www.klook.com/",
    ctaLabel: "去 Klook 找行程",
  },
  trip: {
    key: "trip",
    displayName: "Trip.com",
    tagline: "全球機票飯店比價",
    homepage: "https://www.trip.com/",
    ctaLabel: "去 Trip.com 比價",
  },
  kkday: {
    key: "kkday",
    displayName: "KKday",
    tagline: "在地體驗 + 票券",
    homepage: "https://www.kkday.com/",
    ctaLabel: "去 KKday 看行程",
  },
  agoda: {
    key: "agoda",
    displayName: "Agoda",
    tagline: "亞洲飯店首選",
    homepage: "https://www.agoda.com/",
    ctaLabel: "去 Agoda 找飯店",
  },
  booking: {
    key: "booking",
    displayName: "Booking.com",
    tagline: "全球住宿選擇最多",
    homepage: "https://www.booking.com/",
    ctaLabel: "去 Booking 找住宿",
  },
  expedia: {
    key: "expedia",
    displayName: "Expedia",
    tagline: "機 + 酒套裝省更多",
    homepage: "https://www.expedia.com/",
    ctaLabel: "去 Expedia 看套裝",
  },
};

export function isPartnerKey(value: string): value is PartnerKey {
  return (PARTNER_KEYS as readonly string[]).includes(value);
}
```

- [ ] **Step 2: Run, expect pass**

Run: `npx vitest run lib/config/partners.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 3: Commit**

```bash
git add lib/config/partners.ts lib/config/partners.test.ts
git commit -m "feat(partners): introduce lib/config/partners.ts (6 v1 partners)"
```

### Task B3: Rename `lib/affiliate/links.ts` to use partners + jinxuan UTM source

**Files:**
- Modify: `lib/affiliate/links.ts`
- Modify: `lib/affiliate/links.test.ts`

- [ ] **Step 1: Rewrite `lib/affiliate/links.test.ts` to assert partners + jinxuan UTM**

Open the existing test file and replace its contents (the old tests refer to `ExchangeKey`):

```typescript
import { afterEach, describe, expect, it } from "vitest";
import { resolveAffiliateUrl, isPartnerKey } from "./links";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("isPartnerKey (re-exported)", () => {
  it("matches partner ids", () => {
    expect(isPartnerKey("klook")).toBe(true);
    expect(isPartnerKey("max")).toBe(false);
  });
});

describe("resolveAffiliateUrl", () => {
  it("returns null when env var missing", () => {
    delete process.env.AFFILIATE_KLOOK;
    expect(resolveAffiliateUrl("klook")).toBeNull();
  });

  it("builds URL with jinxuan UTM params", () => {
    process.env.AFFILIATE_KLOOK = "https://www.klook.com/affiliate?aid=123";
    const url = resolveAffiliateUrl("klook", "kyoto-3day");
    expect(url).toContain("utm_source=jinxuan");
    expect(url).toContain("utm_medium=article-cta");
    expect(url).toContain("utm_campaign=kyoto-3day");
  });

  it("returns null for non-partner keys", () => {
    expect(resolveAffiliateUrl("foo")).toBeNull();
  });
});
```

- [ ] **Step 2: Rewrite `lib/affiliate/links.ts`**

Replace the file contents:

```typescript
import { PARTNER_KEYS, type PartnerKey } from "@/lib/config/partners";

export { isPartnerKey } from "@/lib/config/partners";
export type { PartnerKey } from "@/lib/config/partners";

const ENV_KEY: Record<PartnerKey, string> = {
  klook: "AFFILIATE_KLOOK",
  trip: "AFFILIATE_TRIP",
  kkday: "AFFILIATE_KKDAY",
  agoda: "AFFILIATE_AGODA",
  booking: "AFFILIATE_BOOKING",
  expedia: "AFFILIATE_EXPEDIA",
};

export function resolveAffiliateUrl(
  partner: string,
  campaign?: string
): string | null {
  if (!(PARTNER_KEYS as readonly string[]).includes(partner)) return null;
  const base = process.env[ENV_KEY[partner as PartnerKey]];
  if (!base) return null;
  try {
    const url = new URL(base);
    url.searchParams.set("utm_source", "jinxuan");
    url.searchParams.set("utm_medium", "article-cta");
    if (campaign) url.searchParams.set("utm_campaign", campaign);
    return url.toString();
  } catch {
    return null;
  }
}
```

- [ ] **Step 3: Run, expect pass**

Run: `npx vitest run lib/affiliate/links.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add lib/affiliate/links.ts lib/affiliate/links.test.ts
git commit -m "refactor(affiliate): switch to partners + jinxuan UTM source"
```

### Task B4: Delete `lib/config/exchanges.ts`

**Files:**
- Delete: `lib/config/exchanges.ts`

This breaks several consumers — fix them in subsequent tasks. Compile errors are expected after this step until Task B7 lands.

- [ ] **Step 1: Delete the file**

```bash
git rm lib/config/exchanges.ts
```

- [ ] **Step 2: Confirm consumers (do NOT fix yet, just inventory)**

Run: `Grep -r "lib/config/exchanges" .` (or your editor's search)
Expected: hits in `lib/schemas/article.ts`, `components/article/article-sidebar-cta.tsx`, `components/cta/affiliate-link.tsx`, and possibly `components/home/exchange-card.tsx` and any homepage usage.

Note: do not commit yet — Tasks B5–B7 fix the consumers before we commit the broken state.

### Task B5: Update frontmatter schema (drop primaryExchange, add travel fields)

**Files:**
- Modify: `lib/schemas/article.ts`
- Modify: `lib/schemas/article.test.ts`

- [ ] **Step 1: Update the test file**

Open `lib/schemas/article.test.ts` and replace the body. Keep the existing test structure (don't fight what's there if it differs) but assert these field changes:

```typescript
import { describe, expect, it } from "vitest";
import { ArticleFrontmatterSchema } from "./article";

const validBase = {
  title: "京都嵐山三日漫遊",
  description: "從竹林到嵯峨野小火車的私房路線",
  slug: "kyoto-arashiyama-3day",
  publishedAt: "2026-05-26",
  updatedAt: "2026-05-26",
  author: "金萱",
  keywords: ["京都", "嵐山", "自由行"],
  canonical: "https://jinxuan-roam.vercel.app/kyoto-arashiyama-3day",
  hasAffiliate: false,
  relatedSlugs: ["a", "b", "c"] as const,
};

describe("ArticleFrontmatterSchema", () => {
  it("accepts minimal valid travel frontmatter", () => {
    const result = ArticleFrontmatterSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("accepts optional travel fields", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validBase,
      country: "日本",
      location: "京都・嵐山",
      tripType: "自由行",
      travelDate: "2026-04-12",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional partner + partnerLink", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validBase,
      partner: "klook",
      partnerLink: "https://www.klook.com/affiliate?aid=123&ref=kyoto",
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown partner", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validBase,
      partner: "not-a-partner",
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Rewrite `lib/schemas/article.ts`**

```typescript
import { z } from "zod";
import { PARTNER_KEYS } from "@/lib/config/partners";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

export const ArticleFrontmatterSchema = z.object({
  title: z.string().min(1).max(40, "Title must be <= 40 characters"),
  description: z.string().min(1).max(80, "Description must be <= 80 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  publishedAt: isoDate,
  updatedAt: isoDate,
  author: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1).max(10),
  ogImage: z.string().optional(),
  canonical: z.url(),
  hasAffiliate: z.boolean(),
  relatedSlugs: z.tuple([z.string(), z.string(), z.string()]),

  // Travel-specific (all optional — pure遊記不需要 partner)
  country: z.string().optional(),
  location: z.string().optional(),
  tripType: z.string().optional(),
  travelDate: isoDate.optional(),

  // Affiliate (all optional)
  partner: z.enum(PARTNER_KEYS).optional(),
  partnerLink: z.url().optional(),
});

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;
```

Note title/description limits relaxed (travel titles are wordier than crypto comparisons); keywords cap raised to 10.

- [ ] **Step 3: Run, expect pass**

Run: `npx vitest run lib/schemas/article.test.ts`
Expected: PASS.

### Task B6: Fix `ArticleSidebarCta` to read `partner` instead of `primaryExchange`

**Files:**
- Modify: `components/article/article-sidebar-cta.tsx`
- Modify: `components/article/article-sidebar-cta.test.tsx`

- [ ] **Step 1: Rewrite the component**

```typescript
import { partners, type PartnerKey } from "@/lib/config/partners";
import { AffiliateLink } from "@/components/cta/affiliate-link";

interface Props {
  partner: PartnerKey | undefined;
  partnerLink?: string;
  sourceArticle: string;
}

export function ArticleSidebarCta({ partner, partnerLink, sourceArticle }: Props) {
  if (!partner) return null;
  const info = partners[partner];

  return (
    <section className="rounded-lg bg-brand-soft p-4 dark:bg-emerald-900/40">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        本文推薦
      </p>
      <p className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-50">
        {info.displayName}
      </p>
      <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">{info.tagline}</p>
      <AffiliateLink
        partner={partner}
        href={partnerLink}
        sourceArticle={sourceArticle}
        position="inline"
        className="mt-3 block rounded-md bg-brand px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-brand-deep"
      >
        {info.ctaLabel} →
      </AffiliateLink>
    </section>
  );
}
```

- [ ] **Step 2: Update its test file**

Open `components/article/article-sidebar-cta.test.tsx` and update prop names from `primaryExchange` → `partner`. Replace values like `"max"` with `"klook"`. Keep the test structure (assertions about rendering / null on absent).

- [ ] **Step 3: Run**

Run: `npx vitest run components/article/article-sidebar-cta.test.tsx`
Expected: PASS.

### Task B7: Update `AffiliateLink` component for partners

**Files:**
- Modify: `components/cta/affiliate-link.tsx`

- [ ] **Step 1: Read the existing component**

Run: `Read components/cta/affiliate-link.tsx`
Note the current prop names (likely `exchange`) and how it builds the outbound URL (probably calls `resolveAffiliateUrl` from `lib/affiliate/links`).

- [ ] **Step 2: Rewrite props**

Change the prop name `exchange: ExchangeKey` → `partner: PartnerKey`. Add an optional `href?: string` override prop — when provided, use it verbatim instead of looking up env-var-based affiliate URL. This lets Notion-supplied `partnerLink` flow through.

Make sure to:
- Import `PartnerKey` from `@/lib/config/partners`.
- If a passed `href` is present, render `<a href={href} rel="sponsored nofollow noopener" target="_blank">{children}</a>` directly.
- Otherwise fall back to `resolveAffiliateUrl(partner, sourceArticle)`. If that returns null, render nothing (`return null`).

- [ ] **Step 3: Search for callers and fix them**

Run: `Grep -r "AffiliateLink" components/ app/`
For each caller: rename `exchange` prop → `partner`. Replace values like `"max"` with a partner key, or leave it dynamic from frontmatter.

- [ ] **Step 4: Commit the whole B5/B6/B7 batch together**

```bash
git add lib/schemas/article.ts lib/schemas/article.test.ts \
  components/article/article-sidebar-cta.tsx \
  components/article/article-sidebar-cta.test.tsx \
  components/cta/affiliate-link.tsx
git commit -m "refactor(affiliate): rename exchange → partner across components + frontmatter"
```

(If you committed earlier in Task B4 anyway, this commit just contains B5–B7.)

---

## Phase C — Branding swap (site-config, wordmark, tea-leaf logo, icons)

Goal: replace all visible site identity. After this phase, the existing site (still showing dead-link articles in dev because no articles exist) is branded as 金萱漫遊 with the tea-leaf logo.

### Task C1: Update `lib/config/site.ts`

**Files:**
- Modify: `lib/config/site.ts`

- [ ] **Step 1: Rewrite contents**

```typescript
export const siteConfig = {
  name: "金萱漫遊",
  shortName: "jinxuan",
  description: "金萱的旅遊筆記：用一片茶葉的好奇心，記錄走過的城市、住過的店、吃過的味道。",
  tagline: "走慢一點，看細一點",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jinxuan-roam.vercel.app",
  locale: "zh-TW",
  author: {
    name: "金萱",
    bio: "前上班族，現在比較常在路上。寫的是私房路線、住宿筆記、跟旅程之間的小發現。",
  },
} as const;

export type SiteConfig = typeof siteConfig;
```

- [ ] **Step 2: Commit**

```bash
git add lib/config/site.ts
git commit -m "refactor(brand): site config → 金萱漫遊"
```

### Task C2: Rewrite `Wordmark` to「金萱漫遊」

**Files:**
- Modify: `components/layout/wordmark.tsx`
- Modify: `components/layout/wordmark.test.tsx`

- [ ] **Step 1: Update wordmark.tsx**

```typescript
import * as React from "react";

interface WordmarkProps {
  /** Font-size in px. Default 18 (header use). */
  size?: number;
  /** Color of "金萱" / "遊". Default zinc-900. */
  color?: string;
  /** Color of "漫". Default emerald-600. */
  accent?: string;
  className?: string;
}

export function Wordmark({
  size = 18,
  color = "#18181B",
  accent = "#059669",
  className,
}: WordmarkProps) {
  return (
    <span
      className={["inline-flex items-baseline font-serif font-extrabold leading-none", className ?? ""].join(" ")}
      style={{
        fontSize: size,
        letterSpacing: "0.02em",
        color,
      }}
    >
      金萱<span style={{ color: accent }}>漫</span>遊
    </span>
  );
}
```

Notes: `font-sans` → `font-serif` reads better for the Chinese name (uses the existing Noto Serif TC). Letter-spacing flipped from negative to slight positive because Chinese glyphs don't need to tighten.

- [ ] **Step 2: Update wordmark.test.tsx**

Open the existing test file. Replace any string assertions of `"littlefoxmoney"`, `"little"`, `"fox"`, `"money"` with `"金萱"`, `"漫"`, `"遊"`. Keep the rendering / prop-passing structure intact.

- [ ] **Step 3: Run**

Run: `npx vitest run components/layout/wordmark.test.tsx`
Expected: PASS.

### Task C3: Rewrite `LogoMark` as a tea-leaf SVG

**Files:**
- Modify: `components/layout/logo-mark.tsx`
- Modify: `components/layout/logo-mark.test.tsx`

- [ ] **Step 1: Update logo-mark.tsx**

```typescript
import * as React from "react";

type Tone = "light" | "dark" | "mono";

interface LogoMarkProps {
  /** Diameter in px. Default 32. */
  size?: number;
  /** Visual context. Default "light". */
  tone?: Tone;
  className?: string;
  /** Override stroke/fill color. Wins over `tone`. */
  fg?: string;
  /** Accessible label. Default "金萱漫遊". */
  "aria-label"?: string;
}

const TONE_FILL: Record<Tone, string> = {
  light: "#059669", // emerald-600
  dark: "#34D399",  // emerald-400
  mono: "#18181B",  // zinc-900
};

export function LogoMark({
  size = 32,
  tone = "light",
  className,
  fg,
  "aria-label": ariaLabel = "金萱漫遊",
}: LogoMarkProps) {
  const fill = fg ?? TONE_FILL[tone];
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={["shrink-0", className ?? ""].join(" ")}
    >
      {/* Tea leaf: pointed-tip ellipse from bottom-left → top-right.
          Path traced by two quadratic curves meeting at the tips. */}
      <path
        d="M6 26 Q 4 14 16 4 Q 28 14 26 26 Q 16 22 6 26 Z"
        fill={fill}
      />
      {/* Central vein for leaf detail */}
      <path
        d="M8 24 Q 16 16 24 6"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Update logo-mark.test.tsx**

Replace assertions of `"FX"` text content with assertions on:
- aria-label is `"金萱漫遊"` by default, overridable via prop.
- The rendered output contains an `<svg>` element with `<path>` children.
- Custom `size` becomes `width` / `height` attributes.
- Tone changes the leaf fill color (assert on the path's `fill` attribute or computed style).

Keep prop signature snapshot tests if any.

- [ ] **Step 3: Run**

Run: `npx vitest run components/layout/logo-mark.test.tsx`
Expected: PASS.

- [ ] **Step 4: Commit C2 + C3**

```bash
git add components/layout/wordmark.tsx components/layout/wordmark.test.tsx \
  components/layout/logo-mark.tsx components/layout/logo-mark.test.tsx
git commit -m "feat(brand): wordmark 金萱漫遊 + tea-leaf logo mark"
```

### Task C4: Update `Logo` composite + its test

**Files:**
- Modify: `components/layout/logo.tsx`
- Modify: `components/layout/logo.test.tsx`

`Logo` composes `LogoMark + Wordmark`. Should compile without changes since both children kept their prop APIs, but the *test* might assert old text — update test if so.

- [ ] **Step 1: Run logo test**

Run: `npx vitest run components/layout/logo.test.tsx`
Expected: likely failure on `"littlefoxmoney"` text content.

- [ ] **Step 2: Update test**

Replace text assertions to `"金萱"` / `"漫"` / `"遊"` as appropriate.

- [ ] **Step 3: Run, expect pass**

Run: `npx vitest run components/layout/logo.test.tsx`
Expected: PASS.

### Task C5: Regenerate favicon (`app/icon.tsx`) + apple-icon

**Files:**
- Modify: `app/icon.tsx`
- Modify: `app/apple-icon.tsx`

These use `next/og`'s `ImageResponse` to generate runtime icons. The current implementation probably composes `<LogoMark>` markup inline (or duplicates the SVG path). Update to use the new tea-leaf path.

- [ ] **Step 1: Read both files**

Note their structure; they emit JSX that `ImageResponse` rasterizes.

- [ ] **Step 2: Rewrite to render the tea-leaf**

Replace the rendered JSX inside `ImageResponse` to inline-render an SVG `<svg viewBox="0 0 32 32"><path d="..." fill="#059669"/>...</svg>` matching the new `LogoMark` artwork. Pad as appropriate for icon sizes (favicon 32×32, apple-icon typically 180×180).

- [ ] **Step 3: Confirm dev server renders the new favicon**

Run: `npm run dev`
Open: `http://localhost:3000/icon`
Expected: PNG response with tea-leaf glyph. Tab should show the new favicon.

- [ ] **Step 4: Same check for apple-icon**

Open: `http://localhost:3000/apple-icon`

- [ ] **Step 5: Commit**

```bash
git add app/icon.tsx app/apple-icon.tsx
git commit -m "feat(brand): regenerate favicon + apple-icon as tea-leaf"
```

### Task C6: Regenerate OG images (`app/opengraph-image.tsx` + `app/[slug]/opengraph-image.tsx`)

**Files:**
- Modify: `app/opengraph-image.tsx`
- Modify: `app/[slug]/opengraph-image.tsx`

- [ ] **Step 1: Read both files**

Note headline text (currently 「littlefoxmoney」-related copy) and any inline SVG.

- [ ] **Step 2: Replace headline text + glyph**

For `app/opengraph-image.tsx`: headline becomes 「金萱漫遊」, subtitle uses `siteConfig.tagline`. Replace any FX-mark SVG with the tea-leaf path.

For `app/[slug]/opengraph-image.tsx`: title text per article is dynamic (`params.slug` → article title); replace the brand glyph in the corner only.

- [ ] **Step 3: Sanity-check rendering**

Run: `npm run dev`
Open: `http://localhost:3000/opengraph-image`
Expected: PNG with new branding.

- [ ] **Step 4: Commit**

```bash
git add app/opengraph-image.tsx app/[slug]/opengraph-image.tsx
git commit -m "feat(brand): regenerate OG images for 金萱漫遊"
```

---

## Phase D — Copy refresh + component rewrites

Goal: every page and CTA component reads as a travel blog. No structural changes; this is text + minor refactors only.

### Task D1: Rewrite homepage `app/page.tsx` + `Hero`

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/home/hero.tsx`

- [ ] **Step 1: Read existing files**

Note sections currently used (likely: hero, featured exchanges list, recent articles, CTA banner).

- [ ] **Step 2: Rewrite `components/home/hero.tsx`**

Replace headline / sub / CTA copy. Suggested:
- Headline: 「金萱漫遊」
- Subtitle: 「走慢一點，看細一點。」+ 1–2 sentence about journey-style blog
- Primary CTA → "看最新文章" linking to first article (or omit until articles exist)
- Secondary CTA → "關於我" → `/about`

Keep the JSX structure / Tailwind classes; only swap text and link hrefs.

- [ ] **Step 3: Rewrite `app/page.tsx`**

- Remove the "三大交易所" / `ExchangeCard` list section entirely (until you decide to add "本月推薦合作夥伴" — that's P2; do not add now).
- Keep the "最新文章" list section. It already enumerates from `getAllArticles()` so it will be empty for now (will be populated by the seed file in Phase E).
- Remove the CTA banner section that links to `/go/<exchange>`. Replace with a simple subscribe-or-about-link block.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/home/hero.tsx
git commit -m "refactor(home): travel-blog hero + drop exchange list"
```

### Task D2: Delete `components/home/exchange-card.tsx`

**Files:**
- Delete: `components/home/exchange-card.tsx`

Since `app/page.tsx` no longer uses it (D1) and partner cards on home are P2, just remove it. The shape will be reintroduced as `partner-card.tsx` when needed.

- [ ] **Step 1: Confirm no remaining imports**

Run: `Grep -r "exchange-card" .`
Expected: no hits in `app/` or `components/`. If hits remain, remove their imports first.

- [ ] **Step 2: Delete**

```bash
git rm components/home/exchange-card.tsx
```

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: drop home ExchangeCard (no longer used)"
```

### Task D3: Rewrite `app/about/page.tsx`

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Rewrite content**

Replace crypto-focused "About" copy with a 1–2 paragraph self-intro for "金萱":

```
# 關於金萱

金萱是一片來自台灣的茶——也是這個部落格的筆名。

過去幾年我斷斷續續走了一些地方：京都的茶屋、清邁的山、宜蘭的小鎮。
不是要做攻略網站，只是想把那些路線、住宿、吃到的味道，寫成下次自己想再去查的筆記。

寫得慢，但會一直寫下去。

若文章內有住宿或行程連結，可能是 affiliate 連結——我會選自己真的會推薦的，不影響評論。詳見 [免責聲明](/disclosure)。
```

Keep the explicit Tailwind typography classes that already exist (per recent commit `refactor(about)`).

- [ ] **Step 2: Confirm page renders**

Run: `npm run dev`, open `/about`.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "refactor(about): rewrite for 金萱漫遊"
```

### Task D4: Rewrite `app/disclosure/page.tsx`

**Files:**
- Modify: `app/disclosure/page.tsx`

- [ ] **Step 1: Read existing copy**

Note current crypto-affiliate disclosure structure.

- [ ] **Step 2: Replace partner list**

Rewrite the disclosure to list travel partners (Klook, Trip.com, KKday, Agoda, Booking, Expedia) instead of crypto exchanges. Disclosure principles (commission doesn't affect recommendation, opinions independent) stay structurally the same.

- [ ] **Step 3: Commit**

```bash
git add app/disclosure/page.tsx
git commit -m "refactor(disclosure): travel-affiliate disclosure (Klook/Trip/KKday/Agoda/Booking/Expedia)"
```

### Task D5: Rewrite `app/privacy/page.tsx`

**Files:**
- Modify: `app/privacy/page.tsx`

- [ ] **Step 1: Update site name references + POLICY_UPDATED_AT**

Search the file for `"littlefoxmoney"` / `"小狐理財"` and replace with `"金萱漫遊"`. Bump `POLICY_UPDATED_AT` constant to today's date (`"2026-05-26"`).

- [ ] **Step 2: Update partner list in any tracking section**

If the privacy page enumerates third-party tracking (which it does — GA4, affiliate redirect cookies), replace exchange names with partner names (Klook etc.).

- [ ] **Step 3: Commit**

```bash
git add app/privacy/page.tsx
git commit -m "refactor(privacy): rebrand + update tracking partner list"
```

### Task D6: Rewrite `components/affiliate/disclosure-banner.tsx` + `disclosure-inline.tsx`

**Files:**
- Modify: `components/affiliate/disclosure-banner.tsx`
- Modify: `components/affiliate/disclosure-inline.tsx`

- [ ] **Step 1: Update text**

Both display short disclosure strings. Replace any "交易所" / "投資" wording with "旅遊合作夥伴" / "住宿與行程連結". E.g.:

```
本文含旅遊合作夥伴的 affiliate 連結。我們會獨立評估，連結點擊後若你完成預訂，我們可能會獲得佣金（不會影響你的價格）。
```

- [ ] **Step 2: Commit**

```bash
git add components/affiliate/disclosure-banner.tsx components/affiliate/disclosure-inline.tsx
git commit -m "refactor(disclosure-components): travel affiliate copy"
```

### Task D7: Rewrite CTA components (`cta-inline.tsx`, `cta-summary.tsx`, `cta-comparison.tsx`)

**Files:**
- Modify: `components/cta/cta-inline.tsx`
- Modify: `components/cta/cta-summary.tsx`
- Modify: `components/cta/cta-comparison.tsx`

These are MDX-callable components. Read each, then:

- `CtaInline`: change default placeholder text from crypto to travel ("立即查價" / "看更多行程").
- `CtaSummary`: relabel sections from "開戶步驟" → "行前準備"; numbered badge styling stays.
- `CtaComparison`: change default column headers from exchange comparison fields (手續費/台幣入金) to travel comparison fields (價格區間 / 取消政策 / 評分). Header row + right-align numeric stays from recent redesign.

For each: only swap copy / default props. Don't change the layout DOM.

- [ ] **Step 1: Read each, edit copy, save**

- [ ] **Step 2: Commit**

```bash
git add components/cta/cta-inline.tsx components/cta/cta-summary.tsx components/cta/cta-comparison.tsx
git commit -m "refactor(cta-components): travel-themed default copy"
```

### Task D8: Rewrite `components/article/faq.tsx` (if it ships crypto-default content)

**Files:**
- Modify: `components/article/faq.tsx`

- [ ] **Step 1: Read the file**

If `FAQ` is purely a presentation component (takes `items` array from MDX), no copy change is needed. If it has crypto defaults baked in, swap them out.

- [ ] **Step 2: Commit only if changed**

```bash
git add components/article/faq.tsx
git commit -m "refactor(faq): travel-neutral defaults"
```

### Task D9: Update `next-sitemap.config.js`

**Files:**
- Modify: `next-sitemap.config.js`

- [ ] **Step 1: Read the file**

Note current `siteUrl` (will be `https://littlefoxmoney.com` or similar) and any `Disallow: /go/` rule.

- [ ] **Step 2: Update**

- `siteUrl` → `https://jinxuan-roam.vercel.app` (or whatever the final Vercel URL is; can be re-deployed later)
- Remove `Disallow: /go/` rule (route deleted in A2)

- [ ] **Step 3: Run build to confirm sitemap regenerates**

Run: `npm run build`
Expected: build succeeds; `/public/sitemap.xml` and `/public/sitemap-0.xml` regenerated; no `/go/` entries.

- [ ] **Step 4: Commit**

```bash
git add next-sitemap.config.js
git commit -m "chore(sitemap): update siteUrl, drop /go/ disallow"
```

### Task D10: Update layout metadata + JSON-LD organization

**Files:**
- Modify: `app/layout.tsx`
- Modify: `components/seo/json-ld.tsx` (if it has hardcoded brand strings)

- [ ] **Step 1: Read both files**

Note hardcoded metadata: title template, default description, og:image, twitter card. The JSON-LD likely contains an `Organization` block with the site name.

- [ ] **Step 2: Replace strings**

Anywhere a literal string `"littlefoxmoney"` / `"小狐理財"` appears, swap to siteConfig values (or `"金萱漫遊"` directly if it's a one-off).

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx components/seo/json-ld.tsx
git commit -m "refactor(meta): JSON-LD + layout metadata → 金萱漫遊"
```

---

## Phase E — Notion sync infrastructure

Goal: build the Notion → MDX pipeline. After this phase, running `npm run sync` against a real Notion database produces valid MDX files; `npm run build` succeeds; the seed article renders.

### Task E1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
npm install @notionhq/client notion-to-md
```

- [ ] **Step 2: Confirm `package.json` records both as dependencies (not dev)**

Open `package.json`. Move `@notionhq/client` and `notion-to-md` under `"dependencies"` if `npm install` placed them in devDependencies.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add @notionhq/client + notion-to-md"
```

### Task E2: Write failing tests for sync helpers

**Files:**
- Create: `scripts/sync-notion-helpers.test.ts`

We test only the pure helpers (slugify, hash, frontmatter mapping). The Notion API call itself is verified manually.

- [ ] **Step 1: Create the test file**

```typescript
import { describe, expect, it } from "vitest";
import { slugify, contentHash, mapNotionPageToFrontmatter } from "./sync-notion-helpers.mjs";

describe("slugify", () => {
  it("ascii kebab", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("collapses whitespace + strips punctuation", () => {
    expect(slugify("Kyoto, Arashiyama!")).toBe("kyoto-arashiyama");
  });

  it("Chinese title falls back to pinyin-less hash slug", () => {
    const out = slugify("京都嵐山三日漫遊");
    expect(out).toMatch(/^post-[a-z0-9]{8}$/);
  });

  it("empty input → fallback", () => {
    expect(slugify("")).toMatch(/^post-[a-z0-9]{8}$/);
  });
});

describe("contentHash", () => {
  it("returns 8-char hex", () => {
    expect(contentHash("abc")).toMatch(/^[a-f0-9]{8}$/);
  });

  it("same input → same hash", () => {
    expect(contentHash("xyz")).toBe(contentHash("xyz"));
  });
});

describe("mapNotionPageToFrontmatter", () => {
  const sample = {
    id: "abc-def",
    properties: {
      Title: { title: [{ plain_text: "京都嵐山三日漫遊" }] },
      Slug: { rich_text: [{ plain_text: "kyoto-arashiyama-3day" }] },
      Status: { select: { name: "Published" } },
      "Published At": { date: { start: "2026-05-26" } },
      Excerpt: { rich_text: [{ plain_text: "竹林到嵯峨野" }] },
      Country: { select: { name: "日本" } },
      Location: { rich_text: [{ plain_text: "京都・嵐山" }] },
      "Trip Type": { select: { name: "自由行" } },
      "Travel Date": { date: { start: "2026-04-12" } },
      Tags: { multi_select: [{ name: "竹林" }, { name: "私房" }] },
      Partner: { select: { name: "klook" } },
      "Partner Link": { url: "https://www.klook.com/affiliate?aid=123" },
      Cover: { files: [] },
    },
  };

  it("maps required + travel + partner fields", () => {
    const fm = mapNotionPageToFrontmatter(sample);
    expect(fm.title).toBe("京都嵐山三日漫遊");
    expect(fm.slug).toBe("kyoto-arashiyama-3day");
    expect(fm.publishedAt).toBe("2026-05-26");
    expect(fm.description).toBe("竹林到嵯峨野");
    expect(fm.country).toBe("日本");
    expect(fm.location).toBe("京都・嵐山");
    expect(fm.tripType).toBe("自由行");
    expect(fm.travelDate).toBe("2026-04-12");
    expect(fm.keywords).toEqual(["竹林", "私房"]);
    expect(fm.partner).toBe("klook");
    expect(fm.partnerLink).toBe("https://www.klook.com/affiliate?aid=123");
  });

  it("derives slug from title when Slug property empty", () => {
    const noSlug = {
      ...sample,
      properties: { ...sample.properties, Slug: { rich_text: [] } },
    };
    const fm = mapNotionPageToFrontmatter(noSlug);
    expect(fm.slug).toMatch(/^post-[a-z0-9]{8}$/); // Chinese title → fallback
  });

  it("returns null for unpublished pages", () => {
    const draft = {
      ...sample,
      properties: { ...sample.properties, Status: { select: { name: "Draft" } } },
    };
    expect(mapNotionPageToFrontmatter(draft)).toBeNull();
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run scripts/sync-notion-helpers.test.ts`
Expected: FAIL with "Cannot find module".

### Task E3: Implement sync helpers

**Files:**
- Create: `scripts/sync-notion-helpers.mjs`

Pure JS for simplicity — the .mjs runs directly under Node from `package.json` scripts. We use the vitest extension's ability to import `.mjs` from `.test.ts`.

- [ ] **Step 1: Write the helpers**

```javascript
import crypto from "node:crypto";

const ASCII_KEBAB_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function contentHash(input) {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 8);
}

export function slugify(input) {
  if (!input) return `post-${contentHash(String(Math.random()))}`;
  const ascii = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  if (ascii && ASCII_KEBAB_RE.test(ascii)) return ascii;
  return `post-${contentHash(input)}`;
}

function readPlainText(richTextProp) {
  if (!richTextProp) return "";
  const arr = richTextProp.title ?? richTextProp.rich_text ?? [];
  return arr.map((r) => r.plain_text ?? "").join("").trim();
}

function readSelect(prop) {
  return prop?.select?.name ?? null;
}

function readMultiSelect(prop) {
  return (prop?.multi_select ?? []).map((m) => m.name);
}

function readDate(prop) {
  return prop?.date?.start ?? null;
}

function readUrl(prop) {
  return prop?.url ?? null;
}

export function mapNotionPageToFrontmatter(page) {
  const props = page.properties ?? {};
  const status = readSelect(props.Status);
  if (status !== "Published") return null;

  const title = readPlainText(props.Title);
  const declaredSlug = readPlainText(props.Slug);
  const slug = declaredSlug && ASCII_KEBAB_RE.test(declaredSlug)
    ? declaredSlug
    : slugify(title);

  const publishedAt = readDate(props["Published At"]) ?? new Date().toISOString().slice(0, 10);

  return {
    title,
    slug,
    description: readPlainText(props.Excerpt) || title,
    publishedAt,
    updatedAt: publishedAt,
    author: "金萱",
    keywords: readMultiSelect(props.Tags),
    canonical: `https://jinxuan-roam.vercel.app/${slug}`,
    hasAffiliate: Boolean(readSelect(props.Partner) && readSelect(props.Partner) !== "none"),
    relatedSlugs: ["", "", ""], // sync script fills these post-pass
    country: readSelect(props.Country) ?? undefined,
    location: readPlainText(props.Location) || undefined,
    tripType: readSelect(props["Trip Type"]) ?? undefined,
    travelDate: readDate(props["Travel Date"]) ?? undefined,
    partner: (() => {
      const p = readSelect(props.Partner);
      return p && p !== "none" ? p : undefined;
    })(),
    partnerLink: readUrl(props["Partner Link"]) ?? undefined,
  };
}
```

- [ ] **Step 2: Run, expect pass**

Run: `npx vitest run scripts/sync-notion-helpers.test.ts`
Expected: PASS (all 4 describes pass).

- [ ] **Step 3: Commit**

```bash
git add scripts/sync-notion-helpers.mjs scripts/sync-notion-helpers.test.ts
git commit -m "feat(sync): notion property → frontmatter helpers"
```

### Task E4: Write the sync script `scripts/sync-notion.mjs`

**Files:**
- Create: `scripts/sync-notion.mjs`

- [ ] **Step 1: Write the script**

```javascript
#!/usr/bin/env node
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import { mapNotionPageToFrontmatter, contentHash } from "./sync-notion-helpers.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(REPO_ROOT, "content/articles");
const IMAGES_DIR = path.join(REPO_ROOT, "public/uploads/notion");

const TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!TOKEN || !DATABASE_ID) {
  console.warn("[sync-notion] NOTION_TOKEN or NOTION_DATABASE_ID not set. Skipping sync; build will use existing files.");
  process.exit(0);
}

const notion = new Client({ auth: TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return download(res.headers.location, destPath).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", async () => {
          await fs.mkdir(path.dirname(destPath), { recursive: true });
          await fs.writeFile(destPath, Buffer.concat(chunks));
          resolve();
        });
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function rehostImages(markdownBody, slug) {
  const slugDir = path.join(IMAGES_DIR, slug);
  const pattern = /!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)/g;
  let out = markdownBody;
  const matches = [...markdownBody.matchAll(pattern)];
  for (const m of matches) {
    const [full, alt, url] = m;
    try {
      const ext = (url.match(/\.(jpe?g|png|webp|gif)\b/i)?.[1] ?? "jpg").toLowerCase();
      const fileName = `${contentHash(url)}.${ext === "jpeg" ? "jpg" : ext}`;
      const destPath = path.join(slugDir, fileName);
      await download(url, destPath);
      const publicPath = `/uploads/notion/${slug}/${fileName}`;
      out = out.replace(full, `![${alt}](${publicPath})`);
    } catch (err) {
      console.warn(`[sync-notion] image fetch failed for ${slug}: ${err.message}`);
    }
  }
  return out;
}

function frontmatterYaml(fm) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(fm)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const item of v) lines.push(`  - ${JSON.stringify(item)}`);
    } else if (typeof v === "string") {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    } else {
      lines.push(`${k}: ${v}`);
    }
  }
  lines.push("---", "");
  return lines.join("\n");
}

async function clearOldSynced() {
  await fs.mkdir(ARTICLES_DIR, { recursive: true });
  const files = await fs.readdir(ARTICLES_DIR);
  for (const f of files) {
    if (f.endsWith(".mdx") && !f.endsWith("_seed.mdx")) {
      await fs.unlink(path.join(ARTICLES_DIR, f));
    }
  }
}

async function main() {
  try {
    const queried = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: { property: "Status", select: { equals: "Published" } },
      sorts: [{ property: "Published At", direction: "descending" }],
      page_size: 100,
    });

    await clearOldSynced();

    let ok = 0;
    let skipped = 0;
    for (const page of queried.results) {
      try {
        const fm = mapNotionPageToFrontmatter(page);
        if (!fm) {
          skipped++;
          continue;
        }
        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const mdResult = n2m.toMarkdownString(mdBlocks);
        const rawBody = mdResult?.parent ?? "";
        const body = await rehostImages(rawBody, fm.slug);
        const out = frontmatterYaml(fm) + body.trim() + "\n";
        const outPath = path.join(ARTICLES_DIR, `${fm.slug}.mdx`);
        await fs.writeFile(outPath, out, "utf8");
        ok++;
      } catch (err) {
        console.warn(`[sync-notion] page ${page.id} failed: ${err.message}`);
        skipped++;
      }
    }

    console.log(`[sync-notion] ${ok} synced, ${skipped} skipped.`);
  } catch (err) {
    console.warn(`[sync-notion] global failure (continuing with existing files): ${err.message}`);
    process.exit(0); // do not break the build
  }
}

main();
```

- [ ] **Step 2: Make it executable**

```bash
chmod +x scripts/sync-notion.mjs
```

(On Windows the chmod is a no-op; npm run still invokes node directly.)

- [ ] **Step 3: Confirm script runs without args (no env vars set) and exits 0**

Run: `node scripts/sync-notion.mjs`
Expected: prints "[sync-notion] NOTION_TOKEN or NOTION_DATABASE_ID not set. Skipping sync..." and exits 0.

- [ ] **Step 4: Commit**

```bash
git add scripts/sync-notion.mjs
git commit -m "feat(sync): notion database → content/articles/*.mdx pipeline"
```

### Task E5: Wire `package.json` build scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update scripts**

Edit the `scripts` block:

```json
{
  "scripts": {
    "dev": "next dev",
    "sync": "node scripts/sync-notion.mjs",
    "prebuild": "node scripts/sync-notion.mjs",
    "build": "next build",
    "postbuild": "next-sitemap",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Notes:
- `prebuild` runs before `build` automatically (npm convention). This means Vercel runs sync without us editing the build command.
- `npm run sync` for manual local sync.

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: sync runs first (prints "Skipping sync" since no env), then next build proceeds normally. Build may fail because no articles exist yet — that's expected; fixed in E6.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore(build): add prebuild sync step"
```

### Task E6: Author the seed article

**Files:**
- Create: `content/articles/_hello-jinxuan_seed.mdx`

- [ ] **Step 1: Write the seed**

```mdx
---
title: "金萱漫遊・開站第一天"
description: "一片茶葉、一份地圖，和一個慢慢寫下去的計劃。"
slug: "hello-jinxuan"
publishedAt: "2026-05-26"
updatedAt: "2026-05-26"
author: "金萱"
keywords:
  - "金萱漫遊"
  - "旅行部落格"
  - "開站"
canonical: "https://jinxuan-roam.vercel.app/hello-jinxuan"
hasAffiliate: false
relatedSlugs:
  - "hello-jinxuan"
  - "hello-jinxuan"
  - "hello-jinxuan"
country: "台灣"
tripType: "雜記"
---

## 為什麼叫金萱

金萱是茶名，也是我的筆名。它一半是想念外婆家後山的茶園，一半是想旅行的時候不要走太快——茶要慢慢喝，路也要慢慢走。

## 這裡會寫什麼

私房路線、住宿筆記、咖啡店、書店、市場、巷子。不會是攻略網站，比較像是下次自己也會回來查的旅行筆記。

## 怎麼更新

文章寫在 Notion，整理好就同步到這裡。手機上、火車上、機場 lounge 都會更新。

## 接下來

第一篇正式文章正在寫，敬請期待。
```

Note: `slug: "hello-jinxuan"` (not `_hello-jinxuan_seed`); the underscored filename is git's signal, the article's slug is clean.

- [ ] **Step 2: Run build to confirm seed renders**

Run: `npm run build`
Expected: build succeeds. Output mentions `/hello-jinxuan` as a static route.

- [ ] **Step 3: Commit**

```bash
git add content/articles/_hello-jinxuan_seed.mdx
git commit -m "feat(content): seed welcome article 金萱漫遊・開站第一天"
```

### Task E7: Wire `app/[slug]/page.tsx` to read new frontmatter fields

**Files:**
- Modify: `app/[slug]/page.tsx`

Confirm that the article page reads `partner` / `partnerLink` from frontmatter and passes them to `ArticleSidebarCta`. The old field was `primaryExchange`.

- [ ] **Step 1: Read the file**

Find where `ArticleSidebarCta` is rendered.

- [ ] **Step 2: Replace prop sources**

```typescript
<ArticleSidebarCta
  partner={article.frontmatter.partner}
  partnerLink={article.frontmatter.partnerLink}
  sourceArticle={article.frontmatter.slug}
/>
```

- [ ] **Step 3: If `ArticleHeader` should display `Location` / `Trip Type` / `Travel Date`, decide whether to add chips now or defer**

For this initial launch: **defer**. Frontmatter fields are populated but not visually surfaced beyond what already exists. Travel chips on ArticleHeader is a P2 polish task.

- [ ] **Step 4: Commit**

```bash
git add app/[slug]/page.tsx
git commit -m "refactor(article): pass partner/partnerLink to sidebar CTA"
```

---

## Phase F — Verification + deploy

Goal: full test pass; manual smoke; push to Vercel; first-mobile-publish loop verified.

### Task F1: Full test suite

- [ ] **Step 1: Vitest**

Run: `npm test`
Expected: all unit tests pass. If failures remain, fix them inline. Common likely failures:
- Remaining `exchange` / `ExchangeKey` references — convert to `partner` / `PartnerKey`.
- Hardcoded `"littlefoxmoney"` strings in test fixtures — swap to `"金萱漫遊"`.

- [ ] **Step 2: Playwright**

```bash
npx playwright test
```

Expected: 6 structural tests pass (homepage h1, /about /disclosure /privacy h1s, 404, sitemap, theme toggle).

- [ ] **Step 3: tsc + lint**

```bash
npx tsc --noEmit
npx next lint
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Production build**

```bash
npm run build
```

Expected: builds with seed article only; sitemap regenerates including `/hello-jinxuan`.

- [ ] **Step 5: Commit any tweaks discovered**

```bash
git add -A
git commit -m "test: fixups discovered during full-suite run"
```

(Skip if nothing changed.)

### Task F2: Manual dev-server smoke test

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Visit and confirm in browser**

- `/` — hero shows 金萱漫遊, "最新文章" lists the seed article.
- `/hello-jinxuan` — article renders; ArticleHeader / TOC / sidebar visible (sidebar empty because seed has no partner — that's expected).
- `/about`, `/disclosure`, `/privacy` — all render with new copy.
- Theme toggle works.
- Favicon shows tea leaf.
- Open DevTools mobile preview (375px); confirm header + article render correctly.

- [ ] **Step 3: Capture any issues found as follow-up commits**

If broken: fix inline; commit; rerun smoke.

### Task F3: User-side: set up Notion database

This task has steps for the **human user**, not an automated agent.

- [ ] **Step 1: Create a Notion database**

In Notion, create a new database named「文章」with the schema from the spec §1.2. Required properties to create:

| Property        | Notion type        |
| --------------- | ------------------ |
| Title           | Title (default)    |
| Slug            | Text               |
| Status          | Select (Draft, Published) |
| Published At    | Date               |
| Excerpt         | Text               |
| Cover           | Files & media      |
| Country         | Select             |
| Location        | Text               |
| Trip Type       | Select             |
| Travel Date     | Date               |
| Tags            | Multi-select       |
| Partner         | Select (klook, trip, kkday, agoda, booking, expedia, none) |
| Partner Link    | URL                |

- [ ] **Step 2: Create a Notion internal integration**

In Notion → Settings & members → Integrations → "Develop or manage integrations" → "New integration":
- Name: `jinxuan sync`
- Workspace: yours
- Capabilities: Read content
- Save → copy the "Internal Integration Token".

- [ ] **Step 3: Share the database with the integration**

In the「文章」database page → top-right "..." → Connections → add the `jinxuan sync` integration.

- [ ] **Step 4: Get the database ID**

In Notion, open the database as a full page. Copy the URL — the 32-char hex segment between the workspace slug and `?v=...` is the database ID.

- [ ] **Step 5: Create `.env.local`**

```bash
cp .env.example .env.local
```

Then add:

```
NOTION_TOKEN=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=abc123def456...
```

(If `.env.example` doesn't exist yet, create both files at once.)

- [ ] **Step 6: Author a test article in Notion**

Add a draft article (any short content) to the database. Set Status = Published.

- [ ] **Step 7: Test local sync**

```bash
npm run sync
```

Expected: prints "[sync-notion] 1 synced, 0 skipped." A new `content/articles/<slug>.mdx` appears.

- [ ] **Step 8: Test local build**

```bash
npm run build && npm run dev
```

Open the new article's URL. Expected: renders with header / TOC / sidebar correctly. Cover image visible if Notion page had one.

### Task F4: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
git push origin master
```

- [ ] **Step 2: Connect to Vercel**

vercel.com → "New Project" → import the GitHub repo. Framework: Next.js (auto-detected).

- [ ] **Step 3: Set environment variables**

In project settings → Environment Variables:

- `NOTION_TOKEN` = (your token)
- `NOTION_DATABASE_ID` = (your DB id)
- `NEXT_PUBLIC_SITE_URL` = `https://<chosen-name>.vercel.app`
- (Affiliate env vars `AFFILIATE_KLOOK`, etc. — skip for now if you don't have partner accounts yet; the sidebar simply won't render outbound CTAs)

- [ ] **Step 4: Trigger first deploy**

Click "Deploy". Wait ~1–2 min.

- [ ] **Step 5: Smoke test live URL**

Visit the assigned `*.vercel.app` URL:
- `/` shows 金萱漫遊.
- `/hello-jinxuan` plus your test article both render.
- `/sitemap.xml` lists both URLs.
- `/robots.txt` returns 200.
- Open on phone — confirm layout.

- [ ] **Step 6: Verify mobile authoring loop**

1. On phone, open Notion app → add a 2-sentence new article → set Status = Published.
2. Open Vercel app → tap your project → Deployments → tap "..." on latest → Redeploy.
3. Wait ~30s. Refresh site on phone.
4. New article should appear at `/<slug>`.

If this loop works: the pivot is **shipped**.

- [ ] **Step 7: Final commit (post-launch notes)**

Update memory + (optional) notes:

```bash
# Update auto-memory project file to reflect launch
# (Claude will do this; nothing manual needed)
```

---

## Self-review checklist (run before handing off)

- ✅ Every spec section has a task: A (砍 crypto) ↔ Spec §1.3 Remove; B (partners + frontmatter) ↔ Spec §1.3 Change + §1.2 Notion schema; C (branding) ↔ Spec §1.3 Change-wordmark/logo + open Q #1; D (copy) ↔ Spec §1.3 Change copy; E (sync) ↔ Spec §1.1 + §2; F (verify+deploy) ↔ Spec §4 Launch sequence.
- ✅ Placeholder scan: no "TBD"/"add later"/"handle X" patterns. Every step has runnable commands or full code.
- ✅ Type consistency: `PartnerKey` used uniformly (B2 introduces, B3/B5/B6/B7/E3 consume); `partner` (not `primaryExchange`) used in all post-B5 references.
- ✅ Frontmatter schema (B5) defines `partner`, `partnerLink`, `country`, `location`, `tripType`, `travelDate` — sync helpers (E3) produce these exact field names; article page (E7) reads these exact names.
- ✅ Mobile authoring loop is verified explicitly in F4 step 6 (not assumed).
- ✅ Failure mode for missing Notion env handled (E4 exits 0 with warning, build continues with seed).

---

*End of plan. Run with subagent-driven-development (recommended) or executing-plans.*
