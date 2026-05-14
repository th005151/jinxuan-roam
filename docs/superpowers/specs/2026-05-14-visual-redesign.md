# Visual Redesign — Modern Editorial + Emerald Accent

**Status**: Design approved 2026-05-14, awaiting implementation
**Scope**: 視覺系統全面換掉，不動商業邏輯（路由、JSON-LD、analytics、CTA 行為都保留）
**Companion mockups**: `.superpowers/brainstorm/*/content/design-proposal*.html`（brainstorming session 保留，git-ignored）

---

## Vision

把站從「Tailwind 預設 + zinc 灰階」升級成有編輯感、有 brand identity、有閱讀節奏的個人專家筆記站。
參考定位：Substack / Stratechery 的編輯感現代版；借鏡呢喃貓商學院的「文章頁兩欄結構」但**砍掉他們的 sidebar 廣告堆**，保留我們「affiliate 不影響推薦判斷」的克制調性。

四個現有痛點全部要解：
1. 太 generic / AI 生成感
2. 視覺層次扁、缺重點
3. 配色 / 字體 / 間距不夠精緻
4. Hero / CTA 不夠抓人

## Non-goals

- **不動** Next.js App Router 結構、MDX pipeline、JSON-LD、GA4、affiliate 路由、Zod schema、route handler 邏輯
- **不動** 25 個 unit test 跟 9 個 Playwright E2E（如果 E2E 因 selector 變動而 break，調 E2E 配合新 markup，邏輯不變）
- **不打開** 重寫 spec §4 頁面類型；只是把這些頁面「重畫」一次
- 不引入 CSS-in-JS（保留 Tailwind 4 + global CSS）
- 不引入新的 component library（不裝 shadcn/ui / Radix 等），所有元件繼續手寫 Tailwind

## Design Tokens

### Colors

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--bg` | `#FFFFFF` | `#0a0a0a` | 主背景 |
| `--bg-elev` | `#fafafa` | `#171717` | 卡片 / sidebar section 微凸 |
| `--bg-accent-soft` | `#ecfdf5` (emerald-50) | `#022c22` (emerald-950) | CTA inline 淡底、aside-cta gradient 起點 |
| `--fg` | `#18181b` (zinc-900) | `#fafafa` (zinc-50) | 主文字 |
| `--fg-muted` | `#52525b` (zinc-600) | `#a1a1aa` (zinc-400) | 副文字、breadcrumb、meta |
| `--fg-subtle` | `#a1a1aa` (zinc-400) | `#71717a` (zinc-500) | 最弱（dates、helper text）|
| `--border` | `#e4e4e7` (zinc-200) | `#27272a` (zinc-800) | 卡片邊、divider |
| `--border-soft` | `#f4f4f5` (zinc-100) | `#1f1f23` | 微弱 divider |
| `--accent` | `#059669` (emerald-600) | `#34d399` (emerald-400) | 重點色（logo、active state、CTA bg）|
| `--accent-hover` | `#047857` (emerald-700) | `#10b981` (emerald-500) | CTA hover |
| `--amber-bg` | `#fffbeb` (amber-50) | `#451a03` (amber-950) | Layer 1 disclosure banner（保留現狀）|

### Typography

| Role | Stack | Size / weight |
|---|---|---|
| UI / Heading sans | `Inter`, `Noto Sans TC`, system-ui | 自訂 scale 見下 |
| Article body serif | `Source Serif 4`, `Noto Serif TC`, Georgia, serif | 16px / 1.75 |
| Mono | `JetBrains Mono`, ui-monospace | inline code / 數據展示 |

字體載入：Google Fonts 透過 `next/font/google`（Inter + Source Serif 4），中文 Noto 系列在 build time 子集化。**不**透過 link tag 載完整字重，只載 400/600/700/800 必要 weight。

Heading scale（sans, letter-spacing -0.02em on >24px）:
- Hero h1：`36px / 1.12 / 800` desktop, `28px` mobile
- Article h1 (ArticleHeader)：`28px / 1.2 / 700` — serif（reading 一致性）
- Article h2 (in MDX body)：`22px / 1.3 / 700` — serif，跟 body 一致
- Article h3：`18px / 1.4 / 600`
- Section label (`.label`)：`12px / uppercase / 600 / letter-spacing 0.1em / fg-muted`

Body：
- UI body：`14px / 1.5 / Inter`
- Article body：`16px / 1.75 / Source Serif 4`
- Meta / breadcrumb：`12px / 1.5 / Inter / fg-muted`

## Layout

### Container

| Page | Container | Reason |
|---|---|---|
| 首頁 | `max-w-5xl` (1024px) 居中 | Hero + exchange grid 要寬 |
| 文章頁（兩欄） | `max-w-6xl` (1152px) | grid: `minmax(0, 1fr) 220px`, gap 32px |
| 靜態頁 (about/disclosure/privacy) | `max-w-3xl` (768px) | 純文字內容，閱讀寬度為主 |
| 404 | `max-w-3xl` 居中 | 不變 |

