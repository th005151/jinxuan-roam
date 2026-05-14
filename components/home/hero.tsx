import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        一站搞懂台灣怎麼買幣 + 用機器人
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        從零開始：MAX 入金 → USDT 提領到幣安 → 派網被動策略。中度玩家的學習筆記。
      </p>
      <Link
        href="/test-sample"
        className="mt-8 inline-block rounded-md bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        從這裡開始 →
      </Link>
    </section>
  );
}
