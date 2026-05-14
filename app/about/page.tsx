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
