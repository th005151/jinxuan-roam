# littlefoxmoney redesign — follow-up

Completed 2026-05-15 via plan [`docs/superpowers/plans/2026-05-15-littlefoxmoney-redesign.md`](../plans/2026-05-15-littlefoxmoney-redesign.md).

## Acceptance summary

- ✅ `npm test`：57 / 57 unit tests pass（25 既有 + 5 LogoMark + 4 Wordmark + 6 Logo + 11 article-toc/slugify + 3 ArticleSidebarCta + 3 ArticleTOC）
- ✅ `npx tsc --noEmit`：0 errors
- ✅ `npm run lint`：0 warnings / 0 errors
- ✅ `npm run build`：成功，所有 routes（首頁、文章、4 個靜態頁、404、/go/[exchange]、icon、apple-icon、opengraph-image、[slug]/opengraph-image、sitemap）
- ✅ `npm run test:e2e`：11 / 11 passing（含 dark mode toggle + TOC visibility 兩個新測試）

## Open follow-ups（不擋上線）

- [ ] **`siteConfig.author.name`** — 仍是 placeholder「（你的暱稱）」。決定後同步更新 ArticleHeader meta、JSON-LD `author.name`、Footer copyright、per-article OG image
- [ ] **Read time** — `ArticleCard`/`ArticleHeader` 尚無讀取時間。決定：(a) 在 frontmatter schema 加 `readMinutes` 欄位（每篇手填）或 (b) 從 MDX 內容字數於 build time 計算
- [ ] **`LogoMark` / `Wordmark` 雙 export 不一致** — 兩個元件用 `export function … export default …` 雙導出，與專案其他元件（Header/Footer/Hero 等只用 named export）的慣例不符。低優先：可在某次 polish PR 統一移除 default export
- [ ] **替代 logo glyphs（₣ / F× / $F）** — 設計 handoff 已 documented，未實作。若未來品牌變體需要可實作 `LogoMarkAlt` 元件家族
- [ ] **Mascot illustration** — 獨立後續專案；v1 出貨 = FX mark only
- [ ] **Tailwind 4 typography plugin** — 若未來 `@tailwindcss/typography` v4 穩定，可考慮替代靜態頁的 explicit per-element classes

## 部署前手動驗證

- [ ] PageSpeed Insights：部署到 Vercel 後跑 [pagespeed.web.dev](https://pagespeed.web.dev/) 確認 LCP/INP/CLS 達 spec §6.5 標準（web font load 是主要 LCP risk，`display: swap` 已套）
- [ ] Google Rich Results Test：原始 `/max-vs-binance` HTML 貼到 [search.google.com/test/rich-results](https://search.google.com/test/rich-results) 確認 Article + BreadcrumbList + FAQPage 仍被 Google parser 認可
- [ ] OG 預覽：[opengraph.xyz](https://www.opengraph.xyz/) 貼上 deployed URL，確認 1200×630 渲染正確
- [ ] favicon：Chrome / Safari / iOS home screen 顯示正確（Vercel deploy 後 `/icon.png` `/apple-icon.png` 自動 link）
- [ ] dark mode 手動切換每個頁面驗 contrast（spec §9 dual palette 已涵蓋元件）
