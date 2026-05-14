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
