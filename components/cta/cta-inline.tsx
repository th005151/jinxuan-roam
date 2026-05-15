"use client";

import { useEffect, useRef } from "react";
import { trackCtaView } from "@/lib/analytics/ga4";
import { DisclosureInline } from "@/components/affiliate/disclosure-inline";
import { exchanges, type ExchangeKey } from "@/lib/config/exchanges";
import { AffiliateLink } from "./affiliate-link";

interface Props {
  exchange: ExchangeKey;
  benefit: string;
  sourceArticle: string;
  position: "top" | "middle" | "bottom";
}

export function CtaInline({ exchange, benefit, sourceArticle, position }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);
  const info = exchanges[exchange];

  useEffect(() => {
    const node = ref.current;
    if (!node || firedRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.5 && !firedRef.current) {
            firedRef.current = true;
            trackCtaView({ exchange, source_article: sourceArticle, cta_position: position });
            observer.disconnect();
          }
        }
      },
      { threshold: [0.5] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [exchange, sourceArticle, position]);

  return (
    <div
      ref={ref}
      className="my-6 rounded-md border-l-[3px] border-brand bg-brand-soft p-4 dark:bg-emerald-900/40"
    >
      <p className="font-semibold text-zinc-900 dark:text-zinc-50">💡 {benefit}</p>
      <AffiliateLink
        exchange={exchange}
        sourceArticle={sourceArticle}
        position={position}
        className="mt-3 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-deep"
      >
        前往 {info.displayName} 註冊 →
      </AffiliateLink>
      <DisclosureInline />
    </div>
  );
}
