export const PARTNER_KEYS = [
  "klook",
  "trip",
  "kkday",
  "agoda",
  "booking",
  "expedia",
] as const;

export type PartnerKey = (typeof PARTNER_KEYS)[number];

export interface PartnerInfo {
  key: PartnerKey;
  displayName: string;
  tagline: string;
  /** Brand homepage; used only for human-readable label / fallback. */
  homepage: string;
  /** Default CTA label shown on partner cards. */
  ctaLabel: string;
}

export const partners: Record<PartnerKey, PartnerInfo> = {
  klook: {
    key: "klook",
    displayName: "Klook 客路",
    tagline: "亞洲行程、票券一站搞定",
    homepage: "https://www.klook.com/",
    ctaLabel: "去 Klook 找行程",
  },
  trip: {
    key: "trip",
    displayName: "Trip.com",
    tagline: "全球機票飯店比價",
    homepage: "https://www.trip.com/",
    ctaLabel: "去 Trip.com 比價",
  },
  kkday: {
    key: "kkday",
    displayName: "KKday",
    tagline: "在地體驗 + 票券",
    homepage: "https://www.kkday.com/",
    ctaLabel: "去 KKday 看行程",
  },
  agoda: {
    key: "agoda",
    displayName: "Agoda",
    tagline: "亞洲飯店首選",
    homepage: "https://www.agoda.com/",
    ctaLabel: "去 Agoda 找飯店",
  },
  booking: {
    key: "booking",
    displayName: "Booking.com",
    tagline: "全球住宿選擇最多",
    homepage: "https://www.booking.com/",
    ctaLabel: "去 Booking 找住宿",
  },
  expedia: {
    key: "expedia",
    displayName: "Expedia",
    tagline: "機 + 酒套裝省更多",
    homepage: "https://www.expedia.com/",
    ctaLabel: "去 Expedia 看套裝",
  },
};

export function isPartnerKey(value: string): value is PartnerKey {
  return (PARTNER_KEYS as readonly string[]).includes(value);
}
