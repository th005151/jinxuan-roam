# 視覺再設計：Modern Editorial + Emerald

> **⚠️ Superseded by [2026-05-15-littlefoxmoney-redesign-design.md](2026-05-15-littlefoxmoney-redesign-design.md)** — 本 spec 的 D2 logo placeholder 與 brand 缺位由新 spec 的完整 littlefoxmoney 品牌系統取代；新 spec 同時涵蓋本文件所有 layout / token / component 變動。保留本文件僅為歷史參考。

**日期**：2026-05-14
**狀態**：Superseded
**範圍**：純視覺與 layout 重做，不動 routing、data model、analytics、SEO 結構

## 1. 動機

MVP 工程基建（Task 1~35）已完成且 E2E 全綠，但目前 UI 是 create-next-app + Tailwind 預設樣式的延伸：

- 視覺層次扁平，看不出主次資訊
- 太 generic / AI 生成感（zinc 灰階 + sans-serif system default）
- 配色 / 字體 / 間距不夠精緻
- Hero / CTA 不夠抓人

從競品（呢喃貓商學院）觀察：**two-column layout** 與 **brand identity（logo mark）**值得借鏡；但他們右側 8 個 affiliate banner 堆疊的「內容工廠感」要避免——我們 spec §7.4 三層揭露明確主張「affiliate 不影響推薦判斷」的調性。

## 2. 設計方向

**Modern Editorial + Emerald Accent + 文章頁兩欄克制 sidebar**

- 純白底、大字 sans-serif heading、文章 body 換 serif 提升閱讀
- 主重點色 `emerald-600 #059669`（連結加密綠色符號，但不 over-do）
- 文章頁採兩欄：左主內容 + 右窄 sidebar（TOC + 1 個 emerald CTA + 相關文章）
- 首頁保留單欄結構維持 hero 衝擊
- 新增簡單 logo mark：emerald 圓 + 白色 monogram "C"

## 3. Visual System

### 3.1 配色 tokens

新增 Tailwind config 中的 semantic tokens（或直接用既有 `emerald-*` palette）。

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#0a0a0a` (zinc-950) | 頁面背景 |
| `surface` | `#fafafa` (zinc-50) | `#18181b` (zinc-900) | 卡片、aside section |
| `text` | `#18181b` (zinc-900) | `#fafafa` (zinc-50) | 主文字 |
| `text-muted` | `#71717a` (zinc-500) | `#a1a1aa` (zinc-400) | 次要文字、meta |
| `border` | `#e4e4e7` (zinc-200) | `#27272a` (zinc-800) | 細邊框 |
| `accent` | `#059669` (emerald-600) | `#34d399` (emerald-400) | 主重點色（logo、CTA、link）|
| `accent-soft` | `#ecfdf5` (emerald-50) | `#064e3b` (emerald-900) | CTA inline 背景、aside CTA |

不引入新色相。所有色票均為 Tailwind 內建 — 不需自定 palette。

### 3.2 字體

| 用途 | 字體 | Fallback |
|---|---|---|
| UI / Heading | Inter + Noto Sans TC | `-apple-system, BlinkMacSystemFont, sans-serif` |
| Article body | Source Serif 4 + Noto Serif TC | `Georgia, serif` |
| Code | JetBrains Mono | `ui-monospace, monospace` |

實作：`app/layout.tsx` 用 `next/font/google` 載入 Inter、Source Serif 4、Noto Sans TC、Noto Serif TC。`weight` 取必要的子集（Inter 400/600/700/800、Source Serif 400/700、Noto Sans TC 400/600/700、Noto Serif TC 400/700）以控制 LCP。

### 3.3 Type scale

| 元素 | Mobile | Desktop | Weight | Letter-spacing |
|---|---|---|---|---|
| Hero h1 | 32px / line 1.15 | 48px / line 1.1 | 800 | -0.02em |
| Article h1 | 24px / 1.2 | 32px / 1.2 | 700 | -0.01em |
| h2 | 20px / 1.3 | 24px / 1.3 | 700 | -0.01em |
| h3 | 17px / 1.4 | 18px / 1.4 | 600 | 0 |
| Body (UI) | 14px / 1.6 | 15px / 1.6 | 400 | 0 |
| Body (article) | 16px / 1.75 | 17px / 1.75 | 400 | 0 |
| Meta / label | 12px / 1.5 | 13px / 1.5 | 600 | 0.08em uppercase |
| Caption | 11px / 1.4 | 12px / 1.4 | 400 | 0 |

### 3.4 間距 / 圓角 / 陰影

