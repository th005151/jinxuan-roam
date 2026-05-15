import { exchanges, type ExchangeKey } from "@/lib/config/exchanges";
import { AffiliateLink } from "./affiliate-link";

interface Row {
  exchange: ExchangeKey;
}

interface Props {
  rows: Row[];
  sourceArticle: string;
}

export function CtaComparison({ rows, sourceArticle }: Props) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-brand-soft text-zinc-700 dark:bg-emerald-900/30 dark:text-zinc-200">
            <th className="px-3 py-2 text-left font-semibold">交易所</th>
            <th className="px-3 py-2 text-right font-semibold">手續費</th>
            <th className="px-3 py-2 text-left font-semibold">台幣入金</th>
            <th className="px-3 py-2 text-right font-semibold">新手友善</th>
            <th className="px-3 py-2 text-left font-semibold">註冊</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ exchange }, idx) => {
            const info = exchanges[exchange];
            const isLast = idx === rows.length - 1;
            return (
              <tr
                key={exchange}
                className={isLast ? "" : "border-b border-zinc-200 dark:border-zinc-800"}
              >
                <td className="px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100">{info.displayName}</td>
                <td className="px-3 py-2 text-right text-zinc-700 dark:text-zinc-300">{info.fee}</td>
                <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">{info.twdDeposit ? "✓" : "需轉幣"}</td>
                <td className="px-3 py-2 text-right text-zinc-700 dark:text-zinc-300">{"★".repeat(info.beginnerFriendly)}</td>
                <td className="px-3 py-2">
                  <AffiliateLink
                    exchange={exchange}
                    sourceArticle={sourceArticle}
                    position="inline"
                    className="text-brand underline decoration-2 underline-offset-2 transition hover:text-brand-deep"
                  >
                    註冊
                  </AffiliateLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
