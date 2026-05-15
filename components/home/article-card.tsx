import Link from "next/link";
import type { ArticleFrontmatter } from "@/lib/schemas/article";
import { articleHref } from "@/lib/articles";

export function ArticleCard({ fm }: { fm: ArticleFrontmatter }) {
  return (
    <Link
      href={articleHref(fm.slug)}
      className="group block rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-brand-hover dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <h3 className="text-base font-semibold text-zinc-900 transition group-hover:text-brand dark:text-zinc-50 dark:group-hover:text-emerald-400">
        {fm.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{fm.description}</p>
      <div className="mt-3 flex gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <time>{fm.publishedAt}</time>
      </div>
    </Link>
  );
}
