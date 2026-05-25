import { partners, type PartnerKey } from "@/lib/config/partners";
import { AffiliateLink } from "./affiliate-link";

interface Row {
  partner: PartnerKey;
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
            <th className="px-3 py-2 text-left font-semibold">合作夥伴</th>
            <th className="px-3 py-2 text-left font-semibold">特色</th>
            <th className="px-3 py-2 text-left font-semibold">前往</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ partner }, idx) => {
            const info = partners[partner];
            const isLast = idx === rows.length - 1;
            return (
              <tr
                key={partner}
                className={isLast ? "" : "border-b border-zinc-200 dark:border-zinc-800"}
              >
                <td className="px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100">{info.displayName}</td>
                <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">{info.tagline}</td>
                <td className="px-3 py-2">
                  <AffiliateLink
                    partner={partner}
                    sourceArticle={sourceArticle}
                    position="inline"
                    className="text-brand underline decoration-2 underline-offset-2 transition hover:text-brand-deep"
                  >
                    前往
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
