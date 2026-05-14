type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export type CtaPosition = "top" | "middle" | "bottom" | "inline";

export interface AffiliateClickPayload {
  exchange: string;
  source_article: string;
  cta_position: CtaPosition;
  [key: string]: unknown;
}

export type CtaViewPayload = AffiliateClickPayload;

// transport_type: 'beacon' tells gtag.js to use sendBeacon so the event
// survives the page tear-down that follows a same-document <a> navigation.
export function trackAffiliateClick(payload: AffiliateClickPayload): void {
  window.gtag?.("event", "affiliate_click", { ...payload, transport_type: "beacon" });
}

export function trackCtaView(payload: CtaViewPayload): void {
  window.gtag?.("event", "cta_view", payload);
}

export function trackExternalLink(target_domain: string, source_article: string): void {
  window.gtag?.("event", "external_link_click", {
    target_domain,
    source_article,
    transport_type: "beacon",
  });
}

export function trackScroll75(source_article: string): void {
  window.gtag?.("event", "scroll_75", { source_article, transport_type: "beacon" });
}
