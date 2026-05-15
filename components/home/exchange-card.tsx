"use client";

import type { ExchangeInfo } from "@/lib/config/exchanges";
import { AffiliateLink } from "@/components/cta/affiliate-link";

export function ExchangeCard({ info }: { info: ExchangeInfo }) {
  return (
    <div className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-brand-hover dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex items-center gap-2">
        <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-brand" />
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{info.displayName}</h3>
      </div>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{info.tagline}</p>
      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-zinc-500">手續費</dt>
          <dd className="text-zinc-900 dark:text-zinc-100">{info.fee}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-500">台幣入金</dt>
          <dd className="text-zinc-900 dark:text-zinc-100">{info.twdDeposit ? "✓" : "需轉幣"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-500">新手友善度</dt>
          <dd className="text-zinc-900 dark:text-zinc-100">{"★".repeat(info.beginnerFriendly)}</dd>
        </div>
      </dl>
      <AffiliateLink
        exchange={info.key}
        sourceArticle="home"
        position="inline"
        className="mt-5 block rounded-md bg-brand px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-deep"
      >
        前往註冊 →
      </AffiliateLink>
    </div>
  );
}
