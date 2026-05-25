import { describe, expect, it } from "vitest";
import { slugify, contentHash, mapNotionPageToFrontmatter } from "./sync-notion-helpers.mjs";

describe("slugify", () => {
  it("ascii kebab", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("collapses whitespace + strips punctuation", () => {
    expect(slugify("Kyoto, Arashiyama!")).toBe("kyoto-arashiyama");
  });

  it("Chinese title falls back to pinyin-less hash slug", () => {
    const out = slugify("京都嵐山三日漫遊");
    expect(out).toMatch(/^post-[a-z0-9]{8}$/);
  });

  it("empty input → fallback", () => {
    expect(slugify("")).toMatch(/^post-[a-z0-9]{8}$/);
  });
});

describe("contentHash", () => {
  it("returns 8-char hex", () => {
    expect(contentHash("abc")).toMatch(/^[a-f0-9]{8}$/);
  });

  it("same input → same hash", () => {
    expect(contentHash("xyz")).toBe(contentHash("xyz"));
  });
});

describe("mapNotionPageToFrontmatter", () => {
  const sample = {
    id: "abc-def",
    properties: {
      Title: { title: [{ plain_text: "京都嵐山三日漫遊" }] },
      Slug: { rich_text: [{ plain_text: "kyoto-arashiyama-3day" }] },
      Status: { select: { name: "Published" } },
      "Published At": { date: { start: "2026-05-26" } },
      Excerpt: { rich_text: [{ plain_text: "竹林到嵯峨野" }] },
      Country: { select: { name: "日本" } },
      Location: { rich_text: [{ plain_text: "京都・嵐山" }] },
      "Trip Type": { select: { name: "自由行" } },
      "Travel Date": { date: { start: "2026-04-12" } },
      Tags: { multi_select: [{ name: "竹林" }, { name: "私房" }] },
      Partner: { select: { name: "klook" } },
      "Partner Link": { url: "https://www.klook.com/affiliate?aid=123" },
      Cover: { files: [] },
    },
  };

  it("maps required + travel + partner fields", () => {
    const fm = mapNotionPageToFrontmatter(sample);
    expect(fm).not.toBeNull();
    if (!fm) return;
    expect(fm.title).toBe("京都嵐山三日漫遊");
    expect(fm.slug).toBe("kyoto-arashiyama-3day");
    expect(fm.publishedAt).toBe("2026-05-26");
    expect(fm.description).toBe("竹林到嵯峨野");
    expect(fm.country).toBe("日本");
    expect(fm.location).toBe("京都・嵐山");
    expect(fm.tripType).toBe("自由行");
    expect(fm.travelDate).toBe("2026-04-12");
    expect(fm.keywords).toEqual(["竹林", "私房"]);
    expect(fm.partner).toBe("klook");
    expect(fm.partnerLink).toBe("https://www.klook.com/affiliate?aid=123");
  });

  it("derives slug from title when Slug property empty", () => {
    const noSlug = {
      ...sample,
      properties: { ...sample.properties, Slug: { rich_text: [] } },
    };
    const fm = mapNotionPageToFrontmatter(noSlug);
    expect(fm).not.toBeNull();
    if (!fm) return;
    expect(fm.slug).toMatch(/^post-[a-z0-9]{8}$/); // Chinese title → fallback
  });

  it("returns null for unpublished pages", () => {
    const draft = {
      ...sample,
      properties: { ...sample.properties, Status: { select: { name: "Draft" } } },
    };
    expect(mapNotionPageToFrontmatter(draft)).toBeNull();
  });
});
