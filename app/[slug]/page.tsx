import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { ArticleHeader } from "@/components/article/article-header";
import { ArticleTOC } from "@/components/article/article-toc";
import { ArticleSidebarCta } from "@/components/article/article-sidebar-cta";
import { RelatedArticles } from "@/components/article/related-articles";
import { DisclosureBanner } from "@/components/affiliate/disclosure-banner";
import { ScrollTracker } from "@/components/analytics/scroll-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import { buildArticleJsonLd } from "@/lib/seo/article-jsonld";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumb-jsonld";
import { extractToc } from "@/lib/article-toc";
import { siteConfig } from "@/lib/config/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.frontmatter.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "找不到文章" };
  const { frontmatter: fm } = article;
  return {
    title: fm.title,
    description: fm.description,
    alternates: { canonical: fm.canonical },
    openGraph: {
      title: fm.title,
      description: fm.description,
      type: "article",
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt,
      authors: [fm.author],
    },
    keywords: fm.keywords,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  let MDXContent: React.ComponentType;
  try {
    ({ default: MDXContent } = await import(`@/content/articles/${slug}.mdx`));
  } catch {
    notFound();
  }
  const articleSchema = buildArticleJsonLd(article.frontmatter);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "首頁", url: siteConfig.url },
    { name: article.frontmatter.title, url: article.frontmatter.canonical },
  ]);
  const tocEntries = extractToc(article.content);

  return (
    <article className="mx-auto max-w-[960px] px-6 py-10">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_220px]">
        <div className="min-w-0 max-w-2xl">
          <ArticleHeader fm={article.frontmatter} />
          {article.frontmatter.hasAffiliate && <DisclosureBanner />}
          <div className="prose-article max-w-none text-[17px] leading-[1.75] text-zinc-900 dark:text-zinc-100">
            <MDXContent />
          </div>
          <ScrollTracker sourceArticle={article.frontmatter.slug} />
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <details open>
            <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 lg:hidden dark:text-zinc-400">
              目錄
            </summary>
            <div className="mt-2 lg:mt-0">
              <ArticleTOC entries={tocEntries} />
            </div>
          </details>
          <ArticleSidebarCta
            primaryExchange={article.frontmatter.primaryExchange}
            sourceArticle={article.frontmatter.slug}
          />
          <RelatedArticles slugs={article.frontmatter.relatedSlugs} />
        </aside>
      </div>
    </article>
  );
}
