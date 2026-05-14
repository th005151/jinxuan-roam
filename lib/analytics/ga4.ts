type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export interface AffiliateClickPayload {
  exchange: string;
  source_article: string;
  cta_position: "top" | "middle" | "bottom" | "inline";
  [key: string]: unknown;
}

export interface CtaViewPayload extends AffiliateClickPayload {}

export function trackAffiliateClick(payload: AffiliateClickPayload): void {
  window.gtag?.("event", "affiliate_click", payload);
}

export function trackCtaView(payload: CtaViewPayload): void {
  window.gtag?.("event", "cta_view", payload);
}

export function trackExternalLink(target_domain: string, source_article: string): void {
  window.gtag?.("event", "external_link_click", { target_domain, source_article });
}

export function trackScroll75(source_article: string): void {
  window.gtag?.("event", "scroll_75", { source_article });
}
