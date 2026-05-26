import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { ArticleFrontmatterSchema, type ArticleFrontmatter } from "./schemas/article";

export interface ParsedArticle {
  frontmatter: ArticleFrontmatter;
  content: string;
  /** Basename of the .mdx file on disk (e.g. `hello-jinxuan.mdx` or `_hello-jinxuan_seed.mdx`).
   *  Slug-named seed files use underscored filenames to survive sync; consumers that need to
   *  dynamic-import the file (page route) must use this, not `frontmatter.slug`. */
  fileName: string;
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
  return { frontmatter: parsed.data, content, fileName: path.basename(absPath) };
}
