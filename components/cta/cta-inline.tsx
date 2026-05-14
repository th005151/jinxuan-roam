"use client";

import { useEffect, useRef } from "react";
import { trackCtaView } from "@/lib/analytics/ga4";
import { DisclosureInline } from "@/components/affiliate/disclosure-inline";
import { exchanges, type ExchangeKey } from "@/lib/config/exchanges";

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
      className="my-6 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <p className="font-semibold">💡 {benefit}</p>
      <a
        href={`/go/${exchange}?from=${encodeURIComponent(sourceArticle)}`}
        className="mt-3 inline-block rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        前往 {info.displayName} 註冊 →
      </a>
      <DisclosureInline />
    </div>
  );
}
