import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate 揭露聲明",
  description: "本站使用 affiliate 連結。本頁說明合作旅遊夥伴、分潤關係，以及推薦邏輯。",
};

export default function DisclosurePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Affiliate 揭露聲明</h1>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        本站文章中包含 affiliate（推薦）連結。當你透過這些連結預訂住宿或行程時，
        我可能會收到合作夥伴的少許分潤。對你而言，預訂價格不會受影響。
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">目前合作的旅遊夥伴</h2>
      <ul className="ml-6 list-disc space-y-1 text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        <li>Klook（體驗與一日遊行程）</li>
        <li>Trip.com（機票與飯店搜尋）</li>
        <li>KKday（台灣在地體驗行程）</li>
        <li>Agoda（亞洲住宿預訂）</li>
        <li>Booking.com（全球住宿預訂）</li>
        <li>Expedia（機票、飯店套裝行程）</li>
      </ul>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">推薦邏輯</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        我只推薦自己實際使用過、或經過比較研究認為值得的平台與服務。
        affiliate 分潤從未影響我的推薦判斷——若某平台分潤較高但使用體驗不好，我會誠實寫出問題。
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">免責</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        本站內容僅供旅遊參考用途，價格與政策以各平台實際頁面為準。
        預訂前請確認最新條款，本站不對預訂結果負責。
      </p>
    </article>
  );
}
