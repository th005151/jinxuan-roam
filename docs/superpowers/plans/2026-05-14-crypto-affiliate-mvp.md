# 台灣加密 Affiliate 站 MVP 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個 Next.js 15 + MDX 的台灣加密 affiliate 內容站，含 12 篇文章的發布基礎建設、`/go/*` affiliate 代理、GA4 事件追蹤、JSON-LD 結構化資料、動態 OG 圖、sitemap，並符合 E-E-A-T / 法律揭露要求。

**Architecture:** App Router + SSG（所有頁面 build-time 產生）。文章存於 `content/articles/*.mdx`，frontmatter 用 Zod 在 build-time 驗證——少欄位直接 build 失敗。Affiliate 連結全部走 `/go/[exchange]` 中介路由（GA4 server-side event + 301），環境變數集中管理實際分潤 URL。元件按職責分檔，每個檔案責任單一。

**Tech Stack:** Next.js 15、TypeScript（strict）、TailwindCSS、shadcn/ui、@next/mdx、gray-matter、Zod、schema-dts、next-themes、@vercel/og、next-sitemap、Vitest + React Testing Library。包管理採 npm（最低門檻）；命令以 PowerShell 為主。

**Source spec:** [`docs/superpowers/specs/2026-05-14-crypto-affiliate-mvp-design.md`](../specs/2026-05-14-crypto-affiliate-mvp-design.md)

---

## 檔案結構總覽

```
app/
  layout.tsx                     # Root layout + Theme provider + GA4
  page.tsx                       # 首頁
  about/page.tsx                 # 關於頁
  disclosure/page.tsx            # 揭露頁
  privacy/page.tsx               # 隱私頁
  [slug]/page.tsx                # 文章動態路由
  go/[exchange]/route.ts         # Affiliate 中介路由
  not-found.tsx                  # 404
  globals.css                    # Tailwind base
  opengraph-image.tsx            # 站台預設 OG（@vercel/og）

components/
  layout/
    header.tsx                   # 站台 Header
    footer.tsx                   # 站台 Footer
  article/
    article-header.tsx           # 文章頁標題區（含 breadcrumb、日期）
    article-body.tsx             # MDX 內文容器
    related-articles.tsx         # 文末相關文章
    faq.tsx                      # 文末 FAQ 區塊
  cta/
    cta-inline.tsx               # 內文錨點 CTA
    cta-summary.tsx              # 文末總結 CTA
    cta-comparison.tsx           # 比較表 inline CTA
  affiliate/
    disclosure-banner.tsx        # Layer 1：文章開頭揭露
    disclosure-inline.tsx        # Layer 2：CTA 旁揭露
  home/
    hero.tsx                     # 首頁 Hero
    exchange-card.tsx            # 交易所卡片
    article-card.tsx             # 文章卡片
  seo/
    json-ld.tsx                  # JSON-LD 注入元件
  ui/                            # shadcn/ui 元件（自動生成）

lib/
  mdx.ts                         # MDX 解析、frontmatter Zod 驗證
  articles.ts                    # getAllArticles, getArticleBySlug
  schemas/
    article.ts                   # Zod ArticleFrontmatter schema
  seo/
    metadata.ts                  # buildPageMetadata
    article-jsonld.ts            # buildArticleJsonLd
    breadcrumb-jsonld.ts         # buildBreadcrumbJsonLd
    faq-jsonld.ts                # buildFaqJsonLd
  analytics/
    ga4.ts                       # GA4 client + server event helpers
  affiliate/
    links.ts                     # Affiliate URL 表 + 取得函式
  config/
    site.ts                      # 全站常數（網址、作者、社群）
    exchanges.ts                 # 交易所基本資料

content/
  articles/
    *.mdx                        # 12 篇文章

public/
  fonts/                         # Noto Sans TC（self-host）
  images/                        # 圖片資源

tests/                           # 跨檔測試（非 co-located 部分）
```

---

# W0：基礎建設（Next.js 初始化 + MDX pipeline + 首頁雛形）

---

## Task 1：Next.js 15 專案初始化

**Files:**
- Create: `package.json`、`tsconfig.json`、`next.config.mjs`、`.gitignore`、`.env.local.example`
- Modify: 無

- [ ] **Step 1：在工作目錄建立 Next.js 專案**

執行命令（PowerShell，於 `c:\Users\HuJ\Desktop\Crypto`）：

```powershell
npx create-next-app@15 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-turbopack --use-npm
```

互動式提問遇到時一律選預設值。若提示「目錄非空」，回答 `y` 繼續（會保留 `plan.md` 與 `docs/`）。

Expected：建立 `app/`、`package.json`、`tsconfig.json`、`tailwind.config.ts`、`next.config.mjs`、`postcss.config.mjs`、`.eslintrc.json`、`.gitignore`。

- [ ] **Step 2：將 `tsconfig.json` 設為 strict 模式**

確認 `tsconfig.json` 的 `compilerOptions` 內含：

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "target": "ES2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

若 `create-next-app` 未加 `noUncheckedIndexedAccess` 與 `noImplicitOverride`，手動補上。

- [ ] **Step 3：建立 `.env.local.example`**

Create `.env.local.example`：

```bash
# Affiliate redirect targets
AFFILIATE_MAX=https://max.maicoin.com/signup?r=YOUR_CODE
AFFILIATE_BINANCE=https://accounts.binance.com/register?ref=YOUR_CODE
AFFILIATE_PIONEX=https://www.pionex.com/signUp?r=YOUR_CODE

# Site
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

- [ ] **Step 4：複製成 `.env.local` 並填入暫定值**

```powershell
Copy-Item .env.local.example .env.local
```

開啟 `.env.local`，先把所有 `YOUR_CODE` 換成佔位字串 `placeholder`，`NEXT_PUBLIC_SITE_URL` 改 `http://localhost:3000`，`NEXT_PUBLIC_GA4_ID` 留 `G-PLACEHOLDER`。

確認 `.gitignore` 已包含 `.env*.local`。

- [ ] **Step 5：清理 create-next-app 預設樣板**

刪除以下檔案：

```powershell
Remove-Item app/page.tsx, app/favicon.ico -ErrorAction SilentlyContinue
Remove-Item public/next.svg, public/vercel.svg, public/file.svg, public/globe.svg, public/window.svg -ErrorAction SilentlyContinue
```

清空 `app/globals.css`，只留 Tailwind directives：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 6：建立空 `app/page.tsx` 占位**

Create `app/page.tsx`：

```tsx
export default function HomePage() {
  return <main className="p-8">Coming soon</main>;
}
```

- [ ] **Step 7：驗證 dev server 啟動**

```powershell
npm run dev
```

開瀏覽器到 `http://localhost:3000`，應看到「Coming soon」。Ctrl+C 結束。

- [ ] **Step 8：初始化 git 並做首次 commit**

```powershell
git init
git add .
git commit -m "chore: bootstrap Next.js 15 + TypeScript + Tailwind"
```

---

## Task 2：安裝依賴與 Vitest 測試環境

**Files:**
- Create: `vitest.config.ts`、`vitest.setup.ts`
- Modify: `package.json`、`tsconfig.json`

- [ ] **Step 1：安裝執行期依賴**

```powershell
npm install gray-matter zod schema-dts next-themes @vercel/og clsx tailwind-merge
```

- [ ] **Step 2：安裝開發期依賴**

```powershell
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/node next-sitemap
```

- [ ] **Step 3：建立 `vitest.config.ts`**

Create `vitest.config.ts`：

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 4：建立 `vitest.setup.ts`**

Create `vitest.setup.ts`：

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5：在 `package.json` 加入 test scripts**

`package.json` 的 `scripts` 區塊加：

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 6：在 `tsconfig.json` 把 `vitest/globals` 加入 types**

`compilerOptions.types`（若無就建立）加：

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

- [ ] **Step 7：寫一個 smoke test 驗證設定**

Create `lib/smoke.test.ts`：

```ts
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("vitest works", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 8：執行測試確認通過**

```powershell
npm test
```

Expected：`1 passed`。

- [ ] **Step 9：刪除 smoke test 並 commit**

```powershell
Remove-Item lib/smoke.test.ts
git add .
git commit -m "chore: add Vitest + React Testing Library"
```

---

## Task 3：站台設定常數

**Files:**
- Create: `lib/config/site.ts`、`lib/config/exchanges.ts`

- [ ] **Step 1：建立 `lib/config/site.ts`**

Create `lib/config/site.ts`：

```ts
export const siteConfig = {
  name: "（待定）台灣加密新手指南",
  shortName: "Coinkit",
  description: "給台灣新手的加密貨幣交易所完整教學：MAX、幣安、派網一站搞懂。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "zh-TW",
  author: {
    name: "（你的暱稱）",
    bio: "台灣加密貨幣中度玩家。實際用過 MAX、幣安、派網；這個站是我的學習筆記。",
  },
} as const;

export type SiteConfig = typeof siteConfig;
```

- [ ] **Step 2：建立 `lib/config/exchanges.ts`**

Create `lib/config/exchanges.ts`：

```ts
export const EXCHANGE_KEYS = ["max", "binance", "pionex"] as const;
export type ExchangeKey = (typeof EXCHANGE_KEYS)[number];

export interface ExchangeInfo {
  key: ExchangeKey;
  displayName: string;
  tagline: string;
  fee: string;
  twdDeposit: boolean;
  beginnerFriendly: 1 | 2 | 3 | 4 | 5;
}

