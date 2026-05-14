import type { Article, WithContext } from "schema-dts";
import type { ArticleFrontmatter } from "@/lib/schemas/article";
import { siteConfig } from "@/lib/config/site";

export function buildArticleJsonLd(fm: ArticleFrontmatter): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.description,
    datePublished: fm.publishedAt,
    dateModified: fm.updatedAt,
    author: { "@type": "Person", name: fm.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": fm.canonical },
    inLanguage: siteConfig.locale,
  };
}
