import { describe, it, expect } from "vitest";
import { getAllArticles, getArticleBySlug } from "./articles";

describe("getAllArticles", () => {
  it("returns at least the test-sample article", async () => {
    const all = await getAllArticles();
    const slugs = all.map((a) => a.frontmatter.slug);
    expect(slugs).toContain("test-sample");
  });

  it("sorts by publishedAt descending", async () => {
    const all = await getAllArticles();
    for (let i = 1; i < all.length; i++) {
      expect(all[i - 1].frontmatter.publishedAt >= all[i].frontmatter.publishedAt).toBe(true);
    }
  });
});

describe("getArticleBySlug", () => {
  it("returns article when slug matches", async () => {
    const article = await getArticleBySlug("test-sample");
    expect(article?.frontmatter.title).toBe("測試文章");
  });

  it("returns null when slug not found", async () => {
    const article = await getArticleBySlug("does-not-exist");
    expect(article).toBeNull();
  });
});
