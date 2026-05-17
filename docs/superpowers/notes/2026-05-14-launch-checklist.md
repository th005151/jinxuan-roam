# 上線 Checklist（soft launch 策略）

> 對應 spec §6.7。最後更新 2026-05-17。
>
> **策略**：先部署 Vercel 跑 infra（domain age 開始累積、修 production-only bug），但**內容 <4 篇前不送 Google Search Console / 不做外部推廣**。等首批 cornerstone（#11 已完成、#12 / #1 / #7 補上後 = 4 篇）齊全再開始 SEO 推廣。

---

## Stage 1 — 部署到 Vercel（infra soft launch，不依賴內容）

### 1.1 部署前最後確認

- [ ] `.env.local` 真實值就緒（**不會帶到 Vercel**，僅本地用；Vercel 環境變數另設）
  - [ ] `AFFILIATE_MAX` — 真實 referral code（從 MAX 後台拿）
  - [ ] `AFFILIATE_BINANCE` — 真實 referral code（先用個人邀請連結即可，1 個月後再申請 affiliate）
  - [ ] `AFFILIATE_PIONEX` — 真實 referral code（派網最易申請，可現在就送）
  - [ ] `NEXT_PUBLIC_GA4_ID` — 真實 G-XXXXXXXXXX
- [ ] `lib/config/site.ts` 最終文案
  - [ ] `author.name` 替換 placeholder「（你的暱稱）」
  - [ ] `author.bio` 確認最終版本
  - [ ] `url` 預設 fallback `"https://littlefoxmoney.com"` 是否仍為計畫網域
- [ ] `npm test` / `npx tsc --noEmit` / `npm run lint` / `npm run build` 全綠（2026-05-17 已驗證 57/57 + 0 errors + 0 warnings + build success）

### 1.2 Vercel 專案建立

- [ ] GitHub repo 推上（若還沒有遠端）：`git remote add origin git@github.com:<user>/littlefoxmoney.git && git push -u origin master`
- [ ] Vercel Dashboard → **Add New** → **Project** → import GitHub repo
- [ ] **Framework Preset**：Next.js（自動偵測）
- [ ] **Build Command**：`npm run build`（含 `next-sitemap` postbuild，會自動產生 sitemap）
- [ ] **Output Directory**：`.next`（預設）
- [ ] **Install Command**：`npm install`
- [ ] **Node.js Version**：22.x（與本地一致；Vercel 預設）

### 1.3 Vercel 環境變數

> Settings → Environment Variables。**Production / Preview / Development 三個環境都要設**（或先設 Production，Preview 之後補）。

| 變數 | 值（範例） | 環境 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://littlefoxmoney.com`（部署後改成你的真實 domain；尚未指自訂網域前先用 `https://<project>.vercel.app`） | Production |
| `NEXT_PUBLIC_GA4_ID` | `G-XXXXXXXXXX`（真實 ID） | Production |
| `AFFILIATE_MAX` | `https://max.maicoin.com/signup?r=<code>` | Production |
| `AFFILIATE_BINANCE` | `https://accounts.binance.com/register?ref=<code>` | Production |
| `AFFILIATE_PIONEX` | `https://www.pionex.com/signUp?r=<code>` | Production |

> **重要**：`NEXT_PUBLIC_SITE_URL` 控制 sitemap（next-sitemap.config.js）、metadataBase、JSON-LD 的 absolute URL。本地 build 看到 sitemap 用 `localhost:3000` 是正常的——Vercel build 會用 env var。

### 1.4 自訂網域（如已購買）

- [ ] Vercel → Domains → Add `littlefoxmoney.com`
- [ ] 在 domain registrar（GoDaddy / Cloudflare / Namecheap 等）改 DNS：
  - A record `@` → `76.76.21.21`（Vercel apex）
  - CNAME `www` → `cname.vercel-dns.com`
