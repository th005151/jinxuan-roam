"use client";

import type { ReactNode } from "react";
import { resolveAffiliateUrl } from "@/lib/affiliate/links";
import { trackAffiliateClick, type CtaPosition } from "@/lib/analytics/ga4";
import type { PartnerKey } from "@/lib/config/partners";

interface Props {
  partner: PartnerKey;
  /** Optional direct URL override (e.g. from Notion partnerLink field).
   *  When provided, used verbatim instead of env-var-based affiliate URL. */
  href?: string;
  sourceArticle: string;
  position: CtaPosition;
  className?: string;
  children: ReactNode;
}

export function AffiliateLink({ partner, href, sourceArticle, position, className, children }: Props) {
  const resolvedHref = href ?? resolveAffiliateUrl(partner, sourceArticle);
  if (!resolvedHref) return null;

  return (
    <a
      href={resolvedHref}
      rel="sponsored nofollow noopener"
      target="_blank"
      className={className}
      onClick={() => {
        trackAffiliateClick({ partner, source_article: sourceArticle, cta_position: position });
      }}
    >
      {children}
    </a>
  );
}