- Container 寬度：首頁 `max-w-4xl`（之前 `max-w-3xl`）；文章頁 main column `max-w-2xl` + sidebar `220px`
- 卡片 border-radius：`8px`（之前 `6px`）
- Aside section radius：`8px`
- CTA button radius：`6px`
- Shadow 用 Tailwind `shadow-sm`（hover 升為 `shadow-md`）+ subtle emerald-tinted shadow on hover: `shadow: 0 8px 24px rgba(5,150,105,0.08)`

## 4. Layout

### 4.1 首頁（單欄）

```
┌─────────────────────────────────────┐
│ Header (logo · nav · theme toggle)  │
├─────────────────────────────────────┤
│   Eyebrow (emerald, uppercase)      │
│   H1 (大字 sans, 2 行)              │
│   Sub (zinc-500, 限寬 ~480px)       │
│                                     │
│   ┌─ MAX ─┐ ┌─ 幣安 ─┐ ┌─ 派網 ─┐  │
│   └───────┘ └────────┘ └─────────┘  │
│                                     │
│   ─ 最新文章 ─                       │
│   • MAX vs 幣安                      │
│   • ... (max 5)                     │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

- Container `max-w-4xl mx-auto px-6 py-12`
- Exchange grid 3 欄（mobile 1 欄、tablet 2 欄、desktop 3 欄）
- Article list 用 `<dl>` 風格分隔線

### 4.2 文章頁（兩欄）

```
┌───────────────────────────────────────────────┐
│ Header                                        │
├───────────────────────────────────────────────┤
│ Breadcrumb                                    │
├─────────────────────────────┬─────────────────┤
│ Main column (max-w-2xl)     │ Sidebar (220px) │
│                             │ ┌─────────────┐ │
│ ArticleHeader               │ │ TOC         │ │
│ (h1 + meta)                 │ └─────────────┘ │
│                             │ ┌─────────────┐ │
│ DisclosureBanner            │ │ 本文交易所   │ │
│                             │ │ (1-2 個)    │ │
│ MDX body (serif)            │ │ + CTA       │ │
│                             │ └─────────────┘ │
│ FAQ                         │ ┌─────────────┐ │
│                             │ │ 相關閱讀     │ │
│ ScrollTracker (no UI)       │ └─────────────┘ │
└─────────────────────────────┴─────────────────┘
```

- Grid: `grid-cols-[1fr_220px] gap-10` desktop；mobile `grid-cols-1`（sidebar 堆到 main 下方）
- Sidebar `sticky top-24` desktop（隨捲動）；mobile 不 sticky
- Mobile：sidebar 完整顯示在 main 下方，但 TOC 內容改用 `<details>` 收合（避免吃掉 reading 起點空間）

### 4.3 靜態頁 / 404

維持單欄（about / disclosure / privacy / not-found 都用首頁同寬 container）。

## 5. Components inventory

### 新增

| 元件 | 路徑 | 說明 |
|---|---|---|
| `LogoMark` | `components/layout/logo-mark.tsx` | Emerald 圓 + 白 monogram "C"。CSS-only（不需 SVG asset）。傳 `size` prop。|
| `ArticleTOC` | `components/article/article-toc.tsx` | 客戶端元件。從 MDX heading 構建（用 rehype-slug + 自動 extract），用 IntersectionObserver 高亮當前段落。|
| `ArticleSidebarCta` | `components/article/article-sidebar-cta.tsx` | Server 元件。讀 frontmatter 新增的 optional 欄位 `primaryExchange?: ExchangeKey`。有填就顯示對應交易所卡 + `AffiliateLink`；沒填就 return null（區塊不渲染）。|

### 重新風格（不改 props / API）

| 元件 | 變動 |
|---|---|
| `Header` | logo 改用 `<LogoMark />` + 「Coinkit」文字；nav 字級 12 → 13；border-bottom 改 `border-zinc-100` |
| `Footer` | 排版維持，僅字級 / 顏色微調 |
| `Home page` hero | 加 eyebrow（"台灣加密貨幣新手指南" emerald uppercase）；h1 改 36/48px；sub 限寬 |
| `ExchangeCard` | 加 emerald dot indicator；hover lift + emerald-tinted shadow；border-radius 8 |
| `ArticleCard` | 加 published date + read time；hover 加 underline + emerald accent |
| `ArticleHeader` | h1 改 serif；meta 用 dot separator（`📅 2026-05-14 · ✍️ HuJ · 7 分鐘`）；emoji 視覺權重重做 |
| `Breadcrumb` | 字級提升至 13；分隔符改 `›`；hover state |
| `DisclosureBanner` | amber-50 → 改 emerald 系（更品牌一致）；border-left 3px |
| `DisclosureInline` | 字級保持小，顏色略調 |
| `CtaInline` | 背景改 `emerald-50`；border-left 3px emerald；CTA button 改 emerald-600 |
| `CtaSummary` | 步驟標號改 emerald 圓底白字 |
| `CtaComparison` | 邊框改 zinc-200；header 行改 emerald-50 底；align right 數字 |
| `Faq` | dt 加左側 3px emerald；dd serif body |
| `RelatedArticles` | 從 article main 移除 — 內容移進 sidebar；只在 mobile 保留 inline |

### 不動

| 元件 | 理由 |
|---|---|
| `JsonLd` | SEO 資料層，非 UI |
| `ScrollTracker` | 無 UI 渲染 |
| `Ga4Script` | 無 UI |
| `ThemeProvider` / `ThemeToggle` | 內部維持；只調 ThemeToggle 字級 |
| `AffiliateLink` | 行為層元件；className 由外部傳入 |

## 6. Tailwind / config 變動

- `tailwind.config` 不引入新 plugin
- `app/globals.css` 加 `@layer base`：設定 `body { font-family: ... }`、`.prose` 風格（如果用 `@tailwindcss/typography`），或自行 override 文章 prose 樣式
- `app/layout.tsx`：用 `next/font/google` 載入 4 個 font family + CSS variable

## 7. Out of scope（明確排除）

- 不改 article frontmatter schema **的核心欄位**（僅追加一個 optional `primaryExchange?: ExchangeKey` 給 sidebar CTA 用，既有文章不需改即可通過 schema 驗證）
- 不改 affiliate redirect 行為
- 不改 GA4 event 名稱 / payload
- 不改 sitemap / robots 結構
- 不新增頁面（沒有 search / filter / RSS）
- 不引入 animation library（用純 CSS transition）
- 不引入新色相 — 僅用 Tailwind 內建 zinc + emerald
- 不做 mobile drawer 之類複雜 navigation
- 不重做 OG 圖（Task 27/28 視覺保留，僅 logo mark 可加進去）

## 8. Design decisions（可在 user review 時推翻）

| # | 決策 | 替代方案 |
|---|---|---|
| D1 | 首頁維持單欄 | 首頁也加 sidebar（newsletter / about author） |
| D2 | Logo mark 用 CSS-only 圓 + monogram | SVG 設計（需要設計師時間） |
| D3 | Mobile sidebar 堆在 main 下方 + TOC 用 `<details>` 收起 | Sidebar 用 drawer / Sidebar mobile 完全隱藏 |
| D4 | TOC 從 MDX heading 自動產生 | 手動在 frontmatter 列 sections |
| D5 | 文章 body 用 Source Serif 4（需 web font） | 用系統 serif（`Georgia`）省 font load |
| D6 | DisclosureBanner 從 amber 改 emerald | 保留 amber 以視覺區隔「警示」性質 |
| D7 | CTA accent 全部從 zinc-900 改 emerald-600 | 保留 zinc 沉穩，emerald 只用在 link / dot |
| D8 | Sidebar CTA 來源用 frontmatter `primaryExchange?: ExchangeKey` optional 欄位 | 解析 MDX content 自動抓第一個 `<CtaInline exchange="...">`（實作較複雜，會跑 MDX AST parsing） |

## 9. 實作順序預估

實作會由 frontend-design skill 接手寫詳細 plan。預估順序：

1. **Foundation**：tailwind config / globals.css / next/font 載入 / LogoMark
2. **Layout 元件**：Header + Footer 重新樣式
3. **Homepage**：Hero + ExchangeCard + ArticleCard
4. **Article 結構**：ArticleHeader + Breadcrumb + body prose
5. **Sidebar**：ArticleTOC + ArticleSidebarCta + RelatedArticles 搬遷
6. **CTA 系列**：CtaInline / Summary / Comparison / DisclosureBanner / DisclosureInline / Faq
7. **靜態頁 / 404** polish
8. **Playwright 視覺回歸**：擴充 E2E 抓 screenshot baseline

## 10. 驗收

- `tsc --noEmit` 0 errors
- `next lint` 0 warnings
- `vitest` 25/25 pass（無新 unit test 需求，但既有不能破）
- `playwright test` 9/9 pass（測試重點：existing tests 不能破，可加 1-2 個 TOC visibility test）
- `next build` 通過
- Lighthouse local check（首頁 + 文章頁 mobile）：Performance > 85（web font load 會影響 LCP，這是 risk）
- 手動 dark mode 切換每個頁面驗 contrast