- [ ] 等 propagation（10 分鐘 ~ 24 小時）
- [ ] Vercel 自動發 Let's Encrypt 憑證，HTTPS 啟用
- [ ] 設定 redirect `www` → apex（Vercel UI 可選）
- [ ] 部署後**更新 `NEXT_PUBLIC_SITE_URL`** 並重新 deploy 讓 sitemap / metadata 用正確網域

### 1.5 部署後 smoke test（不依賴 GSC）

- [ ] 首頁 `https://<domain>/` 能開、看到 hero + 文章卡 + dark mode toggle 能切
- [ ] 文章頁 `/max-vs-binance` MDX 正常渲染、TOC 在側邊欄
- [ ] `/about` `/faq` `/disclosure` `/privacy` 都能開
- [ ] `/go/max` redirect 到真實 MAX URL（檢查瀏覽器 redirect 後的網址列）
- [ ] `https://<domain>/sitemap.xml` 顯示正確的 production URL（不再是 localhost）
- [ ] `https://<domain>/robots.txt` 顯示且 `disallow: /go/`
- [ ] `https://<domain>/icon` 與 `https://<domain>/apple-icon` 回 200
- [ ] favicon Chrome / Safari / iOS 顯示
- [ ] 開 DevTools Network 確認 GA4 `gtag.js` 載入且 `pageview` event 有送

---

## Stage 2 — 等首批 cornerstone（≥4 篇）再做

> **暫緩理由**：內容 <4 篇時送 GSC 可能讓 Google 把 domain 標 thin site，crawl budget 給得少。先把 #12 / #1 / #7 補齊後再啟動 SEO 推廣。

### 2.1 內容齊全（4 篇 cornerstone）

- [x] #11 MAX vs 幣安（已完成）
- [ ] #12 幣安 vs 派網
- [ ] #1 台灣新手怎麼買第一顆比特幣（hub 文）
- [ ] #7 派網是什麼

### 2.2 SEO 平台註冊與提交

- [ ] [Google Search Console](https://search.google.com/search-console) 驗證網域所有權（建議 DNS TXT 而非 HTML file，可一次驗整個 domain）
- [ ] 在 GSC 提交 `https://<domain>/sitemap.xml`
- [ ] 在 GSC 對首頁 + 4 篇文章手動「要求建立索引」
- [ ] [Bing Webmaster Tools](https://www.bing.com/webmasters) 從 GSC 匯入
- [ ] [Ahrefs Webmaster Tools](https://ahrefs.com/webmaster-tools) 註冊並驗證

### 2.3 結構化資料驗證

- [ ] [Rich Results Test](https://search.google.com/test/rich-results) 跑首頁、`/max-vs-binance`、`/disclosure`
- [ ] 確認 `Article` / `BreadcrumbList` / `FAQPage` 全部被識別、無 error
- [ ] [Schema Validator](https://validator.schema.org/) 對同樣頁面跑一次（補充第二意見）

### 2.4 效能與 OG 驗證

- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) 跑首頁 + 1 篇文章 mobile
  - 目標：LCP < 2.0s / INP < 200ms / CLS < 0.05 / 行動版分數 > 90
  - web font 是主要 LCP risk（`display: swap` 已套）
- [ ] [opengraph.xyz](https://www.opengraph.xyz/) 預覽首頁與文章頁 OG，確認 1200×630 正確

### 2.5 Affiliate 與外部推廣

- [ ] **派網**：申請 affiliate（最易過，網站只要有 1 篇相關文章即可）
- [ ] **MAX**：申請 affiliate
- [ ] **幣安**：等 1 個月 GA4 數據 + ≥6 篇文章再申請
- [ ] PTT digicurrency 板自我介紹文 1 篇（注意板規，含網站連結）
- [ ] Reddit r/Taiwanese 1 篇英文版（可選）

---

## Open follow-ups（不擋上線，但記著）

詳見 [`2026-05-15-redesign-followup.md`](./2026-05-15-redesign-followup.md)：

- `siteConfig.author.name` 暱稱 placeholder
- read time field 還沒做
- 替代 logo glyphs / mascot 沒實作
- MDX 文章內 `# 標題` 與 ArticleHeader 重複顯示
