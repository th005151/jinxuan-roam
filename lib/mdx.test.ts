import { describe, it, expect } from "vitest";
import { parseMdxFile } from "./mdx";
import path from "node:path";

const SAMPLE = path.join(process.cwd(), "content/articles/test-sample.mdx");

describe("parseMdxFile", () => {
  it("parses frontmatter and content", async () => {
    const result = await parseMdxFile(SAMPLE);
    expect(result.frontmatter.slug).toBe("test-sample");
    expect(result.frontmatter.title).toBe("測試文章");
    expect(result.content).toContain("# Hello");
  });

  it("throws on invalid frontmatter", async () => {
    await expect(
      parseMdxFile(path.join(process.cwd(), "content/articles/nonexistent.mdx"))
    ).rejects.toThrow();
  });
});
