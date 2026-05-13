# 台灣加密 Affiliate 站 — MVP 設計文件

- **日期**：2026-05-14
- **作者**：HuJ
- **狀態**：Draft（待 User Review）
- **取代**：`plan.md`（原版本範圍過大，本文為副業版重新範圍化的設計）

---

## 1. 專案定位與動機

### 一句話定位
> **「給台灣新手的：從零開始買幣，然後讓機器人幫你做剩下的事」**

### 專案性質
- **副業實驗**（非全職創業）
- 每週可投入時間：**≤ 5 小時**
- 作者加密熟悉度：**中度玩家**（用過 MAX、幣安、派網；未深度操作合約 / DeFi）
- 主要目的：學習 SEO + Next.js + Affiliate 商業模式；收入為 bonus
- 目標讀者：台灣加密新手（搜尋「怎麼買 BTC」「MAX 提領」這類關鍵字的人）

### 為什麼相對於 `plan.md` 大幅縮減範圍

`plan.md` 描述的是全職創業者版本（每日 3–5 則社群 + 多平台 + 20 篇 MVP + 多種頁面類型），實際工作量 25–40 hr/週。與本專案 5 hr/週的容量差距 5–8 倍。因此本設計：

- ✂️ 砍掉所有社群媒體經營（Threads / IG / FB）
- ✂️ 砍掉多頁面類型（Tools、Newsletter、Reward 等獨立頁）
- ✂️ 砍掉 Plausible（與 GA4 重複）
- ✂️ 砍掉 Supabase（無資料庫需求）
- 🎯 聚焦在**一個垂直 cluster**：MAX → 幣安 + 派網被動策略

---

## 2. 範圍與限制

### 範圍內（MVP 必做）

1. 12 篇文章組成一個關鍵字 cluster
2. 5 種頁面類型（首頁、文章頁、About、Disclosure、Privacy）
3. 中介路由 `/go/[exchange]` 集中管理 affiliate 連結
4. GA4 事件追蹤（含 CTA 點擊、CTA 可視、外部連結）
5. JSON-LD 結構化資料：Article、BreadcrumbList、FAQPage
6. 暗色模式、響應式、SEO metadata、sitemap、robots.txt
7. 自動產生 OG 圖片
8. 三層 affiliate 揭露架構

### 範圍外（MVP 不做，未來再評估）

- ❌ 社群媒體經營
- ❌ 電子報 / Email automation
- ❌ 留言系統 / 會員系統
- ❌ 工具頁（手續費計算器、資金費率追蹤等）
- ❌ AI 內容生成（可作為輔助但不上稿）
- ❌ Discord / Telegram 社群
- ❌ 多語系（zh-TW 唯一）
- ❌ 自訂 CMS（MDX + git 即可）

### 限制與假設

- 必須使用 custom domain（不能用 `*.vercel.app`），原因見 §5.4
- 不提供任何投資建議；定位為教育性內容
- 不討論合約交易策略 / DeFi yield farming（作者沒有第一手經驗）
- E-E-A-T 立場：誠實寫「中度玩家學習筆記」，不假裝專家

---

## 3. 內容策略

### 3.1 12 篇文章 Cluster

#### 主路徑（台幣 → USDT → 幣安）— 6 篇

| # | 標題 | 主關鍵字 |
|---|---|---|
| 1 | 台灣新手怎麼買第一顆比特幣？2026 完整流程 | `台灣買比特幣` |
| 2 | MAX 交易所開戶 + KYC 完整教學 | `MAX 開戶` |
| 3 | MAX 入金教學：台幣銀行轉帳怎麼做 | `MAX 入金` |
| 4 | MAX 買 USDT 完整步驟（含手續費試算） | `MAX 買 USDT` |
| 5 | MAX 提領 USDT 到幣安：地址、鏈別、確認時間 | `MAX 提領 USDT` |
| 6 | 幣安台灣帳號設定：KYC、安全設定、第一筆現貨 | `幣安 KYC 台灣` |

#### 被動分支（派網生態）— 4 篇

| # | 標題 | 主關鍵字 |
|---|---|---|
| 7 | 派網是什麼？為什麼適合不想盯盤的新手 | `派網 介紹` |
| 8 | 派網開戶教學（含台幣入金路徑） | `派網 開戶` |
| 9 | 派網網格交易 30 分鐘上手指南 | `派網 網格` |
| 10 | 派網手續費實測：跟幣安現貨比起來划算嗎？ | `派網 手續費` |

#### 決策幫助（高 CTR 比較文）— 2 篇

| # | 標題 | 主關鍵字 |
|---|---|---|
| 11 | MAX vs 幣安：什麼情境用哪個 | `MAX vs 幣安` |
| 12 | 幣安 vs 派網：自己交易還是讓機器人做？ | `幣安 vs 派網` |

