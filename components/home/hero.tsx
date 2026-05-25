import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-16 pb-12">
      <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
        {siteConfig.tagline}
      </p>
      <h1
        className="font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
        style={{ fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1.1, letterSpacing: "-0.025em" }}
      >
        {siteConfig.name}
      </h1>
      <p className="mt-5 max-w-[480px] text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        {siteConfig.description} 私房路線、住宿筆記、還有旅程裡那些值得記下來的小事。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-block rounded-md bg-brand px-6 py-3 text-white shadow-sm transition hover:bg-brand-deep hover:shadow-md"
        >
          看最新文章 →
        </Link>
        <Link
          href="/about"
          className="inline-block rounded-md border border-zinc-300 bg-white px-6 py-3 text-zinc-700 shadow-sm transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500"
        >
          關於我
        </Link>
      </div>
    </section>
  );
}
