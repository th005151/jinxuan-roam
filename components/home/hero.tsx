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
        新手也能搞懂的加密貨幣
      </h1>
      <p className="mt-5 max-w-[480px] text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        從零開始：MAX 入金 → USDT 提領到幣安 → 派網被動策略。中度玩家的學習筆記。
      </p>
      <Link
        href="/max-vs-binance"
        className="mt-8 inline-block rounded-md bg-brand px-6 py-3 text-white shadow-sm transition hover:bg-brand-deep hover:shadow-md"
      >
        從這裡開始 →
      </Link>
    </section>
  );
}