### 3.2 寫作排序策略

- **不照 1–12 順序寫**，先寫離 affiliate 連結最近的高 CTR 文章
- W1–W4：先寫比較文 + Hub 文（#11, #12, #1, #7）
- W5–W9：寫主路徑教學文（#2–#6）
- W10–W12：寫派網系列（#8–#10）

### 3.3 一年後擴展方向（不在 MVP 範圍）

- 稅務系列（台灣加密貨幣報稅）
- 安全系列（如何避免被詐騙）
- 進階交易所評測（OKX、Bybit，等作者實際使用後）

---

## 4. 網站結構

### 4.1 頁面類型

| 頁面 | URL | 必要性 |
|---|---|---|
| 首頁 | `/` | 必要 |
| 文章頁 | `/[slug]` | 必要 |
| 關於頁 | `/about` | 必要（E-E-A-T） |
| 免責聲明 | `/disclosure` | **法律必要** |
| 隱私權政策 | `/privacy` | **法律必要** |
| Affiliate 代理 | `/go/[exchange]` | API Route，非頁面 |

### 4.2 URL 結構

- **扁平結構**：`/max-binance-usdt-transfer` 而非 `/guide/max/transfer`
- **Slug 一律用英文**（CTR 較高，分享時不會亂碼）
- **不做 Tag / Category index 頁面**（12 篇文章用首頁手動策展即可）

### 4.3 首頁版型（手動策展）

```
Header（極簡）→ Hero（一句定位 + CTA）→ 3 張交易所卡片 →
新手必讀（4 篇手選）→ 完整教學（按 cluster 分組） → Footer
```

- 首頁推薦由人為策展，不靠時間排序
- 排序可隨 GA4 數據定期調整

### 4.4 文章頁版型

```
Breadcrumb → H1 標題 → 元資料（日期、閱讀時間）→ Affiliate 揭露 →
開頭 CTA → 文章內文（MDX）→ 中段 CTA（視長度）→ 文末總結 CTA →
FAQ 區塊（3–5 題）→ 相關文章（手動指定 3 篇）→ Footer 免責
```

---

## 5. 技術棧

### 5.1 保留（沿用 `plan.md`）

| 工具 | 用途 |
|---|---|
| Next.js 15（App Router） | 框架 |
| TypeScript | 型別安全 |
| TailwindCSS | 樣式 |
| shadcn/ui | UI 元件 |
| MDX | 內容格式 |
| Vercel | 部署（Hobby 方案足夠） |
| GA4 | 分析 |

### 5.2 補上（`plan.md` 漏的）

| 工具 | 用途 |
|---|---|
| gray-matter | 解析 MDX frontmatter |
| @next/mdx | MDX 編譯（採用原生整合，非 next-mdx-remote） |
| next-sitemap | 自動產生 sitemap.xml + robots.txt |
| next-themes | 暗色模式切換 |
| schema-dts | TypeScript 友善的 JSON-LD 型別 |
| Zod | 驗證 frontmatter，缺欄位直接 build 失敗 |
| @vercel/og | 動態產生 OG 圖片 |
| Noto Sans TC | 繁體中文字型 |

### 5.3 砍掉（`plan.md` 提到但不需要）

| 工具 | 理由 |
|---|---|
| Plausible Analytics | 與 GA4 重複，$9–19/月不值得 |
| Supabase | 無資料庫需求 |
| Newsletter / Email automation | 無讀者前是空轉 |

### 5.4 網域決策

- **必須使用 custom domain**（建議 `.com`）
- 不可使用 `*.vercel.app`，原因：
  1. SEO 權重分散且無法承襲，未來搬移損失大
  2. Binance / 派網 affiliate 審核多半會駁回
  3. 用戶信任度低（加密題材尤其敏感）
  4. 無法搭配 custom email
- 建議 DNS 用 Cloudflare（免費，續約價穩定）

### 5.5 預估維運成本

| 項目 | 月費 |
|---|---|
| 網域（.com） | ~ NT$ 30 / 月（攤提） |
| Vercel Hobby | $0 |
| GA4 / Search Console / AWT | $0 |
| **總計** | **約 NT$ 30 / 月** |

---

## 6. SEO 策略

### 6.1 MDX Frontmatter Schema（Zod 驗證）

```yaml
---
title: string                    # ≤ 30 字，含主關鍵字
description: string              # ≤ 70 字
slug: string                     # kebab-case 英文
publishedAt: ISO8601
updatedAt: ISO8601               # 內容更新必改
author: string
keywords: string[]               # 3–5 個
ogImage?: string                 # 預設由 @vercel/og 動態產生
canonical: string                # full URL
hasAffiliate: boolean            # 控制是否顯示揭露區塊
relatedSlugs: [string, string, string]  # 手動指定 3 篇內鏈
---
```

### 6.2 JSON-LD 結構化資料

