import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "關於本站",
  description: `${siteConfig.author.bio} 這個頁面寫了我是誰、為什麼寫這個站。`,
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">關於本站</h1>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">我是誰</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">{siteConfig.author.bio}</p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">為什麼寫這個站</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        台灣加密貨幣新手教學很多，但大多由交易所官方或大型內容站撰寫。我想從一個剛走過這條路的中度玩家視角，
        把實際遇到的卡關、查資料的時間、踩過的小坑記下來，讓接下來要走的人省一些時間。
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">我用過的交易所</h2>
      <ul className="ml-6 list-disc space-y-1 text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        <li>MAX（2024 開始用，台幣入金主力）</li>
        <li>幣安（2025 開始用，現貨買賣）</li>
        <li>派網（2025 開始用，網格機器人）</li>
      </ul>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">我不寫的內容</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        我沒有實際操作過合約交易、DeFi yield farming、鏈上交易策略。
        為了不誤導讀者，這些主題我會明確標示「未涵蓋」。本站不提供任何投資建議。
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">如何聯絡</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        有任何錯誤指正或建議，歡迎透過 Email 聯絡（待補）。
      </p>
    </article>
  );
}
