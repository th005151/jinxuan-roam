"use client";

import type { PartnerInfo } from "@/lib/config/partners";
import { AffiliateLink } from "@/components/cta/affiliate-link";

export function ExchangeCard({ info }: { info: PartnerInfo }) {
  return (
    <div className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-brand-hover dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex items-center gap-2">
        <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-brand" />
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{info.displayName}</h3>
      </div>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{info.tagline}</p>
      <AffiliateLink
        partner={info.key}
        sourceArticle="home"
        position="inline"
        className="mt-5 block rounded-md bg-brand px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-deep"
      >
        前往 →
      </AffiliateLink>
    </div>
  );
}