**必做：**
- `Article`：每篇文章（含作者、發布日、更新日）
- `BreadcrumbList`：每篇文章 + 比較頁
- `FAQPage`：每篇文末固定 3–5 題

**不做：**
- ❌ `Product` / `Review`（容易觸發假評論手動處罰）
- ❌ `HowTo`（Google 已大幅降低顯示率）

### 6.3 內鏈策略（Hub-and-Spoke）

```
                    #1 台灣怎麼買 BTC （Hub）
                    ↓ 連向所有 spokes
       ┌──────────────────┬──────┬──────────────────┐
       ↓                  ↓      ↓                  ↓
   #2 MAX 開戶       #11 MAX vs 幣安  #7 派網是什麼   #12 幣安 vs 派網
       ↓                                  ↓
   #3 MAX 入金                       #8 派網開戶
       ↓                                  ↓
   #4 MAX 買 USDT                    #9 派網網格教學
       ↓                                  ↓
   #5 MAX→幣安提領                   #10 派網手續費
       ↓
   #6 幣安第一筆交易
```

- 每篇固定連 3 篇相關文（1 Hub + 1 前置 + 1 延伸）
- Anchor text 用主關鍵字，不用「點這裡」
- 透過 `relatedSlugs` frontmatter 手動指定

### 6.4 圖片 SEO 要求

| 項目 | 規範 |
|---|---|
| 檔名 | 英文 + 關鍵字，例 `max-deposit-screenshot.png` |
| alt | 描述內容 + 一個關鍵字（每張不重複） |
| 格式 | 截圖 WebP、Logo SVG |
| OG 圖 | 1200×630，`@vercel/og` 動態產 |
| 首屏圖 | `next/image` 加 `priority` |

### 6.5 Core Web Vitals 目標

| 指標 | 目標 |
|---|---|
| LCP | < 2.0s |
| INP | < 200ms |
| CLS | < 0.05 |

### 6.6 E-E-A-T 訊號（YMYL 主題重點）

**必做：**
1. About 頁實名揭露作者背景與使用經驗
2. 每篇文章開頭一句「第一手經驗」聲明
3. `updatedAt` 顯眼放置 + 過時內容實質更新
4. 每篇連向 1–2 個權威來源（CoinDesk、Binance Academy、金管會）
5. Affiliate 揭露放在文章開頭（這對信任度是加分）

**禁止：**
- ❌ 用 AI 直接生產文章上稿
- ❌ 寫沒實際做過的事
- ❌ 標題殺人黨式包裝

### 6.7 上線第 1 週 SEO Checklist

1. Google Search Console 驗證 + 提交 sitemap
2. Bing Webmaster Tools 同步
3. Ahrefs Webmaster Tools 註冊
4. robots.txt 允許爬蟲
5. Schema markup 用 Rich Results Test 驗證
6. PageSpeed Insights 行動版 > 90
7. Open Graph 用 opengraph.xyz 預覽
8. PTT digicurrency 板 / Reddit Taiwan crypto 板各發 1 篇自我介紹（注意板規）

---

## 7. CTA 與 Affiliate 流程

### 7.1 CTA 三種版型

1. **內文錨點 CTA**：說明對讀者的好處 + 老實揭露分潤
2. **文末總結 CTA**：以「下一步行動指南」呈現，內含 affiliate 連結
3. **比較表 inline CTA**：表格內每行帶註冊連結

### 7.2 Affiliate 代理路由設計

所有文章內 affiliate 連結指向 `/go/[exchange]?from=[slug]`，由 `app/go/[exchange]/route.ts` 處理：

1. 記錄 GA4 server-side event
2. 加 UTM 參數
3. 301 redirect 到實際 affiliate URL

實際 URL 存於環境變數（`AFFILIATE_MAX`、`AFFILIATE_BINANCE`、`AFFILIATE_PIONEX`）。

**好處：**
- 集中管理：改連結只改一處
- 追蹤精準：GA4 抓得到每個 CTA 的點擊源、位置、文章
- 容易 A/B：同交易所可拆兩組 code 各跑一半
- 防止過期連結：affiliate 帳號被關時可一鍵切換

### 7.3 GA4 事件規格

| 事件名 | 觸發時機 | 參數 |
|---|---|---|
| `affiliate_click` | `/go/*` 路由被打中 | exchange, source_article, cta_position |
| `cta_view` | CTA 進入視窗 50%+ | exchange, source_article, cta_position |
| `external_link_click` | 點到外部非 affiliate 連結 | target_domain, source_article |
| `scroll_75` | 捲到文章 75% | source_article |

**關鍵指標**：`affiliate_click / cta_view` = CTR per CTA

### 7.4 三層 Affiliate 揭露

- **Layer 1**：文章開頭自動注入揭露聲明
- **Layer 2**：每個 CTA 旁顯示揭露
- **Layer 3**：獨立 `/disclosure` 頁面，footer 永久連結

