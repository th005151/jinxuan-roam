import Link from "next/link";
import type { ArticleFrontmatter } from "@/lib/schemas/article";

export function ArticleCard({ fm }: { fm: ArticleFrontmatter }) {
  return (
    <Link
      href={`/${fm.slug}`}
      className="block rounded-lg border border-zinc-200 p-4 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <h3 className="font-semibold">{fm.title}</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{fm.description}</p>
      <time className="mt-2 block text-xs text-zinc-500">{fm.publishedAt}</time>
    </Link>
  );
}
