"use client";

import type { ReactNode } from "react";
import { trackAffiliateClick } from "@/lib/analytics/ga4";
import type { ExchangeKey } from "@/lib/config/exchanges";

interface Props {
  exchange: ExchangeKey;
  sourceArticle: string;
  position: "top" | "middle" | "bottom" | "inline";
  className?: string;
  children: ReactNode;
}

export function AffiliateLink({ exchange, sourceArticle, position, className, children }: Props) {
  const href = `/go/${exchange}?from=${encodeURIComponent(sourceArticle)}`;
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        trackAffiliateClick({ exchange, source_article: sourceArticle, cta_position: position });
      }}
    >
      {children}
    </a>
  );
}
