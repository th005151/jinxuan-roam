import { Hero } from "@/components/home/hero";
import { ExchangeCard } from "@/components/home/exchange-card";
import { ArticleCard } from "@/components/home/article-card";
import { exchanges, EXCHANGE_KEYS } from "@/lib/config/exchanges";
import { getAllArticles } from "@/lib/articles";

export default async function HomePage() {
  const articles = await getAllArticles();

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">推薦交易所</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {EXCHANGE_KEYS.map((key) => (
            <ExchangeCard key={key} info={exchanges[key]} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">最新文章</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.map((a) => (
            <ArticleCard key={a.frontmatter.slug} fm={a.frontmatter} />
          ))}
        </div>
      </section>
    </>
  );
}
