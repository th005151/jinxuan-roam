import { EXCHANGE_KEYS, type ExchangeKey } from "@/lib/config/exchanges";

const ENV_KEY: Record<ExchangeKey, string> = {
  max: "AFFILIATE_MAX",
  binance: "AFFILIATE_BINANCE",
  pionex: "AFFILIATE_PIONEX",
};

export function isExchangeKey(value: string): value is ExchangeKey {
  return (EXCHANGE_KEYS as readonly string[]).includes(value);
}

export function resolveAffiliateUrl(
  exchange: ExchangeKey,
  campaign?: string
): string | null {
  if (!isExchangeKey(exchange)) return null;
  const base = process.env[ENV_KEY[exchange]];
  if (!base) return null;
  try {
    const url = new URL(base);
    if (campaign) {
      url.searchParams.set("utm_source", "coinkit");
      url.searchParams.set("utm_medium", "article-cta");
      url.searchParams.set("utm_campaign", campaign);
    }
    return url.toString();
  } catch {
    return null;
  }
}
