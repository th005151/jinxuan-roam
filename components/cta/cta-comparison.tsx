import { exchanges, type ExchangeKey } from "@/lib/config/exchanges";

interface Row {
  exchange: ExchangeKey;
}

interface Props {
  rows: Row[];
  sourceArticle: string;
}

export function CtaComparison({ rows, sourceArticle }: Props) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-300 dark:border-zinc-700">
            <th className="py-2 text-left">交易所</th>
            <th className="py-2 text-left">手續費</th>
            <th className="py-2 text-left">台幣入金</th>
            <th className="py-2 text-left">新手友善</th>
            <th className="py-2 text-left">註冊</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ exchange }) => {
            const info = exchanges[exchange];
            return (
              <tr key={exchange} className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="py-2 font-semibold">{info.displayName}</td>
                <td className="py-2">{info.fee}</td>
                <td className="py-2">{info.twdDeposit ? "✓" : "需轉幣"}</td>
                <td className="py-2">{"★".repeat(info.beginnerFriendly)}</td>
                <td className="py-2">
                  <a
                    href={`/go/${exchange}?from=${sourceArticle}`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    註冊
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