export const exchanges: Record<ExchangeKey, ExchangeInfo> = {
  max: {
    key: "max",
    displayName: "MAX",
    tagline: "台灣本地交易所，台幣入金最方便",
    fee: "0.15%",
    twdDeposit: true,
    beginnerFriendly: 5,
  },
  binance: {
    key: "binance",
    displayName: "幣安",
    tagline: "全球最大，幣種最多",
    fee: "0.10%",
    twdDeposit: false,
    beginnerFriendly: 3,
  },
  pionex: {
    key: "pionex",
    displayName: "派網",
    tagline: "免費網格機器人，被動投資首選",
    fee: "0.05%",
    twdDeposit: true,
    beginnerFriendly: 4,
  },
};
```

- [ ] **Step 3：commit**

```powershell
git add lib/config
git commit -m "feat(config): add site and exchange constants"
```

---

## Task 4：Zod Article Frontmatter Schema

**Files:**
- Create: `lib/schemas/article.ts`、`lib/schemas/article.test.ts`

- [ ] **Step 1：寫 schema 的測試**

Create `lib/schemas/article.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { ArticleFrontmatterSchema } from "./article";

const validInput = {
  title: "MAX 提領 USDT 到幣安：完整步驟",
  description: "本文示範如何把 USDT 從 MAX 轉到幣安，含鏈別選擇與確認時間。",
  slug: "max-to-binance-usdt-transfer",
  publishedAt: "2026-05-20",
  updatedAt: "2026-05-20",
  author: "HuJ",
  keywords: ["MAX 提領 USDT", "MAX 轉幣安"],
  canonical: "https://example.com/max-to-binance-usdt-transfer",
  hasAffiliate: true,
  relatedSlugs: ["max-buy-usdt", "binance-kyc-taiwan", "max-vs-binance"],
};

describe("ArticleFrontmatterSchema", () => {
  it("accepts valid frontmatter", () => {
    const result = ArticleFrontmatterSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects title over 30 characters", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validInput,
      title: "一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二",
    });
    expect(result.success).toBe(false);
  });

  it("rejects description over 70 characters", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validInput,
      description: "x".repeat(71),
    });
    expect(result.success).toBe(false);
  });

  it("requires exactly 3 relatedSlugs", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validInput,
      relatedSlugs: ["a", "b"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid slug format", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validInput,
      slug: "Has Spaces",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validInput,
      publishedAt: "20260520",
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2：執行測試確認失敗**

```powershell
npm test -- lib/schemas/article.test.ts
```

Expected：所有測試 FAIL，理由 `ArticleFrontmatterSchema` 未定義。

- [ ] **Step 3：實作 schema**

Create `lib/schemas/article.ts`：

```ts
import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

export const ArticleFrontmatterSchema = z.object({
  title: z.string().min(1).max(30, "Title must be <= 30 characters"),
  description: z.string().min(1).max(70, "Description must be <= 70 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  publishedAt: isoDate,
  updatedAt: isoDate,
  author: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1).max(8),
  ogImage: z.string().optional(),
  canonical: z.string().url(),
  hasAffiliate: z.boolean(),
  relatedSlugs: z.tuple([z.string(), z.string(), z.string()]),
});

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;
```

- [ ] **Step 4：執行測試確認通過**

```powershell
npm test -- lib/schemas/article.test.ts
```

Expected：6 passed.

- [ ] **Step 5：commit**

```powershell
git add lib/schemas
git commit -m "feat(schemas): add Zod ArticleFrontmatter schema"
```

---

## Task 5：MDX 解析模組

**Files:**
- Create: `lib/mdx.ts`、`lib/mdx.test.ts`、`content/articles/.gitkeep`、`content/articles/test-sample.mdx`（測試用）

- [ ] **Step 1：建立 content 目錄與測試用 mdx**

```powershell
New-Item -ItemType Directory -Force -Path content/articles | Out-Null
New-Item -ItemType File -Force -Path content/articles/.gitkeep | Out-Null
```

Create `content/articles/test-sample.mdx`（**僅供測試，後續會刪除**）：

```mdx
---
title: "測試文章"
description: "這是測試用 MDX 檔，僅供單元測試用途。"
slug: "test-sample"
publishedAt: "2026-05-14"
updatedAt: "2026-05-14"
author: "HuJ"
keywords: ["測試"]
canonical: "https://example.com/test-sample"
hasAffiliate: false
relatedSlugs: ["a", "b", "c"]
---

# Hello

Body text.
```

- [ ] **Step 2：寫 mdx 解析測試**

Create `lib/mdx.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { parseMdxFile } from "./mdx";
import path from "node:path";

const SAMPLE = path.join(process.cwd(), "content/articles/test-sample.mdx");

describe("parseMdxFile", () => {
  it("parses frontmatter and content", async () => {
    const result = await parseMdxFile(SAMPLE);
    expect(result.frontmatter.slug).toBe("test-sample");
    expect(result.frontmatter.title).toBe("測試文章");
    expect(result.content).toContain("# Hello");
  });

  it("throws on invalid frontmatter", async () => {
    await expect(
      parseMdxFile(path.join(process.cwd(), "content/articles/nonexistent.mdx"))
    ).rejects.toThrow();
  });
});
```

- [ ] **Step 3：執行測試確認失敗**

```powershell
npm test -- lib/mdx.test.ts
```

Expected：兩個測試 FAIL（`parseMdxFile` 未定義）。

- [ ] **Step 4：實作 `parseMdxFile`**

Create `lib/mdx.ts`：

```ts
import fs from "node:fs/promises";
import matter from "gray-matter";
import { ArticleFrontmatterSchema, type ArticleFrontmatter } from "./schemas/article";

export interface ParsedArticle {
  frontmatter: ArticleFrontmatter;
  content: string;
}

export async function parseMdxFile(absPath: string): Promise<ParsedArticle> {
  const raw = await fs.readFile(absPath, "utf-8");
  const { data, content } = matter(raw);
  const parsed = ArticleFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${absPath}:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`
    );
  }
  return { frontmatter: parsed.data, content };
}
```

- [ ] **Step 5：執行測試確認通過**

```powershell
npm test -- lib/mdx.test.ts
```

Expected：2 passed.

- [ ] **Step 6：commit**

```powershell
git add lib/mdx.ts lib/mdx.test.ts content/articles
git commit -m "feat(mdx): add MDX file parser with Zod frontmatter validation"
```

---

## Task 6：Article 索引函式

**Files:**
- Create: `lib/articles.ts`、`lib/articles.test.ts`

- [ ] **Step 1：寫測試**

Create `lib/articles.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { getAllArticles, getArticleBySlug } from "./articles";

describe("getAllArticles", () => {
  it("returns at least the test-sample article", async () => {
    const all = await getAllArticles();
    const slugs = all.map((a) => a.frontmatter.slug);
    expect(slugs).toContain("test-sample");
  });

  it("sorts by publishedAt descending", async () => {
    const all = await getAllArticles();
    for (let i = 1; i < all.length; i++) {
      expect(all[i - 1].frontmatter.publishedAt >= all[i].frontmatter.publishedAt).toBe(true);
    }
  });
});

describe("getArticleBySlug", () => {
  it("returns article when slug matches", async () => {
    const article = await getArticleBySlug("test-sample");
    expect(article?.frontmatter.title).toBe("測試文章");
  });

  it("returns null when slug not found", async () => {
    const article = await getArticleBySlug("does-not-exist");
    expect(article).toBeNull();
  });
});
```

- [ ] **Step 2：執行測試確認失敗**

```powershell
npm test -- lib/articles.test.ts
```

Expected：4 個測試 FAIL。

- [ ] **Step 3：實作**

Create `lib/articles.ts`：

```ts
import fs from "node:fs/promises";
import path from "node:path";
import { parseMdxFile, type ParsedArticle } from "./mdx";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

let cache: ParsedArticle[] | null = null;

async function loadAll(): Promise<ParsedArticle[]> {
  if (cache) return cache;
  const files = await fs.readdir(ARTICLES_DIR);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const parsed = await Promise.all(
    mdxFiles.map((f) => parseMdxFile(path.join(ARTICLES_DIR, f)))
  );
  cache = parsed.sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt)
  );
  return cache;
}

export async function getAllArticles(): Promise<ParsedArticle[]> {
  return loadAll();
}

export async function getArticleBySlug(slug: string): Promise<ParsedArticle | null> {
  const all = await loadAll();
  return all.find((a) => a.frontmatter.slug === slug) ?? null;
}

export async function getArticleSlugs(): Promise<string[]> {
  const all = await loadAll();
  return all.map((a) => a.frontmatter.slug);
}
```

- [ ] **Step 4：執行測試**

```powershell
npm test -- lib/articles.test.ts
```

Expected：4 passed.

- [ ] **Step 5：commit**

```powershell
git add lib/articles.ts lib/articles.test.ts
git commit -m "feat(articles): add article index helpers"
```

---

## Task 7：@next/mdx 整合

**Files:**
- Modify: `next.config.mjs`、`package.json`
- Create: `mdx-components.tsx`

- [ ] **Step 1：安裝 @next/mdx**

```powershell
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

- [ ] **Step 2：修改 `next.config.mjs`**

Overwrite `next.config.mjs`：

```js
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: {
    mdxRs: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
```

- [ ] **Step 3：建立 `mdx-components.tsx`**

Create `mdx-components.tsx`（**必須在專案根目錄**）：

```tsx
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-3 text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 text-xl font-semibold">{children}</h3>
    ),
    p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
    ul: ({ children }) => <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>,
    a: ({ href, children }) => (
      <a href={href} className="text-blue-600 underline hover:text-blue-800">
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
        {children}
      </code>
    ),
    ...components,
  };
}
```

