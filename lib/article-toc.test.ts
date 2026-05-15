import { describe, it, expect } from "vitest";
import { extractToc, slugify } from "./article-toc";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips punctuation but keeps Chinese characters", () => {
    expect(slugify("為什麼要比較這兩家？")).toBe("為什麼要比較這兩家");
  });

  it("collapses repeated hyphens and trims edges", () => {
    expect(slugify("  multiple   spaces  ")).toBe("multiple-spaces");
  });
});

describe("extractToc", () => {
  it("returns empty array when no headings present", () => {
    expect(extractToc("plain paragraph text")).toEqual([]);
  });

  it("extracts h2 headings with depth 2", () => {
    const md = `# Title\n\n## Section A\n\ntext\n\n## Section B`;
    expect(extractToc(md)).toEqual([
      { depth: 2, text: "Section A", id: "section-a" },
      { depth: 2, text: "Section B", id: "section-b" },
    ]);
  });

  it("extracts h3 headings as depth 3", () => {
    const md = `## Top\n\n### Sub one\n\n### Sub two`;
    expect(extractToc(md)).toEqual([
      { depth: 2, text: "Top", id: "top" },
      { depth: 3, text: "Sub one", id: "sub-one" },
      { depth: 3, text: "Sub two", id: "sub-two" },
    ]);
  });

  it("ignores h1, h4, h5, h6", () => {
    const md = `# H1\n## H2\n#### H4\n##### H5\n###### H6`;
    expect(extractToc(md)).toEqual([{ depth: 2, text: "H2", id: "h2" }]);
  });

  it("ignores headings inside fenced code blocks", () => {
    const md = "## Real\n\n```\n## Fake heading inside code\n```\n\n## Real two";
    expect(extractToc(md)).toEqual([
      { depth: 2, text: "Real", id: "real" },
      { depth: 2, text: "Real two", id: "real-two" },
    ]);
  });
});
