import fs from "node:fs/promises";
import matter from "gray-matter";
import { ArticleFrontmatterSchema, type ArticleFrontmatter } from "./schemas/article";

export interface ParsedArticle {
  frontmatter: ArticleFrontmatter;
  content: string;
}

export async function parseMdxFile(absPath: string): Promise<ParsedArticle> {
  const raw = await fs.readFile(absPath, "utf-8");
  const { data, content } = matter(raw);
  const parsed = ArticleFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${absPath}:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`
    );
  }
  return { frontmatter: parsed.data, content };
}
