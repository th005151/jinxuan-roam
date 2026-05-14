import { describe, it, expect } from "vitest";
import { getAllArticles, getArticleBySlug } from "./articles";

describe("getAllArticles", () => {
  it("returns at least the max-vs-binance article", async () => {
    const all = await getAllArticles();
    const slugs = all.map((a) => a.frontmatter.slug);
    expect(slugs).toContain("max-vs-binance");
  });

  it("sorts by publishedAt descending", async () => {
    const all = await getAllArticles();
    for (let i = 1; i < all.length; i++) {
      expect(all[i - 1]!.frontmatter.publishedAt >= all[i]!.frontmatter.publishedAt).toBe(true);
    }
  });
});

describe("getArticleBySlug", () => {
  it("returns article when slug matches", async () => {
    const article = await getArticleBySlug("max-vs-binance");
    expect(article?.frontmatter.title).toBe("MAX vs 幣安：什麼情境用哪個");
  });

  it("returns null when slug not found", async () => {
    const article = await getArticleBySlug("does-not-exist");
    expect(article).toBeNull();
  });
});
