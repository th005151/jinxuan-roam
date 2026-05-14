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
