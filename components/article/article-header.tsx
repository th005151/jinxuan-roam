import { Breadcrumb } from "./breadcrumb";
import type { ArticleFrontmatter } from "@/lib/schemas/article";
import { articleHref } from "@/lib/articles";

export function ArticleHeader({ fm }: { fm: ArticleFrontmatter }) {
  return (
    <header className="mb-8">
      <Breadcrumb
        items={[
          { name: "首頁", url: "/" },
          { name: fm.title, url: articleHref(fm.slug) },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{fm.title}</h1>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-zinc-500">
        <span>📅 發佈 {fm.publishedAt}</span>
        {fm.updatedAt !== fm.publishedAt && <span>✏️ 更新 {fm.updatedAt}</span>}
        <span>✍️ {fm.author}</span>
      </div>
    </header>
  );
}
