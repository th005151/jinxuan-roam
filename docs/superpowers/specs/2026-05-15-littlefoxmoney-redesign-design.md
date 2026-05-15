# 視覺重做 + 品牌建立：littlefoxmoney × Modern Editorial × Emerald

**日期**：2026-05-15
**狀態**：Draft（待 user review）
**取代**：[2026-05-14-visual-redesign-design.md](2026-05-14-visual-redesign-design.md)
**範圍**：純視覺、品牌識別、字型載入、token 系統、layout 重做。不動 routing、data model、analytics、SEO 結構、affiliate redirect 行為

## 1. 動機

MVP 工程基建（Task 1–35）已完成且 E2E 全綠，但 UI 仍是 create-next-app + Tailwind 預設樣式的延伸：

- 視覺層次扁平、看不出主次資訊
- 太 generic / AI 生成感（zinc 灰階 + sans-serif system default）
- 配色 / 字體 / 間距不夠精緻
- Hero / CTA 不夠抓人
- 沒有品牌識別（site name 是「（待定）台灣加密新手指南」、shortName placeholder「Coinkit」）

同時，新 design handoff [`CryptoWebsite/design_handoff_littlefoxmoney/`](../../../CryptoWebsite/design_handoff_littlefoxmoney/) 完整定義了品牌 **小狐理財 littlefoxmoney**，包含 FX mark、wordmark、4 種 lockup variant、4 個字型。本 spec 把「視覺重做」與「品牌建立」**合併執行**，一次到位避免兩段式改動造成 churn。

舊 spec 的 D2 placeholder（emerald 圓 + 白色 C monogram）由本 spec 的 §3 brand system 取代。

## 2. 設計方向

**littlefoxmoney × Modern Editorial × 文章頁兩欄克制 sidebar**

- 純白底（dark mode 對應 zinc-950）、大字 sans heading、文章 body 換 serif 提升閱讀
- 主色 emerald-600（dark mode 用 emerald-400），用在 logo accent、連結、CTA、focus ring
- 文章頁兩欄：左主內容 + 右窄 sidebar（TOC + 主推交易所 CTA + 相關文章）
- 首頁保留單欄 hero 衝擊
- 品牌識別：FX mark + wordmark `little<emerald>fox</emerald>money`，CSS-only（無 SVG asset）

調性差異：競品（呢喃貓商學院）右側 8 個 affiliate banner 堆疊的「內容工廠感」要避免——本站 spec §7.4「affiliate 三層揭露」明確主張「affiliate 不影響推薦判斷」，sidebar 只放 1 個本文相關交易所 CTA。

## 3. Brand system

直接採用 design handoff 規範。

### 3.1 Primary mark — `FX` in emerald circle

