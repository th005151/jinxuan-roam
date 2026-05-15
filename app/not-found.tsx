import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">找不到這個頁面</h1>
      <p className="mt-4 text-[17px] leading-[1.75] text-zinc-500 dark:text-zinc-400">
        也許文章還沒寫，或網址打錯了。
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-brand px-6 py-3 text-white shadow-sm transition hover:bg-brand-deep hover:shadow-md"
      >
        回首頁 →
      </Link>
    </div>
  );
}
