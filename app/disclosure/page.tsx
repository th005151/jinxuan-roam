import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate 揭露聲明",
  description: "本站使用 affiliate 連結。本頁說明合作交易所、分潤關係，以及推薦邏輯。",
};

export default function DisclosurePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 prose prose-zinc dark:prose-invert">
      <h1>Affiliate 揭露聲明</h1>
      <p>
        本站文章中包含 affiliate（推薦）連結。當你透過這些連結註冊任何交易所或服務時，
        我可能會收到該平台的分潤。對你而言，註冊與使用價格不會受影響。
      </p>
      <h2>目前合作的交易所</h2>
      <ul>
        <li>MAX</li>
        <li>幣安</li>
        <li>派網</li>
      </ul>
      <h2>推薦邏輯</h2>
      <p>
        我只推薦自己實際使用過的交易所與工具。affiliate 分潤從未影響我的推薦判斷——
        若有交易所付高分潤但體驗不佳，我會誠實寫出問題。
      </p>
      <h2>免責</h2>
      <p>
        本站內容僅供教育與資訊用途，不構成投資建議。
        加密貨幣具高度價格波動風險，投資前請自行評估並承擔風險。
      </p>
    </article>
  );
}
