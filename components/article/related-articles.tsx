import Link from "next/link";
import { articleHref, getArticleBySlug } from "@/lib/articles";

export async function RelatedArticles({ slugs }: { slugs: readonly string[] }) {
  const articles = await Promise.all(slugs.map((s) => getArticleBySlug(s)));
  const found = articles.filter((a): a is NonNullable<typeof a> => a !== null);
  if (found.length === 0) return null;

  return (
    <section>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        相關閱讀
      </p>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {found.map((a) => (
          <li key={a.frontmatter.slug} className="py-2">
            <Link
              href={articleHref(a.frontmatter.slug)}
              className="block text-[13px] leading-snug text-zinc-700 transition hover:text-brand dark:text-zinc-300"
            >
              {a.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