文章頁 grid：`grid-template-columns: minmax(0, 1fr) 220px` desktop，`< 1024px` 收成單欄（sidebar 隱藏，TOC drop 到文章頂部以 `<details>` 收合）。

### Spacing

- 主內容 padding: `px-6 py-12` desktop, `px-4 py-8` mobile
- Article body section 間：`mt-8`
- Card padding: `p-6`
- 全站 sticky header height: 56px

## Component Inventory

「重畫」= markup / 樣式換掉但 props / 行為保留。「新建」= 新元件。「不動」= 完全不改。

| Component | 動作 | 重點變更 |
|---|---|---|
| Logo mark (新) | 新建 `components/brand/logo.tsx` | Emerald 圓 24px + 白 monogram "C"（Inter 800、letter-spacing -0.02em）；尺寸 prop 支援 `sm` (20px) / `md` (24px) / `lg` (40px) |
| Header | 重畫 | 加 Logo mark + Coinkit 文字；nav links 收緊間距；border-b 用 `border-soft` |
| Footer | 重畫 | 簡化版型、加 logo mark 縮小版、links 用 `fg-muted` |
| Hero (homepage) | 重畫 | Eyebrow label（emerald, uppercase）+ 大字 h1（800 weight, -0.02em）+ 副標限寬 max-w-xl |
| ExchangeCard | 重畫 | subtle border `border-zinc-200` + hover `border-emerald-600 + translateY(-2px) + shadow`；左上加 emerald 6px dot indicator |
| ArticleCard (home list) | 重畫 | 標題 16px / 600；meta 12px；hover underline accent |
| ArticleHeader | 重畫 | Breadcrumb 提升視覺權重（>icon 用 emerald）；h1 serif；meta 改 inline pipe-separated |
| Breadcrumb | 重畫 | sep 用 `›` 字符 + emerald 色；hover 加 underline；mobile 自動收 last 2 段 |
| Article body (MDX) | 調 mdx-components | MDX 內 `#` 渲染成 `<h2>` element + h2 樣式（解 follow-up 雙 h1 SEO 問題：ArticleHeader 已有 h1，內文不應再開 h1）；`##` 渲染成 `<h3>`；以此類推下推一級。prose serif body；inline `<code>` 加 emerald 微底 |
| TOC sidebar (新) | 新建 `components/article/toc.tsx` | 自動從 MDX h2/h3 產生（用 `rehype-slug` + 自訂 plugin 收集 heading）；active state 用 `IntersectionObserver`；emerald left-border 標 active |
| Article sidebar wrapper (新) | 新建 `components/article/sidebar.tsx` | sticky `top-24`；mobile hide（TOC 改 collapsed details 放文章頂） |
| Aside CTA box (新) | 新建 `components/cta/aside-cta.tsx` | sidebar 用的小型 CTA；emerald gradient bg；包 1 個 AffiliateLink |
| CtaInline | 微調 | 改 emerald-50 底 + 左 3px emerald border；保留 IntersectionObserver fire + AffiliateLink 包裹 |
| CtaSummary | 微調 | 內邊框換 border + soft radius；步驟編號用 emerald 圓 |
| CtaComparison | 微調 | Table header 加 bg-elev；hover row highlight；註冊 cell 用 AffiliateLink 維持點擊追蹤 |
| AffiliateLink | 不動 | 行為已穩定（beacon transport, encodeURIComponent, CtaPosition type）|
| RelatedArticles | 重畫 | 改 sidebar 用版型（短標題列表 + 一個 expand），同時保留原單欄版本給未來其他頁 |
| DisclosureBanner | 不動 | spec §7.4 Layer 1，色彩不換 |
| DisclosureInline | 不動 | spec §7.4 Layer 2 |
| Faq | 微調 | `<dt>` 加 emerald accent border-left（hover 才顯）；間距加大 |
| Static pages (about/disclosure/privacy) | 重畫 | prose 換 serif；標題改 sans heading；間距與 article 一致 |
| not-found.tsx | 重畫 | 大字 "404" emerald；按鈕用主 CTA 樣式 |

## Page-level Layout Changes

### 首頁 `/`
- 單欄 max-w-5xl
- Section 1: Hero — eyebrow + h1 + sub + 第一個 CTA（前往 max-vs-binance 文章）
- Section 2: 「我用過的交易所」 — 3-col exchange grid（mobile 1-col）
- Section 3: 「最新文章」 — 2-col article card grid

### 文章頁 `/[slug]`
- 兩欄 grid (main + 220px sidebar) max-w-6xl
- Main 寬 max 700px reading column
- Sidebar 3 個區塊：
  1. **本文目錄 TOC** — sticky scroll-spy
  2. **本文交易所 aside-cta** — emerald gradient box，從 frontmatter 推測（如果文章 hasAffiliate=true，從文中 AffiliateLink 抽第一個 exchange）。Phase 1 先 hardcode 在文章 MDX 內，Phase 2 才做自動萃取。
  3. **相關閱讀** — 用現有 `relatedSlugs` 改 sidebar 短列表樣式
- Mobile (<1024px)：sidebar 隱藏，TOC 收進文章頂的 `<details>`

