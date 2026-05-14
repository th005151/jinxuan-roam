import { describe, it, expect } from "vitest";
import { buildArticleJsonLd } from "./article-jsonld";
import type { ArticleFrontmatter } from "@/lib/schemas/article";

const fm: ArticleFrontmatter = {
  title: "MAX 開戶教學",
  description: "從零教你開戶 MAX。",
  slug: "max-signup-tutorial",
  publishedAt: "2026-05-20",
  updatedAt: "2026-06-01",
  author: "HuJ",
  keywords: ["MAX 開戶"],
  canonical: "https://example.com/max-signup-tutorial",
  hasAffiliate: true,
  relatedSlugs: ["a", "b", "c"],
};

describe("buildArticleJsonLd", () => {
  it("returns a valid Article schema object", () => {
    const result = buildArticleJsonLd(fm);
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Article");
    expect(result.headline).toBe("MAX 開戶教學");
    expect(result.datePublished).toBe("2026-05-20");
    expect(result.dateModified).toBe("2026-06-01");
    expect(result.author).toEqual({ "@type": "Person", name: "HuJ" });
  });
});
