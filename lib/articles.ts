import fs from "node:fs/promises";
import path from "node:path";
import { parseMdxFile, type ParsedArticle } from "./mdx";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

let cache: ParsedArticle[] | null = null;

async function loadAll(): Promise<ParsedArticle[]> {
  if (cache) return cache;
  const files = await fs.readdir(ARTICLES_DIR);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const parsed = await Promise.all(
    mdxFiles.map((f) => parseMdxFile(path.join(ARTICLES_DIR, f)))
  );
  cache = parsed.sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt)
  );
  return cache;
}

export async function getAllArticles(): Promise<ParsedArticle[]> {
  return loadAll();
}

export async function getArticleBySlug(slug: string): Promise<ParsedArticle | null> {
  const all = await loadAll();
  return all.find((a) => a.frontmatter.slug === slug) ?? null;
}

export async function getArticleSlugs(): Promise<string[]> {
  const all = await loadAll();
  return all.map((a) => a.frontmatter.slug);
}