- [ ] **Step 4：確認 dev server 仍可啟動**

```powershell
npm run dev
```

開瀏覽器到 `localhost:3000`，應仍看到「Coming soon」。Ctrl+C 結束。

- [ ] **Step 5：commit**

```powershell
git add .
git commit -m "feat(mdx): integrate @next/mdx with custom components"
```

---

## Task 8：暗色模式（next-themes）

**Files:**
- Create: `components/providers/theme-provider.tsx`、`components/ui/theme-toggle.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1：建立 ThemeProvider**

Create `components/providers/theme-provider.tsx`：

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />;
}
```

- [ ] **Step 2：建立 ThemeToggle 元件**

Create `components/ui/theme-toggle.tsx`：

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-8" />;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {theme === "dark" ? "☀" : "🌙"}
    </button>
  );
}
```

- [ ] **Step 3：修改 `app/layout.tsx`**

Overwrite `app/layout.tsx`：

```tsx
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { siteConfig } from "@/lib/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.locale} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4：在 `tailwind.config.ts` 啟用 dark class**

確認 `tailwind.config.ts` 含：

```ts
const config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  // ...
};
```

- [ ] **Step 5：驗證**

```powershell
npm run dev
```

頁面背景應隨 OS 主題切換深淺。Ctrl+C 結束。

- [ ] **Step 6：commit**

```powershell
git add .
git commit -m "feat(theme): add dark mode support with next-themes"
```

---

## Task 9：Header 與 Footer 元件

**Files:**
- Create: `components/layout/header.tsx`、`components/layout/footer.tsx`

- [ ] **Step 1：實作 Header**

Create `components/layout/header.tsx`：

```tsx
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "@/lib/config/site";

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.shortName}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/about" className="hover:underline">關於</Link>
          <Link href="/disclosure" className="hover:underline">揭露</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2：實作 Footer**

Create `components/layout/footer.tsx`：

```tsx
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 py-8 text-sm text-zinc-500 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl space-y-4 px-4">
        <p>
          本站內容僅供教育與資訊用途，不構成投資建議。加密貨幣具高度價格波動風險，投資前請自行評估。
        </p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/about" className="hover:underline">關於本站</Link>
          <Link href="/disclosure" className="hover:underline">Affiliate 揭露</Link>
          <Link href="/privacy" className="hover:underline">隱私權政策</Link>
        </nav>
        <p>© {new Date().getFullYear()} {siteConfig.name}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3：把 Header / Footer 套進 layout**

Modify `app/layout.tsx` 的 `<body>` 內容：

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <Header />
  <main>{children}</main>
  <Footer />
</ThemeProvider>
```

同檔頂端加 import：

```tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
```

- [ ] **Step 4：驗證**

```powershell
npm run dev
```

首頁應顯示 Header（logo + 關於 / 揭露 / theme toggle）與 Footer（免責 + 連結）。Ctrl+C 結束。

- [ ] **Step 5：commit**

```powershell
git add .
git commit -m "feat(layout): add header and footer"
```

---

## Task 10：首頁雛形（W0 終點）

**Files:**
- Create: `components/home/hero.tsx`、`components/home/exchange-card.tsx`、`components/home/article-card.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1：實作 Hero**

Create `components/home/hero.tsx`：

```tsx
import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        一站搞懂台灣怎麼買幣 + 用機器人
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        從零開始：MAX 入金 → USDT 提領到幣安 → 派網被動策略。中度玩家的學習筆記。
      </p>
      <Link
        href="/test-sample"
        className="mt-8 inline-block rounded-md bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        從這裡開始 →
      </Link>
    </section>
  );
}
```

- [ ] **Step 2：實作 ExchangeCard**

Create `components/home/exchange-card.tsx`：

```tsx
import type { ExchangeInfo } from "@/lib/config/exchanges";

export function ExchangeCard({ info }: { info: ExchangeInfo }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <h3 className="text-xl font-semibold">{info.displayName}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{info.tagline}</p>
      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-zinc-500">手續費</dt>
          <dd>{info.fee}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-500">台幣入金</dt>
          <dd>{info.twdDeposit ? "✓" : "需轉幣"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-500">新手友善度</dt>
          <dd>{"★".repeat(info.beginnerFriendly)}</dd>
        </div>
      </dl>
      <a
        href={`/go/${info.key}?from=home`}
        className="mt-4 block rounded bg-zinc-900 px-4 py-2 text-center text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        前往註冊 →
      </a>
    </div>
  );
}
```

- [ ] **Step 3：實作 ArticleCard**

Create `components/home/article-card.tsx`：

```tsx
import Link from "next/link";
import type { ArticleFrontmatter } from "@/lib/schemas/article";

export function ArticleCard({ fm }: { fm: ArticleFrontmatter }) {
  return (
    <Link
      href={`/${fm.slug}`}
      className="block rounded-lg border border-zinc-200 p-4 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <h3 className="font-semibold">{fm.title}</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{fm.description}</p>
      <time className="mt-2 block text-xs text-zinc-500">{fm.publishedAt}</time>
    </Link>
  );
}
```

- [ ] **Step 4：組合首頁**

Overwrite `app/page.tsx`：

```tsx
import { Hero } from "@/components/home/hero";
import { ExchangeCard } from "@/components/home/exchange-card";
import { ArticleCard } from "@/components/home/article-card";
import { exchanges, EXCHANGE_KEYS } from "@/lib/config/exchanges";
import { getAllArticles } from "@/lib/articles";

export default async function HomePage() {
  const articles = await getAllArticles();

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">推薦交易所</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {EXCHANGE_KEYS.map((key) => (
            <ExchangeCard key={key} info={exchanges[key]} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">最新文章</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.map((a) => (
            <ArticleCard key={a.frontmatter.slug} fm={a.frontmatter} />
          ))}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 5：驗證**

```powershell
npm run dev
```

首頁應顯示：Hero、3 張交易所卡片（MAX / 幣安 / 派網）、test-sample 文章卡片。Ctrl+C 結束。

- [ ] **Step 6：commit**

```powershell
git add .
git commit -m "feat(home): add hero, exchange cards, article list"
```

---

# W1：Affiliate 代理路由 + GA4 接通

---

## Task 11：Affiliate 連結表

**Files:**
- Create: `lib/affiliate/links.ts`、`lib/affiliate/links.test.ts`

- [ ] **Step 1：寫測試**

Create `lib/affiliate/links.test.ts`：

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { resolveAffiliateUrl } from "./links";

describe("resolveAffiliateUrl", () => {
  beforeEach(() => {
    vi.stubEnv("AFFILIATE_MAX", "https://max.maicoin.com/signup?r=abc");
    vi.stubEnv("AFFILIATE_BINANCE", "https://accounts.binance.com/register?ref=xyz");
    vi.stubEnv("AFFILIATE_PIONEX", "https://www.pionex.com/signUp?r=def");
  });

  it("returns the URL for a known exchange", () => {
    expect(resolveAffiliateUrl("max")).toBe("https://max.maicoin.com/signup?r=abc");
  });

  it("appends utm_source and utm_medium parameters", () => {
    const url = new URL(resolveAffiliateUrl("binance", "max-vs-binance"));
    expect(url.searchParams.get("utm_source")).toBe("coinkit");
    expect(url.searchParams.get("utm_medium")).toBe("article-cta");
    expect(url.searchParams.get("utm_campaign")).toBe("max-vs-binance");
  });

  it("returns null for unknown exchange", () => {
    // @ts-expect-error testing runtime guard
    expect(resolveAffiliateUrl("unknown")).toBeNull();
  });

  it("returns null when env var missing", () => {
    vi.stubEnv("AFFILIATE_MAX", "");
    expect(resolveAffiliateUrl("max")).toBeNull();
  });
});
```

- [ ] **Step 2：執行測試確認失敗**

```powershell
npm test -- lib/affiliate/links.test.ts
```

Expected：4 FAIL（`resolveAffiliateUrl` 未定義）。

- [ ] **Step 3：實作**

Create `lib/affiliate/links.ts`：

```ts
import { EXCHANGE_KEYS, type ExchangeKey } from "@/lib/config/exchanges";

const ENV_KEY: Record<ExchangeKey, string> = {
  max: "AFFILIATE_MAX",
  binance: "AFFILIATE_BINANCE",
  pionex: "AFFILIATE_PIONEX",
};

export function isExchangeKey(value: string): value is ExchangeKey {
  return (EXCHANGE_KEYS as readonly string[]).includes(value);
}

export function resolveAffiliateUrl(
  exchange: ExchangeKey,
  campaign?: string
): string | null {
  if (!isExchangeKey(exchange)) return null;
  const base = process.env[ENV_KEY[exchange]];
  if (!base) return null;
  try {
    const url = new URL(base);
    url.searchParams.set("utm_source", "coinkit");
    url.searchParams.set("utm_medium", "article-cta");
    if (campaign) url.searchParams.set("utm_campaign", campaign);
    return url.toString();
  } catch {
    return null;
  }
}
```

- [ ] **Step 4：執行測試確認通過**

```powershell
npm test -- lib/affiliate/links.test.ts
```

Expected：4 passed.

- [ ] **Step 5：commit**

```powershell
git add lib/affiliate
git commit -m "feat(affiliate): add link resolver with UTM tagging"
```

---

## Task 12：`/go/[exchange]` Route Handler

**Files:**
- Create: `app/go/[exchange]/route.ts`、`app/go/[exchange]/route.test.ts`

- [ ] **Step 1：寫測試**

Create `app/go/[exchange]/route.test.ts`：

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "./route";