| 屬性 | 值 |
|---|---|
| Shape | 正圓（border-radius 50%） |
| Background | `--color-brand` (#059669, emerald-600) |
| Foreground | white |
| Glyph | uppercase `FX`（Inter 800） |
| Font-size | `size × 0.46` |
| Letter-spacing | `-0.05em` |
| Line-height | `1` |
| 預設 size | 32px |
| Min size | 16×16（favicon） |
| Meaning | `FX` = Foreign Exchange（外匯／金融域訊號） + `X` from f**OX** |

### 3.2 Wordmark

`little<span class="text-brand">fox</span>money`，純 HTML/CSS。

| 屬性 | 值 |
|---|---|
| Font | Inter |
| Weight | 800 |
| Letter-spacing | `-0.045em` |
| Line-height | `1` |
| 預設 size | 18px (header 用) |
| `little` / `money` color | ink (zinc-900) |
| `fox` accent color | brand (emerald-600) |

### 3.3 Subtitle (中文)

「小狐理財」（vertical lockup 用「小 狐 理 財」加大 letter-spacing）。

| 屬性 | 值 |
|---|---|
| Font | Noto Sans TC |
| Weight | 500 |
| Letter-spacing | `0.32em` (horizontal) / `0.4em` (vertical) |

### 3.4 Lockups

| Variant | 組成 |
|---|---|
| `horizontal` (primary) | mark + gap-3 + wordmark；可選顯示 subtitle 在 wordmark 下方 |
| `vertical` | mark 上 / wordmark 下 / subtitle 最下 |
| `mark-only` | favicon、app icon、social avatar |
| `wordmark-only` | wordmark 單獨；可選 subtitle 行 |

### 3.5 Tones

| Tone | mark bg | mark fg | wordmark color | wordmark accent |
|---|---|---|---|---|
| `light` | emerald-600 | white | zinc-900 | emerald-600 |
| `dark` | emerald-400 | emerald-900 | zinc-50 | emerald-400 |
| `mono` | ink (zinc-900) | white | zinc-900 | zinc-900 |

`mono` 在 v1 保留 prop 但不在任何頁面使用（D14）。

### 3.6 Clear space

Lockup 周圍最少留白 = mark 的 radius。

### 3.7 替代 mark (₣ / F× / $F)

文件化於 handoff README，**v1 不實作**（D15）。

## 4. Visual system

### 4.1 Colors（semantic tokens；全部 Tailwind 內建）

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#0a0a0a` (zinc-950) | 頁面背景 |
| `surface` | `#FAFAFA` (zinc-50) | `#18181B` (zinc-900) | 卡片、aside |
| `text` | `#18181B` (zinc-900) | `#FAFAFA` (zinc-50) | 主文字 |
| `text-muted` | `#71717A` (zinc-500) | `#A1A1AA` (zinc-400) | meta |
| `border` | `#E4E4E7` (zinc-200) | `#27272A` (zinc-800) | 細邊框 |
| `accent` | `#059669` (emerald-600) | `#34D399` (emerald-400) | logo / CTA / link / focus |
| `accent-hover` | `#047857` (emerald-700) | `#10B981` (emerald-500) | CTA hover |
| `accent-soft` | `#ECFDF5` (emerald-50) | `#064E3B` (emerald-900) | CTA inline 底、aside 底 |

不引入新色相。

### 4.2 Typography

`next/font/google` 載入 4 個字型，各暴露 CSS variable，由 `@theme inline` 串到 Tailwind utility：

| Family | Weights | Variable | 用途 |
|---|---|---|---|
| Inter | 400 / 600 / 700 / 800 | `--font-inter` | UI / heading |
| Noto Sans TC | 400 / 500 / 700 | `--font-noto-sans-tc` | UI / heading 中文 |
| Source Serif 4 | 400 / 600 / 700 | `--font-source-serif` | Article body |
| Noto Serif TC | 400 / 700 | `--font-noto-serif-tc` | Article body 中文 |

Stack：
- UI / Heading: `Inter, "Noto Sans TC", system-ui, sans-serif`
- Article body: `"Source Serif 4", "Noto Serif TC", Georgia, serif`
- Code: `"JetBrains Mono", ui-monospace, monospace`（無需 web font load）

### 4.3 Type scale

| 元素 | Mobile | Desktop | Weight | Letter-spacing |
|---|---|---|---|---|
| Hero h1 | 32 / 1.15 | `clamp(48px, 5vw, 60px)` / 1.1 | 800 | -0.025em |
| Article h1 | 24 / 1.2 | 32 / 1.2 | 700 | -0.015em |
| h2 | 20 / 1.3 | 24–28 / 1.3 | 700 | -0.015em |
| h3 | 17 / 1.4 | 18 / 1.4 | 600 | 0 |
| Body (UI) | 14 / 1.6 | 15 / 1.6 | 400 | 0 |
| Body (article) | 16 / 1.75 | 17 / 1.75 | 400 | 0 |
| Meta / label | 12 / 1.5 | 13 / 1.5 | 600 | 0.18em uppercase |
| Caption | 11 / 1.4 | 12 / 1.4 | 400 | 0 |

### 4.4 Spacing / radius / shadow

- Container 寬度
  - 首頁 / 靜態頁：`max-w-4xl` (homepage hero) / `max-w-3xl` (static)
  - 文章頁 main：`max-w-2xl` + sidebar `220px`，gap-10（D4）
- Radius：卡片 / aside `8px`；CTA button `6px`
- Shadow：resting `shadow-sm`，hover `shadow-md` + `--shadow-brand-hover`（`0 8px 24px rgba(5,150,105,0.08)`）
- Mark drop-shadow（isolated icon）：`--shadow-mark`（`0 12px 28px -8px rgba(5,150,105,0.4)`）

## 5. Layout

### 5.1 首頁（單欄）

```
┌──────────────────────────────────────┐
│ Header (Logo · nav · ThemeToggle)    │
├──────────────────────────────────────┤
│ Eyebrow（emerald uppercase 0.18em）  │
│ H1 (Inter 800, 大字 2 行)            │
│ Sub (text-muted, max-width ~480px)   │
│                                      │
│ ┌─MAX─┐ ┌─幣安─┐ ┌─派網─┐            │
│ └─────┘ └──────┘ └──────┘            │
│                                      │
│ ─ 最新文章 ─                          │
│ • MAX vs 幣安                         │
│ • ...（max 5）                        │
├──────────────────────────────────────┤
│ Footer (Logo + Subtitle 小狐理財)     │
└──────────────────────────────────────┘
```

- Container `max-w-4xl mx-auto px-6 py-12`
- Exchange grid 1 / 2 / 3 欄響應式
- Article list 用 `<dl>` 風格分隔線

### 5.2 文章頁（兩欄）

```
┌────────────────────────────────────────────────┐
│ Header                                         │
├────────────────────────────────────────────────┤
│ Breadcrumb                                     │
├──────────────────────────────┬─────────────────┤
│ Main (max-w-2xl)             │ Sidebar (220px) │
│ ArticleHeader (h1 serif)     │ TOC (sticky)    │
│ DisclosureBanner             │ ─────────       │
│ MDX body (serif prose)       │ 本文交易所 CTA   │
│ Faq                          │ ─────────       │
│ ScrollTracker (no UI)        │ 相關閱讀         │
└──────────────────────────────┴─────────────────┘
```

- Grid：desktop `grid-cols-[1fr_220px] gap-10`；mobile `grid-cols-1`（sidebar 堆下方）
- Sidebar `sticky top-24` desktop；mobile 不 sticky，TOC 用 `<details>` 收合（D5）
- RelatedArticles 桌面從 article main 移除，內容搬進 sidebar；mobile 保留 inline 在 main 下方

### 5.3 靜態頁 / 404

維持單欄 `max-w-3xl`（about / disclosure / privacy / not-found）。

## 6. Components inventory

### 6.1 新增

| 元件 | 路徑 | 說明 |
|---|---|---|
| `LogoMark` | `components/layout/logo-mark.tsx` | **取代 placeholder C monogram**。CSS-only `FX` mark；props `size?: number = 32`、`tone?: 'light' \| 'dark' \| 'mono' = 'light'`、`bg?: string`、`fg?: string`、`'aria-label'?: string = 'littlefoxmoney'`、`className?: string`。實作改 Tailwind class（`bg-brand text-white dark:bg-emerald-400 dark:text-emerald-900`），但 size 動態維持 inline `width/height/font-size`（avoid Tailwind safelist bloat） |
| `Wordmark` | `components/layout/wordmark.tsx` | `little<span>fox</span>money`，props `size?: number = 18`、`color?: string`、`accent?: string`、`className?: string`。Tailwind 化 |
| `Logo` | `components/layout/logo.tsx` | Compose mark + wordmark + 可選 Subtitle。Props `variant?: 'horizontal' \| 'vertical' \| 'mark-only' \| 'wordmark-only' = 'horizontal'`、`tone?: Tone = 'light'`、`markSize?: number = 32`、`textSize?: number = round(markSize × 0.6)`、`showSubtitle?: boolean = false`、`className?: string`。內含 `Subtitle` private 子元件 |
| `ArticleTOC` | `components/article/article-toc.tsx` | Client component。MDX h2/h3 經 rehype-slug 加 id、由 server 用 table-of-contents extractor（如 `rehype-extract-toc` 或 MDX AST 自行 walk，由 plan 決定具體 package）parse 後 prop drill 給 client；IntersectionObserver 高亮 active heading（active 樣式 = emerald-600 文字 + emerald-600 left 2px border） |
| `ArticleSidebarCta` | `components/article/article-sidebar-cta.tsx` | Server component。讀 frontmatter optional `primaryExchange?: ExchangeKey`；有填顯示對應 ExchangeCard 簡化版（emerald-50 底）+ 「開戶 →」`AffiliateLink`；沒填回 `null`（D10） |

### 6.2 重新樣式（不改 props/API）

| 元件 | 主要變動 |
|---|---|
| `Header` | 用 `<Logo variant="horizontal" markSize={32} textSize={18} tone={tone} />`；nav 字級 13；底線 `border-zinc-100 dark:border-zinc-900` |
| `Footer` | 用 `<Logo showSubtitle tone={tone} />`；連結 disclosure / privacy / about；text-muted 字級 |
| `Hero` (homepage) | 加 eyebrow 讀 `siteConfig.tagline`（emerald uppercase 0.18em）；h1 套 type scale 4.3；sub 限 `max-w-[480px]` |
| `ExchangeCard` | 加 emerald dot indicator；hover lift + `shadow-brand-hover`；radius 8 |
| `ArticleCard` | 加 published date + read time；hover underline + emerald accent |
| `ArticleHeader` | h1 改 serif；meta 用 dot separator（`📅 2026-05-15 · ✍️ HuJ · 7 分鐘`）。Article main column 在 [`app/[slug]/page.tsx`](../../../app/[slug]/page.tsx) 的 MDX body wrapper 加 `prose-article` class（§8 `@layer base` 已綁 serif font） |
| `Breadcrumb` | 字級 13；分隔符 `›`；emerald hover |
| `DisclosureBanner` | amber → emerald-50 底 + emerald-600 left 3px（D8） |
| `DisclosureInline` | 字級保持小，emerald 文字色 |
| `CtaInline` | emerald-50 底 + emerald-600 left 3px；CTA button emerald-600 hover-700（D9） |
| `CtaSummary` | 步驟標號改 emerald-600 圓底白字 |
| `CtaComparison` | header 行 emerald-50 底；right-align 數字 |
| `Faq` | dt 加 emerald 3px 左邊；dd serif body |
| `RelatedArticles` | 桌面從 article main 移除，內容搬進 sidebar；mobile 保留 inline |

### 6.3 不動

`JsonLd`、`ScrollTracker`、`Ga4Script`、`ThemeProvider`、`AffiliateLink`（行為層元件，className 由外部傳）。`ThemeToggle` 僅字級微調。

## 7. siteConfig + identity 更新

[`lib/config/site.ts`](../../../lib/config/site.ts) 改成：

```ts
export const siteConfig = {
  name: "小狐理財 littlefoxmoney",
  shortName: "littlefoxmoney",
  description: "台灣加密貨幣新手指南：MAX、幣安、派網一站搞懂。",
  tagline: "台灣加密貨幣新手指南",  // 新增（D12）— hero / OG eyebrow source
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://littlefoxmoney.com",
  locale: "zh-TW",
  author: {
    name: "（你的暱稱）",  // 暫留 placeholder，列為 follow-up
    bio: "台灣加密貨幣中度玩家。實際用過 MAX、幣安、派網；這個站是我的學習筆記。",
  },
} as const;
```

連帶影響：
- `metadata.title.template` 自動更新為 `%s | littlefoxmoney`
- JSON-LD `Organization.name` / `WebSite.name` 自動更新
- Header / Footer 顯示的 brand text 透過 `<Logo />` 不直接讀 shortName（避免大小寫 / 樣式問題）
- OG image alt text 從硬寫的 `Coinkit` 字串改為讀 `siteConfig.shortName` 或 `littlefoxmoney`
- `siteConfig.tagline` 被 `Hero` 元件、`app/opengraph-image.tsx`、`app/[slug]/opengraph-image.tsx` 共用

`author.name` 暫留 placeholder：列入本 spec 的 follow-up todo，待實際暱稱確定後一次更新（影響 `ArticleHeader` meta、JSON-LD `author.name`、Footer copyright）。

## 8. Tailwind 4 / globals.css / next/font

專案是 Tailwind 4 + CSS-first 設定（package.json 確認 `tailwindcss: "^4"` + `@tailwindcss/postcss: "^4"`）。**不**新增 `tailwind.config.ts`。所有設定走 [`app/globals.css`](../../../app/globals.css) 的 `@theme inline` 區塊（D11）：

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
@source "../content/**/*.{md,mdx}";

@theme inline {
  --font-sans: var(--font-inter), var(--font-noto-sans-tc), system-ui, sans-serif;
  --font-serif: var(--font-source-serif), var(--font-noto-serif-tc), Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --color-brand: #059669;        /* emerald-600 */
  --color-brand-deep: #047857;   /* emerald-700 */
  --color-brand-soft: #ECFDF5;   /* emerald-50 */
  --color-ink: #18181B;          /* zinc-900 */
  --color-ink-muted: #71717A;    /* zinc-500 */

  --shadow-brand-hover: 0 8px 24px rgba(5,150,105,0.08);
  --shadow-mark: 0 12px 28px -8px rgba(5,150,105,0.4);
}

@layer base {
  body { font-family: var(--font-sans); }
  .prose-article { font-family: var(--font-serif); }
}
```

`inline` 關鍵字必要：避免 Tailwind 預先 resolve `var(--font-inter)` 為空字串，導致 `next/font` 載入的字型失效。

[`app/layout.tsx`](../../../app/layout.tsx) 加入 4 個 `next/font/google` 載入並把 CSS variable 串到 `<html>` 上：

```tsx
import { Inter, Noto_Sans_TC, Source_Serif_4, Noto_Serif_TC } from "next/font/google";

const inter        = Inter        ({ subsets: ['latin'], weight: ['400','600','700','800'], variable: '--font-inter',         display: 'swap' });
const notoSansTC   = Noto_Sans_TC ({ subsets: ['latin'], weight: ['400','500','700'],       variable: '--font-noto-sans-tc',  display: 'swap' });
const sourceSerif  = Source_Serif_4({ subsets: ['latin'], weight: ['400','600','700'],      variable: '--font-source-serif', display: 'swap' });
const notoSerifTC  = Noto_Serif_TC({ subsets: ['latin'], weight: ['400','700'],             variable: '--font-noto-serif-tc', display: 'swap' });

// in JSX:
// <html ... className={`${inter.variable} ${notoSansTC.variable} ${sourceSerif.variable} ${notoSerifTC.variable}`}>
```

`<body>` className 從 `bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased` 改為 `bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased font-sans`（`dark:text-zinc-50` 對齊 §9 矩陣）。

## 9. Dark mode 雙色階矩陣

每個元件實作時要同時驗證兩個模式。所有顏色寫法走 token / `dark:` variant，不寫 hard-coded 顏色。

| 元素 | Light | Dark |
|---|---|---|
| Page bg | white | zinc-950 |
| Surface (card / aside) | zinc-50 | zinc-900 |
| Text primary | zinc-900 | zinc-50 |
| Text muted | zinc-500 | zinc-400 |
| Border | zinc-200 | zinc-800 |
| Brand accent | emerald-600 | emerald-400 |
| Brand hover | emerald-700 | emerald-500 |
| Brand soft (CTA bg) | emerald-50 | emerald-900 |
| Logo mark bg | emerald-600 | emerald-400 |
| Logo mark fg (FX) | white | emerald-900 |
| Wordmark `little`/`money` | zinc-900 | zinc-50 |
| Wordmark `fox` accent | emerald-600 | emerald-400 |
| Subtitle 小狐理財 | zinc-500 | zinc-50 @ 65% (rgba) |
| Focus ring | emerald-600 | emerald-400 |
| Disclosure left bar | emerald-600 | emerald-400 |

`Header` / `Footer` 用 `<Logo tone={tone} />`，`tone` 由 `useTheme()` resolved 推導。SSR 第一次 render 一律 `tone="light"`（D13），mount 後 `useTheme()` resolved theme 再 swap，與既有 `ThemeToggle` 模式一致。代價：dark 模式下 Logo 第一次 paint 為 light 顏色，會閃一下變 dark。`<html suppressHydrationWarning>` 已存在 layout.tsx，不需新增。

## 10. Out of scope（明確排除）

- 不改 article frontmatter schema **核心欄位**（僅追加 optional `primaryExchange?: ExchangeKey`，既有文章不需改即可通過 zod schema）
- 不改 affiliate redirect 行為（[`app/go/[exchange]/route.ts`](../../../app/go/[exchange]/route.ts)）
- 不改 GA4 event 名稱／payload
- 不改 sitemap／robots 結構
- 不新增頁面（無 search／filter／RSS）
- 不引入 animation library（純 CSS transition）
- 不引入新色相 — 僅用 Tailwind 內建 zinc + emerald
- 不做 mobile drawer 之類複雜 navigation
- 不實作替代 mark（₣ / F× / $F）— 文件化但留給未來（D15）
- 不做 mascot 插畫（v1 brand = FX mark only）
- `mono` tone 保留 prop 但不在任何頁面使用（D14）

## 11. Design decisions

| # | 決策 | 替代方案 |
|---|---|---|
| D1 | 首頁維持單欄 | 首頁加 sidebar |
| D2 | Logo mark = `FX` in emerald circle（取代既有 placeholder C monogram） | SVG 設計 |
| D3 | Hero h1 desktop = `clamp(48px, 5vw, 60px)` | 鎖定 48 或 60 |
| D4 | 文章頁 sidebar = 220px desktop 固定 | 200 / 240 |
| D5 | Mobile sidebar 堆 main 下方，TOC 用 `<details>` 收合 | drawer / 完全隱藏 |
| D6 | TOC 從 MDX heading 自動產生（rehype-slug + rehype-extract-toc） | frontmatter 手列 |
| D7 | Article body 用 Source Serif 4 web font | 系統 Georgia |
| D8 | DisclosureBanner 從 amber 改 emerald | 保留 amber 警示性 |
| D9 | CTA accent 全改 emerald | 保 zinc 沉穩 |
| D10 | Sidebar CTA 來源 = frontmatter `primaryExchange?: ExchangeKey` optional | 解析 MDX AST 自動抓 |
| D11 | Tailwind 4 `@theme inline`（不寫 `tailwind.config.ts`） | 倒退用 v3 寫法（會失效） |
| D12 | siteConfig 加 `tagline` 欄位作為 Hero／OG eyebrow 唯一 source | 元件硬寫文字 |
| D13 | Logo `tone` SSR 一律 `light`，mount 後依 `useTheme` swap | 完全用 hard-coded 顏色 |
| D14 | `mono` tone 保留 prop 但不在任何頁面使用 | 完全移除 prop |
| D15 | 替代 mark glyphs (₣ / F× / $F) 文件化但不實作 | 各做一個 component |

## 12. 驗收

- `tsc --noEmit` 0 errors
- `next lint` 0 warnings
- `vitest` 25/25 既有 unit test 不破（可加 1–2 個 LogoMark / Wordmark snapshot test）
- `playwright test` 9/9 既有 E2E 不破（可加 1 個 TOC visibility / dark mode toggle test）
- `next build` 通過
- Lighthouse local：首頁 + 文章頁 mobile Performance > 85（web font load 是 LCP 主要 risk）
- 手動 dark mode 切換每個頁面驗 contrast（每個元件實作完成 PR 時兩個模式各 screenshot）
- OG image 用 [opengraph.xyz](https://www.opengraph.xyz/) 預覽 1200×630 渲染正確
- favicon 在 Chrome / Safari / iOS home screen 顯示正確

## 13. 實作順序預估

`writing-plans` skill 接手寫詳細 plan。預估 8 個 phase（task 粒度由 plan 決定）：

1. **Foundation**：`next/font` 載入 + globals.css `@theme inline` + `LogoMark` + `Wordmark` + `Logo` + `Subtitle` + 單元測試
2. **Identity**：siteConfig 更新 + `app/icon.tsx` + `app/apple-icon.tsx` + `app/opengraph-image.tsx` + `app/[slug]/opengraph-image.tsx` 重做
3. **Layout shell**：`Header` + `Footer` 套 `<Logo />` + dark mode tone wiring
4. **Homepage**：`Hero` + `ExchangeCard` + `ArticleCard` 重新樣式 + tagline 串
5. **Article structure**：`ArticleHeader` + `Breadcrumb` + body prose serif + `DisclosureBanner` emerald 化
6. **Sidebar**：`ArticleTOC` + `ArticleSidebarCta` + `RelatedArticles` 搬遷 + 兩欄 grid
7. **CTA 系列**：`CtaInline` / `CtaSummary` / `CtaComparison` / `DisclosureInline` / `Faq`
8. **靜態頁 + 404 polish + 視覺回歸**：about / disclosure / privacy / not-found；Playwright 加 dark mode E2E case

## 14. Follow-up（spec 通過後追蹤）

- `siteConfig.author.name` 待實際暱稱確定，更新 `ArticleHeader` meta、JSON-LD `author.name`、Footer copyright
- 替代 mark glyphs（₣ / F× / $F）若未來探索品牌變體可實作為 `LogoMarkAlt` 元件家族
- Mascot 插畫若引入是另一個獨立專案
