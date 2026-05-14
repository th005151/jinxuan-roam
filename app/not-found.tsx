import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        找不到這個頁面。也許文章還沒寫，或網址打錯了。
      </p>
      <Link href="/" className="mt-8 inline-block text-blue-600 underline hover:text-blue-800">
        回首頁 →
      </Link>
    </div>
  );
}
