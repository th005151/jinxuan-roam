import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { ArticleHeader } from "@/components/article/article-header";
import { RelatedArticles } from "@/components/article/related-articles";
import { DisclosureBanner } from "@/components/affiliate/disclosure-banner";
import { ScrollTracker } from "@/components/analytics/scroll-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import { buildArticleJsonLd } from "@/lib/seo/article-jsonld";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumb-jsonld";
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

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ArticleHeader fm={article.frontmatter} />
      {article.frontmatter.hasAffiliate && <DisclosureBanner />}
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <MDXContent />
      </div>
      <RelatedArticles slugs={article.frontmatter.relatedSlugs} />
      <ScrollTracker sourceArticle={article.frontmatter.slug} />
    </article>
  );
}
