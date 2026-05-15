import type { Metadata } from "next";

const POLICY_UPDATED_AT = "2026-05-15";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "本站如何處理你的個人資料、cookie 與分析資料。",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">隱私權政策</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">最後更新：{POLICY_UPDATED_AT}</p>

      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">資料蒐集</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">本站使用 Google Analytics 4 蒐集匿名統計資料，包含：</p>
      <ul className="mt-2 ml-6 list-disc space-y-1 text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        <li>頁面瀏覽記錄</li>
        <li>大致地理位置（國家層級）</li>
        <li>瀏覽器與裝置類型</li>
        <li>停留時間與互動行為（如點擊事件）</li>
      </ul>
      <p className="mt-3 text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">本站不會蒐集姓名、Email、電話等個人識別資料。</p>

      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Cookie 使用</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        本站使用 cookie 來：(1) 記錄你的主題偏好（明亮 / 暗色），
        (2) 透過 Google Analytics 進行匿名統計。
        你可以在瀏覽器設定中拒絕或清除 cookie。
      </p>

      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">第三方服務</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">本站使用以下第三方服務，這些服務可能會蒐集你的資料：</p>
      <ul className="mt-2 ml-6 list-disc space-y-1 text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        <li>Google Analytics（網站分析）</li>
        <li>Vercel（網站託管）</li>
        <li>各交易所 affiliate 連結（點擊後轉址到該交易所，受其隱私政策規範）</li>
      </ul>

      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">聯絡</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">如有隱私相關疑問，請透過 Email 聯絡（待補）。</p>
    </article>
  );
}