### 靜態頁 about / disclosure / privacy
- 單欄 max-w-3xl
- 用 prose serif body
- 不要 sidebar

### 404
- 單欄居中
- 大字 emerald 404 + 文案 + 返回主 CTA 按鈕

## Dark mode

不變整體策略（next-themes class-based），但所有新 component 必須用 `dark:` variant 配 token，不允許 hard-code 顏色。CSS variables 從 `globals.css` 提供。

Dark mode 重點：
- 背景純黑 `#0a0a0a` 取代 `zinc-950`，更現代
- emerald accent 在 dark 用 `emerald-400` 增加對比
- Border 在 dark 用 `border-zinc-800`

## Implementation Strategy

### Phase 0：基礎
- 加 next/font Inter + Source Serif 4 + Noto Sans TC + Noto Serif TC 到 `app/layout.tsx`，套用 CSS variables 於 `<html>` element
- `globals.css` 用 Tailwind 4 `@theme inline` syntax 注入 color / font tokens（現有 globals.css 結構：`@import "tailwindcss"` + `@custom-variant dark (&:where(.dark, .dark *))` + `@source ...`，已 3 行。新加 `@theme inline { --color-bg: ...; --font-sans: var(--font-inter); ... }`）
- dark 主題切換沿用 next-themes class-based（`@custom-variant dark` 已配好）

### Phase 1：Brand + Layout
1. 新建 `components/brand/logo.tsx`
2. 重畫 Header / Footer
3. 重畫 ArticleHeader (含 Breadcrumb)
4. 重畫 Hero + ArticleCard + ExchangeCard

### Phase 2：兩欄文章頁
5. 新建 TOC component (auto-extract MDX headings)
6. 新建 article sidebar wrapper
7. 改 `app/[slug]/page.tsx` 加 sidebar；mobile fallback
8. 新建 AsideCta

### Phase 3：MDX 內元件
9. 改 mdx-components.tsx（h1→h2 + 內文連結 emerald + code 微底）
10. 微調 CtaInline / CtaSummary / CtaComparison / Faq

### Phase 4：靜態頁 + 404
11. 重畫 about / disclosure / privacy 樣式
12. 重畫 404

### Phase 5：驗證
13. `npm run build` 通過
14. `npm test` 25 unit pass
15. `npm run test:e2e` 9 E2E pass (調 selector 若需要)
16. 手動逐頁開瀏覽器看

## Design Decisions（不問使用者，預設這樣，review 時可推翻）

1. **Logo mark = CSS-only**（emerald circle + 白 C），不做 SVG。未來改 SVG 時 swap 一個檔即可
2. **TOC 自動產生**：用 `rehype-slug` + 自訂 rehype plugin export heading 列表，passed 進 page 然後 render TOC。**不用** 第三方 `rehype-toc` 因為要客製 styling
3. **字體用 next/font/google**，Inter + Source Serif 4。中文 Noto 系列也透過 next/font 載入但 `display: 'swap'`。**不**用 link tag 載 CSS
4. **Mobile sidebar**：sidebar 整個隱藏 (`hidden lg:block`)，TOC 改放文章頂 `<details>` collapsed by default
5. **aside-cta 內容來源**：Phase 1 由 MDX 作者顯式放 `<AsideCta exchange="max" />`（手動）；Phase 2 才做自動萃取
6. **首頁不放 sidebar**：保持 hero 衝擊力，與文章頁區分
7. **prose plugin**：仍用 `@tailwindcss/typography`（`prose prose-zinc dark:prose-invert`），但 override `--tw-prose-*` 變數對齊 design tokens

## Risks

| Risk | Mitigation |
|---|---|
| 字體載入 layout shift | next/font 自動處理 + `font-display: swap` |
| TOC 自動萃取在 SSG 時 timing | rehype plugin 在 compile time 跑，產 metadata 給 page；不依賴 client |
| MDX h1→h2 改動可能影響 SEO 認知 | Article JSON-LD `headline` 由 frontmatter title 提供，不依賴頁面 h1 結構 |
| Tailwind 4 CSS-first config 與舊 Tailwind 3 寫法不同 | 看現有 globals.css 結構，沿用既有 @theme syntax |
| E2E selector 失效 | E2E 用 role / aria-label / data-testid 而非樣式 class，重畫不會 break |

## Open Items (Phase 2+，本次先不做)

- 文章頁加閱讀進度條（top sticky bar）
- 文章頁加「複製連結」按鈕
- 首頁加 newsletter signup（如果未來決定接 Substack 等）
- Logo SVG 化（如果未來找到喜歡的 mark）
- 文章卡 hover 加細微 background tint

## Success Criteria

- 從 [http://localhost:3000](http://localhost:3000) 視覺上看得出來「不是 create-next-app + tailwind 預設」
- 文章頁兩欄結構 desktop 上 sidebar TOC 隨捲動 highlight
- 所有現有 25 unit test + 9 E2E test 仍 pass
- `tsc --noEmit` 0 errors / `next lint` 0 warnings
- `npm run build` 通過，9 routes 都還在
- Lighthouse / PSI 行動版分數不降低（spec §6.5 標準維持）
