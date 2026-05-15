import { Breadcrumb } from "./breadcrumb";
import type { ArticleFrontmatter } from "@/lib/schemas/article";
import { articleHref } from "@/lib/articles";

export function ArticleHeader({ fm }: { fm: ArticleFrontmatter }) {
  return (
    <header className="mb-10">
      <Breadcrumb
        items={[
          { name: "首頁", url: "/" },
          { name: fm.title, url: articleHref(fm.slug) },
        ]}
      />
      <h1
        className="mt-5 font-serif font-bold text-zinc-900 dark:text-zinc-50"
        style={{ fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
      >
        {fm.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
        <span>📅 {fm.publishedAt}</span>
        <span aria-hidden>·</span>
        <span>✍️ {fm.author}</span>
        {fm.updatedAt !== fm.publishedAt && (
          <>
            <span aria-hidden>·</span>
            <span>✏️ 更新 {fm.updatedAt}</span>
          </>
        )}
      </div>
    </header>
  );
}
