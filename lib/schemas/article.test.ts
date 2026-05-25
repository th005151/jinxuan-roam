import { describe, expect, it } from "vitest";
import { ArticleFrontmatterSchema } from "./article";

const validBase = {
  title: "京都嵐山三日漫遊",
  description: "從竹林到嵯峨野小火車的私房路線",
  slug: "kyoto-arashiyama-3day",
  publishedAt: "2026-05-26",
  updatedAt: "2026-05-26",
  author: "金萱",
  keywords: ["京都", "嵐山", "自由行"],
  canonical: "https://jinxuan-roam.vercel.app/kyoto-arashiyama-3day",
  hasAffiliate: false,
  relatedSlugs: ["a", "b", "c"] as const,
};

describe("ArticleFrontmatterSchema", () => {
  it("accepts minimal valid travel frontmatter", () => {
    const result = ArticleFrontmatterSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("accepts optional travel fields", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validBase,
      country: "日本",
      location: "京都・嵐山",
      tripType: "自由行",
      travelDate: "2026-04-12",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional partner + partnerLink", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validBase,
      partner: "klook",
      partnerLink: "https://www.klook.com/affiliate?aid=123&ref=kyoto",
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown partner", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validBase,
      partner: "not-a-partner",
    });
    expect(result.success).toBe(false);
  });
});