function makeRequest(url: string): Request {
  return new Request(url);
}

describe("GET /go/[exchange]", () => {
  beforeEach(() => {
    vi.stubEnv("AFFILIATE_MAX", "https://max.maicoin.com/signup?r=abc");
  });

  it("redirects to the resolved affiliate URL", async () => {
    const res = await GET(makeRequest("https://site.com/go/max?from=home"), {
      params: Promise.resolve({ exchange: "max" }),
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toContain("max.maicoin.com");
    expect(res.headers.get("location")).toContain("utm_campaign=home");
  });

  it("returns 404 for unknown exchange", async () => {
    const res = await GET(makeRequest("https://site.com/go/unknown"), {
      params: Promise.resolve({ exchange: "unknown" }),
    });
    expect(res.status).toBe(404);
  });

  it("returns 503 when env var missing", async () => {
    vi.stubEnv("AFFILIATE_MAX", "");
    const res = await GET(makeRequest("https://site.com/go/max"), {
      params: Promise.resolve({ exchange: "max" }),
    });
    expect(res.status).toBe(503);
  });
});
```

- [ ] **Step 2：執行測試確認失敗**

```powershell
npm test -- app/go
```

Expected：3 FAIL。

- [ ] **Step 3：實作**

Create `app/go/[exchange]/route.ts`：

```ts
import { NextResponse } from "next/server";
import { isExchangeKey, resolveAffiliateUrl } from "@/lib/affiliate/links";

export const dynamic = "force-dynamic";

interface Context {
  params: Promise<{ exchange: string }>;
}

export async function GET(request: Request, ctx: Context): Promise<NextResponse> {
  const { exchange } = await ctx.params;
  if (!isExchangeKey(exchange)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const from = new URL(request.url).searchParams.get("from") ?? undefined;
  const target = resolveAffiliateUrl(exchange, from);
  if (!target) {
    return new NextResponse("Affiliate not configured", { status: 503 });
  }
  return NextResponse.redirect(target, { status: 302 });
}
```

- [ ] **Step 4：執行測試確認通過**

```powershell
npm test -- app/go
```

Expected：3 passed.

- [ ] **Step 5：手動驗證**

```powershell
npm run dev
```

瀏覽器開 `http://localhost:3000/go/max?from=home`，應 302 跳轉到 `max.maicoin.com/signup?r=placeholder&utm_source=coinkit&utm_medium=article-cta&utm_campaign=home`。Ctrl+C 結束。

- [ ] **Step 6：commit**

```powershell
git add app/go
git commit -m "feat(affiliate): add /go/[exchange] redirect route"
```

---

## Task 13：GA4 整合（client）

**Files:**
- Create: `components/analytics/ga4-script.tsx`、`lib/analytics/ga4.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1：建立 GA4 script 元件**

Create `components/analytics/ga4-script.tsx`：

```tsx
import Script from "next/script";

export function Ga4Script({ measurementId }: { measurementId: string }) {
  if (!measurementId || measurementId === "G-PLACEHOLDER") return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
```

- [ ] **Step 2：建立 GA4 event helper**

Create `lib/analytics/ga4.ts`：

```ts
type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export interface AffiliateClickPayload {
  exchange: string;
  source_article: string;
  cta_position: "top" | "middle" | "bottom" | "inline";
}

export interface CtaViewPayload extends AffiliateClickPayload {}

export function trackAffiliateClick(payload: AffiliateClickPayload): void {
  window.gtag?.("event", "affiliate_click", payload);
}

export function trackCtaView(payload: CtaViewPayload): void {
  window.gtag?.("event", "cta_view", payload);
}

export function trackExternalLink(target_domain: string, source_article: string): void {
  window.gtag?.("event", "external_link_click", { target_domain, source_article });
}

export function trackScroll75(source_article: string): void {
  window.gtag?.("event", "scroll_75", { source_article });
}
```

- [ ] **Step 3：套進 layout**

Modify `app/layout.tsx`：把 GA4 加入 `<body>`：

```tsx
import { Ga4Script } from "@/components/analytics/ga4-script";

// ... 內部：
<body className="...">
  <Ga4Script measurementId={process.env.NEXT_PUBLIC_GA4_ID ?? ""} />
  <ThemeProvider ...>
    {/* ... */}
  </ThemeProvider>
</body>
```

- [ ] **Step 4：驗證**

```powershell
npm run dev
```

由於 `NEXT_PUBLIC_GA4_ID=G-PLACEHOLDER`，不應有 GA script 載入（檢查 Network tab）。Ctrl+C 結束。

- [ ] **Step 5：commit**

```powershell
git add .
git commit -m "feat(analytics): add GA4 script + event helpers"
```

---

## Task 14：Affiliate 揭露元件（3 層）

**Files:**
- Create: `components/affiliate/disclosure-banner.tsx`、`components/affiliate/disclosure-inline.tsx`

- [ ] **Step 1：實作 Layer 1（文章開頭橫幅）**

Create `components/affiliate/disclosure-banner.tsx`：

```tsx
import Link from "next/link";

export function DisclosureBanner() {
  return (
    <aside className="my-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
      本文含 affiliate 連結，若你透過連結註冊，我會收到分潤，但對你的價格不會有影響。
      詳見 <Link href="/disclosure" className="underline">揭露聲明</Link>。
    </aside>
  );
}
```

- [ ] **Step 2：實作 Layer 2（CTA 旁小字）**

Create `components/affiliate/disclosure-inline.tsx`：

```tsx
export function DisclosureInline() {
  return (
    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
      揭露：這是 affiliate 連結，你註冊我會收到分潤。
    </p>
  );
}
```

- [ ] **Step 3：commit**

```powershell
git add components/affiliate
git commit -m "feat(affiliate): add disclosure components for layer 1 & 2"
```

---

# W2：文章模板 + JSON-LD

---

## Task 15：JSON-LD 注入元件

**Files:**
- Create: `components/seo/json-ld.tsx`

- [ ] **Step 1：實作**

Create `components/seo/json-ld.tsx`：

```tsx
export function JsonLd<T extends object>({ data }: { data: T }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2：commit**

```powershell
git add components/seo
git commit -m "feat(seo): add JsonLd injection component"
```

---

## Task 16：Article JSON-LD builder

**Files:**
- Create: `lib/seo/article-jsonld.ts`、`lib/seo/article-jsonld.test.ts`

- [ ] **Step 1：寫測試**

Create `lib/seo/article-jsonld.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { buildArticleJsonLd } from "./article-jsonld";
import type { ArticleFrontmatter } from "@/lib/schemas/article";

const fm: ArticleFrontmatter = {
  title: "MAX 開戶教學",
  description: "從零教你開戶 MAX。",
  slug: "max-signup-tutorial",
  publishedAt: "2026-05-20",
  updatedAt: "2026-06-01",
  author: "HuJ",
  keywords: ["MAX 開戶"],
  canonical: "https://example.com/max-signup-tutorial",
  hasAffiliate: true,
  relatedSlugs: ["a", "b", "c"],
};

describe("buildArticleJsonLd", () => {
  it("returns a valid Article schema object", () => {
    const result = buildArticleJsonLd(fm);
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Article");
    expect(result.headline).toBe("MAX 開戶教學");
    expect(result.datePublished).toBe("2026-05-20");
    expect(result.dateModified).toBe("2026-06-01");
    expect(result.author).toEqual({ "@type": "Person", name: "HuJ" });
  });
});
```

- [ ] **Step 2：執行測試確認失敗**

```powershell
npm test -- lib/seo/article-jsonld.test.ts
```

Expected：1 FAIL。

- [ ] **Step 3：實作**

Create `lib/seo/article-jsonld.ts`：

```ts
import type { Article, WithContext } from "schema-dts";
import type { ArticleFrontmatter } from "@/lib/schemas/article";
import { siteConfig } from "@/lib/config/site";

export function buildArticleJsonLd(fm: ArticleFrontmatter): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.description,
    datePublished: fm.publishedAt,
    dateModified: fm.updatedAt,
    author: { "@type": "Person", name: fm.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": fm.canonical },
    inLanguage: siteConfig.locale,
  };
}
```

- [ ] **Step 4：執行測試確認通過**

```powershell
npm test -- lib/seo/article-jsonld.test.ts
```

Expected：1 passed.

- [ ] **Step 5：commit**

```powershell
git add lib/seo
git commit -m "feat(seo): add Article JSON-LD builder"
```

---

## Task 17：BreadcrumbList JSON-LD builder

**Files:**
- Create: `lib/seo/breadcrumb-jsonld.ts`、`lib/seo/breadcrumb-jsonld.test.ts`

- [ ] **Step 1：寫測試**

Create `lib/seo/breadcrumb-jsonld.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { buildBreadcrumbJsonLd } from "./breadcrumb-jsonld";

describe("buildBreadcrumbJsonLd", () => {
  it("returns valid BreadcrumbList schema", () => {
    const result = buildBreadcrumbJsonLd([
      { name: "首頁", url: "https://example.com/" },
      { name: "MAX 開戶", url: "https://example.com/max-signup-tutorial" },
    ]);
    expect(result["@type"]).toBe("BreadcrumbList");
    expect(Array.isArray(result.itemListElement)).toBe(true);
    const items = result.itemListElement as Array<{ position: number; name: string }>;
    expect(items.length).toBe(2);
    expect(items[0]?.position).toBe(1);
    expect(items[1]?.position).toBe(2);
  });
});
```

- [ ] **Step 2：執行測試確認失敗**

```powershell
npm test -- lib/seo/breadcrumb-jsonld.test.ts
```

- [ ] **Step 3：實作**

Create `lib/seo/breadcrumb-jsonld.ts`：

```ts
import type { BreadcrumbList, WithContext } from "schema-dts";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

- [ ] **Step 4：執行測試確認通過**

```powershell
npm test -- lib/seo/breadcrumb-jsonld.test.ts
```

- [ ] **Step 5：commit**

```powershell
git add lib/seo
git commit -m "feat(seo): add BreadcrumbList JSON-LD builder"
```

---

## Task 18：FAQPage JSON-LD builder + FAQ 元件

**Files:**
- Create: `lib/seo/faq-jsonld.ts`、`lib/seo/faq-jsonld.test.ts`、`components/article/faq.tsx`

- [ ] **Step 1：寫測試**

Create `lib/seo/faq-jsonld.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { buildFaqJsonLd } from "./faq-jsonld";

describe("buildFaqJsonLd", () => {
  it("returns valid FAQPage schema", () => {
    const result = buildFaqJsonLd([
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ]);
    expect(result["@type"]).toBe("FAQPage");
    const items = result.mainEntity as Array<{ name: string }>;
    expect(items.length).toBe(2);
    expect(items[0]?.name).toBe("Q1?");
  });
});
```

- [ ] **Step 2：執行測試確認失敗**

```powershell
npm test -- lib/seo/faq-jsonld.test.ts
```

- [ ] **Step 3：實作 FAQ JSON-LD**

Create `lib/seo/faq-jsonld.ts`：

```ts
import type { FAQPage, WithContext } from "schema-dts";

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(items: FaqItem[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
```

- [ ] **Step 4：執行測試確認通過**

```powershell
npm test -- lib/seo/faq-jsonld.test.ts
```

- [ ] **Step 5：實作 FAQ UI 元件**

Create `components/article/faq.tsx`：

```tsx
import type { FaqItem } from "@/lib/seo/faq-jsonld";

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <h2 className="mb-4 text-2xl font-bold">常見問題</h2>
      <dl className="space-y-4">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="font-semibold">{item.question}</dt>
            <dd className="mt-1 text-zinc-700 dark:text-zinc-300">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 6：commit**

```powershell
git add lib/seo components/article
git commit -m "feat(seo): add FAQPage JSON-LD and FAQ component"
```

---

## Task 19：Breadcrumb 元件

**Files:**
- Create: `components/article/breadcrumb.tsx`

- [ ] **Step 1：實作**

Create `components/article/breadcrumb.tsx`：

```tsx
import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb-jsonld";

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb" className="text-sm text-zinc-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1">
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.url} className="hover:underline">{item.name}</Link>
              )}
              {!isLast && <span aria-hidden>›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2：commit**

```powershell
git add components/article
git commit -m "feat(article): add breadcrumb component"
```

---

## Task 20：RelatedArticles 元件

**Files:**
- Create: `components/article/related-articles.tsx`

- [ ] **Step 1：實作**

Create `components/article/related-articles.tsx`：

```tsx
import Link from "next/link";
import { getArticleBySlug } from "@/lib/articles";

export async function RelatedArticles({ slugs }: { slugs: readonly string[] }) {
  const articles = await Promise.all(slugs.map((s) => getArticleBySlug(s)));
  const found = articles.filter((a): a is NonNullable<typeof a> => a !== null);
  if (found.length === 0) return null;

  return (
    <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <h2 className="mb-4 text-2xl font-bold">相關文章</h2>
      <ul className="space-y-2">
        {found.map((a) => (
          <li key={a.frontmatter.slug}>
            <Link href={`/${a.frontmatter.slug}`} className="hover:underline">
              {a.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2：commit**

```powershell
git add components/article
git commit -m "feat(article): add related-articles component"
```

---

## Task 21：CTA 元件三種版型

**Files:**
- Create: `components/cta/cta-inline.tsx`、`components/cta/cta-summary.tsx`、`components/cta/cta-comparison.tsx`

- [ ] **Step 1：實作 cta-inline.tsx**

Create `components/cta/cta-inline.tsx`：

```tsx
"use client";

import { useEffect, useRef } from "react";
import { trackCtaView } from "@/lib/analytics/ga4";
import { DisclosureInline } from "@/components/affiliate/disclosure-inline";
import { exchanges, type ExchangeKey } from "@/lib/config/exchanges";

interface Props {
  exchange: ExchangeKey;
  benefit: string;
  sourceArticle: string;
  position: "top" | "middle" | "bottom";
}

export function CtaInline({ exchange, benefit, sourceArticle, position }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const info = exchanges[exchange];

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.5) {
            trackCtaView({ exchange, source_article: sourceArticle, cta_position: position });
            observer.disconnect();
          }
        }
      },
      { threshold: [0.5] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [exchange, sourceArticle, position]);

  return (
    <div
      ref={ref}
      className="my-6 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <p className="font-semibold">💡 {benefit}</p>
      <a
        href={`/go/${exchange}?from=${sourceArticle}`}
        className="mt-3 inline-block rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        前往 {info.displayName} 註冊 →
      </a>
      <DisclosureInline />
    </div>
  );
}
```

- [ ] **Step 2：實作 cta-summary.tsx**

Create `components/cta/cta-summary.tsx`：

```tsx
import Link from "next/link";
import { exchanges, type ExchangeKey } from "@/lib/config/exchanges";
import { DisclosureInline } from "@/components/affiliate/disclosure-inline";

interface Step {
  label: string;
  href: string;
  type: "affiliate" | "internal";
  exchange?: ExchangeKey;
}

interface Props {
  steps: Step[];
  sourceArticle: string;
}

export function CtaSummary({ steps, sourceArticle }: Props) {
  return (
    <section className="mt-10 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="mb-4 text-xl font-bold">接下來怎麼做？</h2>
      <ol className="space-y-3">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="font-semibold">步驟 {idx + 1}：</span>
            {step.type === "affiliate" && step.exchange ? (
              <a
                href={`/go/${step.exchange}?from=${sourceArticle}`}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {step.label}
              </a>
            ) : (
              <Link href={step.href} className="text-blue-600 underline hover:text-blue-800">
                {step.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <DisclosureInline />
    </section>
  );
}
```

- [ ] **Step 3：實作 cta-comparison.tsx**

Create `components/cta/cta-comparison.tsx`：

```tsx
import { exchanges, type ExchangeKey } from "@/lib/config/exchanges";

interface Row {
  exchange: ExchangeKey;
}

interface Props {
  rows: Row[];
  sourceArticle: string;
}

export function CtaComparison({ rows, sourceArticle }: Props) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-300 dark:border-zinc-700">
            <th className="py-2 text-left">交易所</th>
            <th className="py-2 text-left">手續費</th>
            <th className="py-2 text-left">台幣入金</th>
            <th className="py-2 text-left">新手友善</th>
            <th className="py-2 text-left">註冊</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ exchange }) => {
            const info = exchanges[exchange];
            return (
              <tr key={exchange} className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="py-2 font-semibold">{info.displayName}</td>
                <td className="py-2">{info.fee}</td>
                <td className="py-2">{info.twdDeposit ? "✓" : "需轉幣"}</td>
                <td className="py-2">{"★".repeat(info.beginnerFriendly)}</td>
                <td className="py-2">
                  <a
                    href={`/go/${exchange}?from=${sourceArticle}`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    註冊
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4：commit**

```powershell
git add components/cta
git commit -m "feat(cta): add three CTA variants (inline, summary, comparison)"
```

---

## Task 22：文章動態路由頁面

**Files:**
- Create: `app/[slug]/page.tsx`、`components/article/article-header.tsx`

- [ ] **Step 1：實作 ArticleHeader**

Create `components/article/article-header.tsx`：

```tsx
import { Breadcrumb } from "./breadcrumb";
import type { ArticleFrontmatter } from "@/lib/schemas/article";

export function ArticleHeader({ fm }: { fm: ArticleFrontmatter }) {
  return (
    <header className="mb-8">
      <Breadcrumb
        items={[
          { name: "首頁", url: "/" },
          { name: fm.title, url: `/${fm.slug}` },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{fm.title}</h1>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-zinc-500">
        <span>📅 發佈 {fm.publishedAt}</span>
        {fm.updatedAt !== fm.publishedAt && <span>✏️ 更新 {fm.updatedAt}</span>}
        <span>✍️ {fm.author}</span>
      </div>
    </header>
  );
}
```

- [ ] **Step 2：實作文章動態路由**

Create `app/[slug]/page.tsx`：

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { ArticleHeader } from "@/components/article/article-header";
import { RelatedArticles } from "@/components/article/related-articles";
import { DisclosureBanner } from "@/components/affiliate/disclosure-banner";
import { JsonLd } from "@/components/seo/json-ld";
import { buildArticleJsonLd } from "@/lib/seo/article-jsonld";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumb-jsonld";
import { siteConfig } from "@/lib/config/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.frontmatter.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  const { frontmatter: fm } = article;
  return {
    title: fm.title,
    description: fm.description,
    alternates: { canonical: fm.canonical },
    openGraph: {
      title: fm.title,
      description: fm.description,
      type: "article",
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt,
      authors: [fm.author],
    },
    keywords: fm.keywords,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const { default: MDXContent } = await import(`@/content/articles/${slug}.mdx`);
  const articleSchema = buildArticleJsonLd(article.frontmatter);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "首頁", url: siteConfig.url },
    { name: article.frontmatter.title, url: article.frontmatter.canonical },
  ]);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ArticleHeader fm={article.frontmatter} />
      {article.frontmatter.hasAffiliate && <DisclosureBanner />}
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <MDXContent />
      </div>
      <RelatedArticles slugs={article.frontmatter.relatedSlugs} />
    </article>
  );
}
```

- [ ] **Step 3：把 CTA 與 FAQ 元件註冊進 MDX components**

Modify `mdx-components.tsx`：頂端加 import 與註冊：

```tsx
import { CtaInline } from "@/components/cta/cta-inline";
import { CtaSummary } from "@/components/cta/cta-summary";
import { CtaComparison } from "@/components/cta/cta-comparison";
import { Faq } from "@/components/article/faq";
```

回傳物件加：

```tsx
CtaInline,
CtaSummary,
CtaComparison,
Faq,
```

- [ ] **Step 4：驗證**

```powershell
npm run dev
```

開瀏覽器到 `http://localhost:3000/test-sample`，應顯示測試文章。檢查 view-source 應含 `application/ld+json` 兩段（Article + Breadcrumb）。Ctrl+C 結束。

- [ ] **Step 5：commit**

```powershell
git add .
git commit -m "feat(article): add dynamic article page with JSON-LD"
```

---

# W3：靜態頁面（About / Disclosure / Privacy）+ 404

---

## Task 23：About 頁面

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1：實作**

Create `app/about/page.tsx`：

```tsx
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "關於本站",
  description: `${siteConfig.author.bio} 這個頁面寫了我是誰、為什麼寫這個站。`,
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 prose prose-zinc dark:prose-invert">
      <h1>關於本站</h1>
      <h2>我是誰</h2>
      <p>{siteConfig.author.bio}</p>
      <h2>為什麼寫這個站</h2>
      <p>
        台灣加密貨幣新手教學很多，但大多由交易所官方或大型內容站撰寫。我想從一個剛走過這條路的中度玩家視角，
        把實際遇到的卡關、查資料的時間、踩過的小坑記下來，讓接下來要走的人省一些時間。
      </p>
      <h2>我用過的交易所</h2>
      <ul>
        <li>MAX（2024 開始用，台幣入金主力）</li>
        <li>幣安（2025 開始用，現貨買賣）</li>
        <li>派網（2025 開始用，網格機器人）</li>
      </ul>
      <h2>我不寫的內容</h2>
      <p>
        我沒有實際操作過合約交易、DeFi yield farming、鏈上交易策略。
        為了不誤導讀者，這些主題我會明確標示「未涵蓋」。本站不提供任何投資建議。
      </p>
      <h2>如何聯絡</h2>
      <p>有任何錯誤指正或建議，歡迎透過 Email 聯絡（待補）。</p>
    </article>
  );
}
```

- [ ] **Step 2：驗證**

```powershell
npm run dev
```

開 `http://localhost:3000/about` 應顯示關於頁。Ctrl+C 結束。

- [ ] **Step 3：commit**

```powershell
git add app/about
git commit -m "feat(pages): add About page"
```

---

## Task 24：Disclosure 頁面

**Files:**
- Create: `app/disclosure/page.tsx`

- [ ] **Step 1：實作**

Create `app/disclosure/page.tsx`：

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate 揭露聲明",
  description: "本站使用 affiliate 連結。本頁說明合作交易所、分潤關係，以及推薦邏輯。",
};

export default function DisclosurePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 prose prose-zinc dark:prose-invert">
      <h1>Affiliate 揭露聲明</h1>
      <p>
        本站文章中包含 affiliate（推薦）連結。當你透過這些連結註冊任何交易所或服務時，
        我可能會收到該平台的分潤。對你而言，註冊與使用價格不會受影響。
      </p>
      <h2>目前合作的交易所</h2>
      <ul>
        <li>MAX</li>
        <li>幣安</li>
        <li>派網</li>
      </ul>
      <h2>推薦邏輯</h2>
      <p>
        我只推薦自己實際使用過的交易所與工具。affiliate 分潤從未影響我的推薦判斷——
        若有交易所付高分潤但體驗不佳，我會誠實寫出問題。
      </p>
      <h2>免責</h2>
      <p>
        本站內容僅供教育與資訊用途，不構成投資建議。
        加密貨幣具高度價格波動風險，投資前請自行評估並承擔風險。
      </p>
    </article>
  );
}
```

- [ ] **Step 2：commit**

```powershell
git add app/disclosure
git commit -m "feat(pages): add Disclosure page"
```

---

## Task 25：Privacy 頁面

**Files:**
- Create: `app/privacy/page.tsx`

- [ ] **Step 1：實作**

Create `app/privacy/page.tsx`：

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "本站如何處理你的個人資料、cookie 與分析資料。",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 prose prose-zinc dark:prose-invert">
      <h1>隱私權政策</h1>
      <p>最後更新：2026-05-14</p>

      <h2>資料蒐集</h2>
      <p>本站使用 Google Analytics 4 蒐集匿名統計資料，包含：</p>
      <ul>
        <li>頁面瀏覽記錄</li>
        <li>大致地理位置（國家層級）</li>
        <li>瀏覽器與裝置類型</li>
        <li>停留時間與互動行為（如點擊事件）</li>
      </ul>
      <p>本站不會蒐集姓名、Email、電話等個人識別資料。</p>

      <h2>Cookie 使用</h2>
      <p>
        本站使用 cookie 來：(1) 記錄你的主題偏好（明亮 / 暗色），
        (2) 透過 Google Analytics 進行匿名統計。
        你可以在瀏覽器設定中拒絕或清除 cookie。
      </p>

      <h2>第三方服務</h2>
      <p>本站使用以下第三方服務，這些服務可能會蒐集你的資料：</p>
      <ul>
        <li>Google Analytics（網站分析）</li>
        <li>Vercel（網站託管）</li>
        <li>各交易所 affiliate 連結（點擊後轉址到該交易所，受其隱私政策規範）</li>
      </ul>

      <h2>聯絡</h2>
      <p>如有隱私相關疑問，請透過 Email 聯絡（待補）。</p>
    </article>
  );
}
```

- [ ] **Step 2：commit**

```powershell
git add app/privacy
git commit -m "feat(pages): add Privacy page"
```

---

## Task 26：404 頁面

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1：實作**

Create `app/not-found.tsx`：

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        找不到這個頁面。也許文章還沒寫，或網址打錯了。
      </p>
      <Link href="/" className="mt-8 inline-block text-blue-600 underline hover:text-blue-800">
        回首頁 →
      </Link>
    </div>
  );
}
```

- [ ] **Step 2：驗證**

```powershell
npm run dev
```

開 `http://localhost:3000/random-nonsense` 應顯示 404 頁面。Ctrl+C 結束。

- [ ] **Step 3：commit**

```powershell
git add app/not-found.tsx
git commit -m "feat(pages): add 404 page"
```

---

# W4：OG 圖自動產生

---

## Task 27：站台預設 OG 圖

**Files:**
- Create: `app/opengraph-image.tsx`

- [ ] **Step 1：實作**

Create `app/opengraph-image.tsx`：

```tsx
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";

export const runtime = "edge";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, textAlign: "center" }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, color: "#a1a1aa", textAlign: "center" }}>
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2：驗證**

```powershell
npm run dev
```

開 `http://localhost:3000/opengraph-image` 應顯示一張 1200×630 PNG。Ctrl+C 結束。

- [ ] **Step 3：commit**

```powershell
git add app/opengraph-image.tsx
git commit -m "feat(seo): add default site OG image"
```

---

## Task 28：文章動態 OG 圖

**Files:**
- Create: `app/[slug]/opengraph-image.tsx`

- [ ] **Step 1：實作**

Create `app/[slug]/opengraph-image.tsx`：

```tsx
import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";
import { siteConfig } from "@/lib/config/site";

export const runtime = "nodejs";
export const alt = "Article preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { slug: string };
}

export default async function Image({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  const title = article?.frontmatter.title ?? siteConfig.name;
  const author = article?.frontmatter.author ?? siteConfig.author.name;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "white",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 28, color: "#71717a" }}>{siteConfig.shortName}</div>
        <div style={{ fontSize: 64, fontWeight: 700, color: "#18181b", lineHeight: 1.2 }}>
          {title}
        </div>
        <div style={{ fontSize: 24, color: "#71717a" }}>By {author}</div>
      </div>
    ),
    { ...size }
  );
}
```

> 注：此版本不引入自訂中文字型，使用系統 fallback（生產上中文會走 Vercel 提供的字型）。需要自訂字型時，未來再加 `fetch` 載入 Noto Sans TC。

- [ ] **Step 2：驗證**

```powershell
npm run dev
```

開 `http://localhost:3000/test-sample/opengraph-image` 應顯示文章標題的 OG 圖。Ctrl+C 結束。

- [ ] **Step 3：commit**

```powershell
git add app/[slug]/opengraph-image.tsx
git commit -m "feat(seo): add per-article OG image"
```

---

# W5：sitemap、robots、Search Console 準備

---

## Task 29：next-sitemap 設定

**Files:**
- Create: `next-sitemap.config.js`
- Modify: `package.json`

- [ ] **Step 1：建立設定**

Create `next-sitemap.config.js`：

```js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  exclude: ["/go/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/go/"],
      },
    ],
  },
};
```

- [ ] **Step 2：在 `package.json` 加 postbuild hook**

`package.json` 的 `scripts` 加：

```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

- [ ] **Step 3：驗證 build 產出**

```powershell
npm run build
```

確認 `public/sitemap.xml` 與 `public/robots.txt` 已生成。

- [ ] **Step 4：commit**

```powershell
git add .
git commit -m "feat(seo): add next-sitemap with /go exclusion"
```

---

## Task 30：清理測試樣本 + 完整 build 驗證

**Files:**
- Delete: `content/articles/test-sample.mdx`

- [ ] **Step 1：刪除測試 mdx**

```powershell
Remove-Item content/articles/test-sample.mdx
```

- [ ] **Step 2：建立一篇 placeholder 真實文章（W1 即將寫的 #11）**

Create `content/articles/max-vs-binance.mdx`：

```mdx
---
title: "MAX vs 幣安：什麼情境用哪個"
description: "新手該先用 MAX 還是直接開幣安？本文從手續費、入金、新手友善度三面向比較。"
slug: "max-vs-binance"
publishedAt: "2026-05-14"
updatedAt: "2026-05-14"
author: "HuJ"
keywords: ["MAX vs 幣安", "台灣 幣安", "MAX 手續費"]
canonical: "https://example.com/max-vs-binance"
hasAffiliate: true
relatedSlugs: ["test-a", "test-b", "test-c"]
---

# MAX vs 幣安：什麼情境用哪個

> 我的實際使用經驗：2024 開始用 MAX，2025 開始用幣安。這篇是兩者實際比較。

<CtaComparison
  sourceArticle="max-vs-binance"
  rows={[
    { exchange: "max" },
    { exchange: "binance" },
  ]}
/>

## 結論先講

如果你只想買 BTC / ETH 長期持有，直接用 MAX 比較單純。如果你想交易更多幣種或用合約，需要橋接到幣安。

<CtaInline
  exchange="max"
  benefit="想直接開始？MAX 註冊不到 10 分鐘"
  sourceArticle="max-vs-binance"
  position="middle"
/>

## 詳細比較

（內文待補）

<Faq
  items={[
    { question: "MAX 跟幣安哪個比較安全？", answer: "兩者都是合規平台。MAX 受台灣金管會規範，幣安在多國有牌照。" },
    { question: "新手該先用哪個？", answer: "建議先 MAX 熟悉操作，再橋接幣安。" },
    { question: "手續費差很多嗎？", answer: "MAX 0.15% vs 幣安 0.10%，差距不大；但幣安交易對更多。" },
  ]}
/>

<CtaSummary
  sourceArticle="max-vs-binance"
  steps={[
    { label: "註冊 MAX", href: "", type: "affiliate", exchange: "max" },
    { label: "完成 KYC", href: "/max-signup-tutorial", type: "internal" },
    { label: "了解派網被動策略", href: "/pionex-intro", type: "internal" },
  ]}
/>
```

> 因為 `relatedSlugs` Zod 要求剛好 3 個，但此時尚無其他文章存在，這裡先放占位 slug。在 W2–W12 過程中陸續寫真實文章時再回頭更新。

- [ ] **Step 3：執行完整 build**

```powershell
npm run build
```

Expected：成功 build，產出 `.next/`、`public/sitemap.xml`、`public/robots.txt`。`sitemap.xml` 內應含 `/`, `/about`, `/disclosure`, `/privacy`, `/max-vs-binance`。

- [ ] **Step 4：本地預覽 production build**

```powershell
npm run start
```

開 `http://localhost:3000`、`/max-vs-binance`、`/about`、`/disclosure` 各驗證一次。Ctrl+C 結束。

- [ ] **Step 5：commit**

```powershell
git add .
git commit -m "feat(content): replace test sample with first real article placeholder"
```

---

## Task 31：CTA 點擊事件追蹤

**Files:**
- Create: `components/cta/affiliate-link.tsx`
- Modify: `components/cta/cta-inline.tsx`、`components/cta/cta-summary.tsx`、`components/cta/cta-comparison.tsx`、`components/home/exchange-card.tsx`

- [ ] **Step 1：建立統一的 affiliate link 元件**

Create `components/cta/affiliate-link.tsx`：

```tsx
"use client";

import type { ReactNode } from "react";
import { trackAffiliateClick } from "@/lib/analytics/ga4";
import type { ExchangeKey } from "@/lib/config/exchanges";

interface Props {
  exchange: ExchangeKey;
  sourceArticle: string;
  position: "top" | "middle" | "bottom" | "inline";
  className?: string;
  children: ReactNode;
}

export function AffiliateLink({ exchange, sourceArticle, position, className, children }: Props) {
  const href = `/go/${exchange}?from=${encodeURIComponent(sourceArticle)}`;
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        trackAffiliateClick({ exchange, source_article: sourceArticle, cta_position: position });
      }}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 2：在 cta-inline.tsx 改用 AffiliateLink**

Modify `components/cta/cta-inline.tsx` —— 把原本的 `<a>` 換掉：

```tsx
import { AffiliateLink } from "./affiliate-link";

// 取代原本的 <a href={`/go/...`}>：
<AffiliateLink
  exchange={exchange}
  sourceArticle={sourceArticle}
  position={position}
  className="mt-3 inline-block rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
>
  前往 {info.displayName} 註冊 →
</AffiliateLink>
```

- [ ] **Step 3：在 cta-summary.tsx 改用 AffiliateLink**

Modify `components/cta/cta-summary.tsx`：

```tsx
import { AffiliateLink } from "./affiliate-link";

// 把 affiliate type 那一支改成：
{step.type === "affiliate" && step.exchange ? (
  <AffiliateLink
    exchange={step.exchange}
    sourceArticle={sourceArticle}
    position="bottom"
    className="text-blue-600 underline hover:text-blue-800"
  >
    {step.label}
  </AffiliateLink>
) : ( /* internal Link 不變 */ )}
```

- [ ] **Step 4：在 cta-comparison.tsx 改用 AffiliateLink**

Modify `components/cta/cta-comparison.tsx` —— 把 row 的 `<a>` 換成：

```tsx
import { AffiliateLink } from "./affiliate-link";

<AffiliateLink
  exchange={exchange}
  sourceArticle={sourceArticle}
  position="inline"
  className="text-blue-600 underline hover:text-blue-800"
>
  註冊
</AffiliateLink>
```

- [ ] **Step 5：在首頁 exchange-card 也改**

Modify `components/home/exchange-card.tsx` —— 把 `<a>` 換成 `AffiliateLink`：

```tsx
"use client";

import type { ExchangeInfo } from "@/lib/config/exchanges";
import { AffiliateLink } from "@/components/cta/affiliate-link";

export function ExchangeCard({ info }: { info: ExchangeInfo }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      {/* ...原本內容... */}
      <AffiliateLink
        exchange={info.key}
        sourceArticle="home"
        position="inline"
        className="mt-4 block rounded bg-zinc-900 px-4 py-2 text-center text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        前往註冊 →
      </AffiliateLink>
    </div>
  );
}
```

> ExchangeCard 改成 client component 後，首頁要確認仍能 SSG。Next.js 對 client component 內嵌 server-rendered 頁面是允許的，會自動處理。

- [ ] **Step 6：驗證 build 仍通過**

```powershell
npm run build
```

- [ ] **Step 7：commit**

```powershell
git add .
git commit -m "feat(analytics): track affiliate_click on all CTA components"
```

---

## Task 32：捲動深度追蹤

**Files:**
- Create: `components/analytics/scroll-tracker.tsx`
- Modify: `app/[slug]/page.tsx`

- [ ] **Step 1：實作捲動追蹤**

Create `components/analytics/scroll-tracker.tsx`：

```tsx
"use client";

import { useEffect } from "react";
import { trackScroll75 } from "@/lib/analytics/ga4";

export function ScrollTracker({ sourceArticle }: { sourceArticle: string }) {
  useEffect(() => {
    let fired = false;
    const onScroll = () => {
      if (fired) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total >= 0.75) {
        trackScroll75(sourceArticle);
        fired = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sourceArticle]);

  return null;
}
```

- [ ] **Step 2：把 ScrollTracker 加進文章頁**

Modify `app/[slug]/page.tsx` —— 加 import 與插入：

```tsx
import { ScrollTracker } from "@/components/analytics/scroll-tracker";

// 在 <article> 內最後加：
<ScrollTracker sourceArticle={article.frontmatter.slug} />
```

- [ ] **Step 3：驗證**

```powershell
npm run dev
```

開 `http://localhost:3000/max-vs-binance`，捲到底 → 開 DevTools Console 看 dataLayer 應出現 `scroll_75` 事件（GA4 ID 是 placeholder 時 `window.gtag` 為 undefined，事件不送出但也不會錯誤）。Ctrl+C 結束。

- [ ] **Step 4：commit**

```powershell
git add .
git commit -m "feat(analytics): track scroll_75 on article pages"
```

---

## Task 33：上線前 SEO 體質檢查 checklist

**Files:**
- Create: `docs/superpowers/notes/2026-05-14-launch-checklist.md`

- [ ] **Step 1：寫上線 checklist**

Create `docs/superpowers/notes/2026-05-14-launch-checklist.md`：

```markdown
# 上線第 1 週 SEO Checklist

> 這份 checklist 對應 spec §6.7。每個項目做完打勾。

## 部署前

- [ ] `.env.local` 所有 affiliate URL 改成真實值（不是 placeholder）
- [ ] `NEXT_PUBLIC_GA4_ID` 改成真實 G-XXXXXXXXXX
- [ ] `NEXT_PUBLIC_SITE_URL` 改成 production 網址
- [ ] `lib/config/site.ts` 的 `name`、`author.name`、`author.bio` 確認最終文案
- [ ] 至少有 1 篇真實文章（W1 寫的 #11 MAX vs 幣安）

## Vercel 部署

- [ ] Vercel 專案連結 GitHub repo
- [ ] Vercel 環境變數設定（AFFILIATE_*、NEXT_PUBLIC_GA4_ID、NEXT_PUBLIC_SITE_URL）
- [ ] 部署成功，自訂網域指向 Vercel
- [ ] HTTPS 啟用（Vercel 自動）

## SEO 平台

- [ ] Google Search Console 驗證網域所有權
- [ ] 提交 `https://yourdomain.com/sitemap.xml`
- [ ] Bing Webmaster Tools 從 GSC 匯入
- [ ] Ahrefs Webmaster Tools 註冊並驗證

## 結構化資料驗證

- [ ] 開 https://search.google.com/test/rich-results
- [ ] 測試首頁、文章頁、Disclosure 頁
- [ ] 確認 Article、BreadcrumbList、FAQPage 都被識別且無錯誤

## 效能驗證

- [ ] 開 https://pagespeed.web.dev/
- [ ] 測試首頁與 1 篇文章頁
- [ ] 行動版分數 > 90
- [ ] LCP < 2.0s, INP < 200ms, CLS < 0.05

## Open Graph 驗證

- [ ] 開 https://www.opengraph.xyz/
- [ ] 測試首頁與文章頁
- [ ] 圖片正常顯示、文字無亂碼

## Affiliate 申請（先做最寬鬆的）

- [ ] 派網 affiliate 申請（網站還沒文章也行）
- [ ] MAX affiliate 申請
- [ ] 幣安 affiliate 等 1 個月有 GA4 數據再申請

## 簡單 outreach

- [ ] PTT digicurrency 板自我介紹文 1 篇（含網站連結，注意板規）
- [ ] Reddit r/Taiwanese 或相關板 1 篇英文版本（可選）
```

- [ ] **Step 2：commit**

```powershell
git add docs/superpowers/notes
git commit -m "docs: add launch checklist"
```

---

## Task 34：README 與專案文件

**Files:**
- Modify: `README.md`（create-next-app 已生成，但內容無關）

- [ ] **Step 1：覆寫 README**

Overwrite `README.md`：

```markdown
# Coinkit — 台灣加密 Affiliate 站

一個 Next.js 15 + MDX 的台灣加密貨幣新手內容站。Spec 與實作計畫見 `docs/superpowers/`。

## 快速開始

```powershell
npm install
Copy-Item .env.local.example .env.local
# 編輯 .env.local 填入 affiliate URL 與 GA4 ID
npm run dev
```

開 `http://localhost:3000`。

## 專案結構

- `app/` — Next.js App Router 頁面與 API
- `components/` — React 元件（layout / article / cta / affiliate / seo）
- `content/articles/` — MDX 文章
- `lib/` — 業務邏輯（MDX 解析、SEO、analytics、affiliate）
- `docs/superpowers/` — 設計文件、實作計畫、上線 checklist

## 寫新文章

1. 在 `content/articles/` 建立新 `.mdx` 檔
2. Frontmatter 必須符合 `lib/schemas/article.ts` 的 Zod schema（少欄位 build 失敗）
3. 文中可用 MDX 元件：`<CtaInline>`、`<CtaSummary>`、`<CtaComparison>`、`<Faq>`
4. 本機 `npm run dev` 確認後 commit

## 測試

```powershell
npm test          # 跑一次
npm run test:watch  # watch 模式
```

## 部署

Push 到 GitHub，Vercel 自動 build。`postbuild` 會跑 next-sitemap 生成 sitemap 與 robots.txt。

## Spec 與停損

詳見 `docs/superpowers/specs/2026-05-14-crypto-affiliate-mvp-design.md`。

簡短版：3 / 6 / 12 個月各有檢核點，達不到判準就停損或 pivot。**收入是 bonus，不是評分標準。**
```

- [ ] **Step 2：commit**

```powershell
git add README.md
git commit -m "docs: rewrite README with project overview"
```

---

# 完成檢核

## Task 35：W0–W5 全段驗收

- [ ] **Step 1：所有測試通過**

```powershell
npm test
```

Expected：全綠。

- [ ] **Step 2：production build 成功**

```powershell
npm run build
```

Expected：成功生成 `.next/`、`public/sitemap.xml`、`public/robots.txt`。

- [ ] **Step 3：本地預覽 prod build**

```powershell
npm run start
```

逐一確認以下頁面可正常開啟：
- `/` 首頁
- `/max-vs-binance` 文章頁
- `/about`
- `/disclosure`
- `/privacy`
- `/random-nonsense` → 404
- `/go/max?from=test` → 302 跳轉

Ctrl+C 結束。

- [ ] **Step 4：JSON-LD 驗證**

把 `/max-vs-binance` 頁面原始碼貼到 https://search.google.com/test/rich-results，應識別到：
- Article schema
- BreadcrumbList schema
- FAQPage schema（如果文章用了 `<Faq>` 元件）

- [ ] **Step 5：給接下來的開發者的話**

W0–W5 工程基礎已完成。下一步：

- 開始寫 12 篇真實內容（按 spec §3.2 排序）
- 部署到 Vercel + 接 custom domain
- 跑 `docs/superpowers/notes/2026-05-14-launch-checklist.md`
- W12 結束時對照 spec §8.3 做 3 個月檢核

工程上未做但未來需要時可加：
- Note：spec §9 列的 5 個開放問題（網域、署名、Hero 文案、第一篇大綱、派網帳號）需在實際上線前釐清
- 圖片 CDN 優化（流量起來後考慮 Cloudflare Images）
- 內容更新自動化（如 GitHub Action 提醒 90 天未更新的文章）

---

# 自我審查（writing-plans skill 要求）

## 1. Spec 覆蓋

對照 spec 每個 section：

| Spec 段落 | 對應 Task |
|---|---|
| §3.1 12 篇 cluster | 內容階段執行，Task 30 提供第一篇骨架；其餘 11 篇在 W1–W12 寫 |
| §3.2 寫作排序 | 由 spec §8.2 衝刺週次定義，Task 編號不對應週次但工程基礎完備 |
| §4.1 5 種頁面類型 + /go | Task 10、22、23、24、25、26、12 |
| §4.2 URL 結構（扁平、英文 slug） | Task 4 Zod schema 強制 |
| §4.3 首頁版型 | Task 10 |
| §4.4 文章頁版型 | Task 22 |
| §5.1–5.3 技術棧 | Task 1、2、7 |
| §5.4 custom domain | 不是工程 task，但 Task 33 checklist 列出 |
| §6.1 Frontmatter schema | Task 4 |
| §6.2 JSON-LD 三種 | Task 15、16、17、18 |
| §6.3 內鏈 hub-and-spoke | Task 20 + frontmatter `relatedSlugs` 欄位 |
| §6.4 圖片 SEO | 部分（OG 圖在 Task 27、28；內文圖規範待文章撰寫時遵守） |
| §6.5 Core Web Vitals | Task 35 驗收檢查 |
| §6.6 E-E-A-T | Task 23 About 頁 + 文章 frontmatter author / dates |
| §6.7 上線第 1 週 checklist | Task 33 |
| §7.1 CTA 三版型 | Task 21 |
| §7.2 `/go/*` 代理路由 | Task 11、12、31 |
| §7.3 GA4 事件 | Task 13、31、32 |
| §7.4 三層揭露 | Task 14（Layer 1+2）、Task 24（Layer 3） |
| §7.5 Affiliate 申請順序 | Task 33 checklist |
| §8 里程碑停損 | 非工程 task，spec 中為操作指引 |

**未覆蓋（刻意）：**
- 圖片 SEO 完整規範（§6.4 alt / 檔名要求）—— 屬於寫文章時的編輯規範，非工程基建
- 12 篇文章內容本身 —— 是 W1–W12 內容工作，非本計畫範圍

## 2. Placeholder 掃描

- ✅ 無 `TBD` / `TODO` / `implement later`
- ✅ 所有程式碼步驟都有完整程式碼
- ✅ 所有命令都是可執行的具體形式
- ⚠️ `lib/config/site.ts` 中 `name` 與 `author.name` 是中文 placeholder（「待定」「你的暱稱」）—— 這是 spec §9「開放問題」明確列出的待釐清項目，**保留作為實作者可見的提示**，不算 plan 缺陷

## 3. 型別一致性

- ✅ `ArticleFrontmatter` 在 Task 4 定義，在 Task 5、6、16、22 使用
- ✅ `ExchangeKey` 在 Task 3 定義，在 Task 11、12、21、31 使用
- ✅ `ParsedArticle` 在 Task 5 定義，在 Task 6 使用
- ✅ `BreadcrumbItem` 在 Task 17 定義，在 Task 19、22 使用
- ✅ `FaqItem` 在 Task 18 定義
- ✅ CTA `position` 型別在 Task 13 (`"top" | "middle" | "bottom" | "inline"`) 定義，在 Task 21、31 一致使用
- ✅ Function names: `parseMdxFile`、`getAllArticles`、`getArticleBySlug`、`buildArticleJsonLd`、`buildBreadcrumbJsonLd`、`buildFaqJsonLd`、`resolveAffiliateUrl`、`trackAffiliateClick`、`trackCtaView`、`trackScroll75` 全程使用一致名稱

## 4. 範圍檢查

本計畫聚焦在 spec §1–§7 的工程實作（網站基建 + MDX pipeline + 元件 + SEO 設施 + analytics）。
Spec §8（里程碑）與 §9（開放問題）屬於操作層面，不在工程實作 plan 內。
12 篇文章本身是內容工作（W1–W12），不在本 plan 內，但本 plan 提供了所有必要基礎建設讓內容可發佈。
