import { describe, it, expect } from "vitest";
import { parseMdxFile } from "./mdx";
import path from "node:path";

const SAMPLE = path.join(process.cwd(), "content/articles/max-vs-binance.mdx");

describe("parseMdxFile", () => {
  it("parses frontmatter and content", async () => {
    const result = await parseMdxFile(SAMPLE);
    expect(result.frontmatter.slug).toBe("max-vs-binance");
    expect(result.frontmatter.title).toBe("MAX vs 幣安：什麼情境用哪個");
    expect(result.content).toContain("MAX vs 幣安");
  });

  it("throws on invalid frontmatter", async () => {
    await expect(
      parseMdxFile(path.join(process.cwd(), "content/articles/nonexistent.mdx"))
    ).rejects.toThrow();
  });
});
