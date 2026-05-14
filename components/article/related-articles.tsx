import Link from "next/link";
import { articleHref, getArticleBySlug } from "@/lib/articles";

export async function RelatedArticles({ slugs }: { slugs: readonly string[] }) {
  const articles = await Promise.all(slugs.map((s) => getArticleBySlug(s)));
  const found = articles.filter((a): a is NonNullable<typeof a> => a !== null);
  if (found.length === 0) return null;

  return (
    <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <h2 className="mb-4 text-2xl font-bold">相關文章</h2>
      <ul className="space-y-2">
        {found.map((a) => (
          <li key={a.frontmatter.slug}>
            <Link href={articleHref(a.frontmatter.slug)} className="hover:underline">
              {a.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