### 7.5 Affiliate 申請順序

| 順序 | 交易所 | 時機 |
|---|---|---|
| 1 | 派網 | 網站還在草稿即可申請 |
| 2 | MAX | 文件齊全即過 |
| 3 | 幣安 | 上線 1 個月後 + 累積 GA4 數據 |
| 4 | Bybit / OKX | 主題擴展時再申請 |

### 7.6 真實收入預期

| 月份 | 預期月流量 | 預期月收入 |
|---|---|---|
| 1–3 | 0–100 UV | NT$ 0 |
| 4–6 | 100–500 UV | NT$ 0–500 |
| 7–12 | 500–2000 UV | NT$ 500–5000 |

---

## 8. 里程碑與停損條件

### 8.1 每週節奏（5 hr/週分配）

| 時段 | 時數 | 任務 |
|---|---|---|
| 平日 1 晚 | 1.5 hr | 文章草稿 |
| 假日上半天 | 3 hr | 完稿、配圖、上稿 |
| 假日下午 | 0.5 hr | GA4 / Search Console 檢查 |

### 8.2 12 週衝刺計畫

| 週 | 文章 | 工程任務 |
|---|---|---|
| W0 | — | 買網域、Next.js 初始化、第一版首頁 |
| W1 | #11 | `/go/*` 路由、GA4 接通 |
| W2 | #12 | 文章模板、JSON-LD |
| W3 | #1 | About 頁、Disclosure 頁 |
| W4 | #7 | OG 圖自動產生 |
| W5 | #2 | Search Console 提交 |
| W6 | #3 | 申請幣安 affiliate |
| W7 | #4 | 內鏈優化第一輪 |
| W8 | #5 | PageSpeed 調優 |
| W9 | #6 | Rich Results 驗證 |
| W10 | #8 | Backlink：PTT / Reddit |
| W11 | #9 | 內容更新第一輪（W1–W3） |
| W12 | #10 | **3 個月檢核點** |

### 8.3 檢核點

#### 3 個月檢核（W12）

**繼續條件**（任一達成）：
- 月 UV ≥ 50
- Search Console impression ≥ 100
- 至少 1 篇排進 Google 前 50
- 仍想繼續寫

**停損條件**（任一達成則嚴肅評估）：
- 12 週寫出 < 8 篇
- Search Console 0 impression
- 每篇寫完都覺得是煎熬

#### 6 個月檢核

**繼續條件**：
- 月 UV ≥ 200
- 至少 1 篇排進 Google 前 20
- 累積 affiliate 點擊 ≥ 30 次
- 已有第 1 筆 affiliate 收入

#### 12 個月檢核（Go / No-Go）

**繼續做的條件**：月 UV ≥ 1000，月收入 ≥ NT$ 1000，仍持續產出。

**否則必須三選一**：
- **Pivot**：保留域名，重新定位（信用卡、券商、其他 fintech）
- **Pause**：停寫但網站維持運轉，半年後重評
- **Sunset**：寫告別文，移除 affiliate，留作品集

### 8.4 Pause 模式

允許 Pause 的情境（不是失敗，是規則）：
- 連續 2 週沒寫 → 自動 Pause
- 月 UV 連續 2 個月零成長 → Pause 1 個月觀察

Pause 期間：網站 / affiliate / GA4 持續運轉，每週看數據 5 分鐘，期滿評估恢復 / 繼續 Pause / Sunset。

### 8.5 成功的重新定義

- ✅ 真正成功：學完整個 SEO + Next.js 流程，理解 affiliate 商業模式真實樣貌，準時停損或 pivot
- ❌ 真正失敗：把專案變成壓力來源，糾結著「再寫一篇」拖 2 年

---

## 9. 開放問題（spec 階段未決，待實作前釐清）

1. **網域名稱**：用戶尚未挑定，建議在 W0 結束前確定。
2. **作者署名**：用實名 / 筆名 / 暱稱？影響 About 頁與 E-E-A-T。
3. **首頁 Hero 文案**：定位句已定但具體 CTA 文字未定。
4. **第一篇文章的具體大綱**：寫作前需要更細的 outline（writing-plans 階段處理）。
5. **派網 affiliate 註冊**：用戶帳號是否已有 affiliate 資格？需確認。

---

## 10. 來源 / 參考

- 原始 plan：`plan.md`
- Brainstorm 對話：2026-05-14 session
- 法規參考：金管會 2024 虛擬資產服務商實名登記公告（待實作時確認最新版本）
- SEO 參考：Google Helpful Content Update（2024 多波）+ Site Reputation Abuse policy

---

*本文件由 `superpowers:brainstorming` 流程產出，下一步將進入 `superpowers:writing-plans` 撰寫實作計畫。*
