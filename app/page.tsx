import { Hero } from "@/components/home/hero";
import { ExchangeCard } from "@/components/home/exchange-card";
import { ArticleCard } from "@/components/home/article-card";
import { partners, PARTNER_KEYS } from "@/lib/config/partners";
import { getAllArticles } from "@/lib/articles";

export default async function HomePage() {
  const articles = await getAllArticles();

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">推薦合作夥伴</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNER_KEYS.map((key) => (
            <ExchangeCard key={key} info={partners[key]} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">最新文章</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {articles.map((a) => (
            <ArticleCard key={a.frontmatter.slug} fm={a.frontmatter} />
          ))}
        </div>
      </section>
    </>
  );
}
