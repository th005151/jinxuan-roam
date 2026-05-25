import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "關於本站",
  description: `${siteConfig.author.bio} 這個頁面寫了我是誰、為什麼寫這個站。`,
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">關於 {siteConfig.name}</h1>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">我是誰</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        我是{siteConfig.author.name}。{siteConfig.author.bio}
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">為什麼叫「金萱」</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        金萱是台灣特有的茶種，帶著淡淡奶香、不苦不澀，適合慢慢品。
        旅行對我來說也是這樣——不趕景點、不拍打卡照，只想用一片茶葉的好奇心，
        記錄走過的城市、住過的店、吃過的味道。
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">這裡寫什麼</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        私房路線、住宿選擇筆記、交通攻略、還有旅程裡那些沒寫進行程表的小發現。
        不寫流水帳，只記真正值得留下來的事。
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Affiliate 連結說明</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        本站部分連結為 affiliate（推薦）連結，你透過連結預訂時我可能會收到少許分潤，
        但對你的價格沒有影響。詳見{" "}
        <a href="/disclosure" className="text-brand underline decoration-2 underline-offset-2 transition hover:text-brand-deep">
          揭露聲明
        </a>。
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">如何聯絡</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        有任何建議或合作洽詢，歡迎透過 Email 聯絡（待補）。
      </p>
    </article>
  );
}
