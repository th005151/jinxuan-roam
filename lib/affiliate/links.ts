import { PARTNER_KEYS, type PartnerKey } from "@/lib/config/partners";

export { isPartnerKey } from "@/lib/config/partners";
export type { PartnerKey } from "@/lib/config/partners";

const ENV_KEY: Record<PartnerKey, string> = {
  klook: "AFFILIATE_KLOOK",
  trip: "AFFILIATE_TRIP",
  kkday: "AFFILIATE_KKDAY",
  agoda: "AFFILIATE_AGODA",
  booking: "AFFILIATE_BOOKING",
  expedia: "AFFILIATE_EXPEDIA",
};

export function resolveAffiliateUrl(
  partner: string,
  campaign?: string
): string | null {
  if (!(PARTNER_KEYS as readonly string[]).includes(partner)) return null;
  const base = process.env[ENV_KEY[partner as PartnerKey]];
  if (!base) return null;
  try {
    const url = new URL(base);
    url.searchParams.set("utm_source", "jinxuan");
    url.searchParams.set("utm_medium", "article-cta");
    if (campaign) url.searchParams.set("utm_campaign", campaign);
    return url.toString();
  } catch {
    return null;
  }
}
