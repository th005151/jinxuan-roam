import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { parseMdxFile } from "./mdx";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const SAMPLE_MDX = `---
title: "Test"
description: "Fixture"
slug: "test"
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
author: "test"
keywords:
  - "test"
canonical: "https://example.com/test"
hasAffiliate: false
relatedSlugs:
  - "a"
  - "b"
  - "c"
---

# Test

Body paragraph.
`;

const TMP_FILE = path.join(os.tmpdir(), "test-article.mdx");

beforeAll(async () => {
  await fs.writeFile(TMP_FILE, SAMPLE_MDX, "utf-8");
});

afterAll(async () => {
  await fs.rm(TMP_FILE, { force: true });
});

describe("parseMdxFile", () => {
  it("parses frontmatter and content", async () => {
    const result = await parseMdxFile(TMP_FILE);
    expect(result.frontmatter.slug).toBe("test");
    expect(result.frontmatter.title).toBe("Test");
    expect(result.content).toContain("Body paragraph.");
  });

  it("throws on invalid frontmatter", async () => {
    await expect(
      parseMdxFile(path.join(process.cwd(), "content/articles/nonexistent.mdx"))
    ).rejects.toThrow();
  });
});
