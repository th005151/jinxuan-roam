import { describe, it, expect } from "vitest";
import { ArticleFrontmatterSchema } from "./article";

const validInput = {
  title: "MAX 提領 USDT 到幣安：完整步驟",
  description: "本文示範如何把 USDT 從 MAX 轉到幣安，含鏈別選擇與確認時間。",
  slug: "max-to-binance-usdt-transfer",
  publishedAt: "2026-05-20",
  updatedAt: "2026-05-20",
  author: "HuJ",
  keywords: ["MAX 提領 USDT", "MAX 轉幣安"],
  canonical: "https://example.com/max-to-binance-usdt-transfer",
  hasAffiliate: true,
  relatedSlugs: ["max-buy-usdt", "binance-kyc-taiwan", "max-vs-binance"],
};

describe("ArticleFrontmatterSchema", () => {
  it("accepts valid frontmatter", () => {
    const result = ArticleFrontmatterSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects title over 30 characters", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validInput,
      title: "一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二",
    });
    expect(result.success).toBe(false);
  });

  it("rejects description over 70 characters", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validInput,
      description: "x".repeat(71),
    });
    expect(result.success).toBe(false);
  });

  it("requires exactly 3 relatedSlugs", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validInput,
      relatedSlugs: ["a", "b"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid slug format", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validInput,
      slug: "Has Spaces",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = ArticleFrontmatterSchema.safeParse({
      ...validInput,
      publishedAt: "20260520",
    });
    expect(result.success).toBe(false);
  });
});
