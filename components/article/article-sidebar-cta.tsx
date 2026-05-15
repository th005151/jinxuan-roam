import { exchanges, type ExchangeKey } from "@/lib/config/exchanges";
import { AffiliateLink } from "@/components/cta/affiliate-link";

interface Props {
  primaryExchange: ExchangeKey | undefined;
  sourceArticle: string;
}

export function ArticleSidebarCta({ primaryExchange, sourceArticle }: Props) {
  if (!primaryExchange) return null;
  const info = exchanges[primaryExchange];

  return (
    <section className="rounded-lg bg-brand-soft p-4 dark:bg-emerald-900/40">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        本文交易所
      </p>
      <p className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-50">{info.displayName}</p>
      <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">{info.tagline}</p>
      <AffiliateLink
        exchange={primaryExchange}
        sourceArticle={sourceArticle}
        position="inline"
        className="mt-3 block rounded-md bg-brand px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-brand-deep"
      >
        開戶 →
      </AffiliateLink>
    </section>
  );
}
