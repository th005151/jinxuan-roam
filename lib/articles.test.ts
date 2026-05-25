import { describe, it, expect } from "vitest";
import { getAllArticles, getArticleBySlug } from "./articles";

describe("getAllArticles", () => {
  it("returns an array", async () => {
    expect(Array.isArray(await getAllArticles())).toBe(true);
  });

  it("sorts by publishedAt descending", async () => {
    const all = await getAllArticles();
    for (let i = 1; i < all.length; i++) {
      expect(all[i - 1]!.frontmatter.publishedAt >= all[i]!.frontmatter.publishedAt).toBe(true);
    }
  });
});

describe("getArticleBySlug", () => {
  it("returns null for unknown slug", async () => {
    expect(await getArticleBySlug("definitely-not-an-article")).toBeNull();
  });

  it("returns null when slug not found", async () => {
    const article = await getArticleBySlug("does-not-exist");
    expect(article).toBeNull();
  });
});
