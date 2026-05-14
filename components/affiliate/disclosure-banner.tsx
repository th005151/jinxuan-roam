import Link from "next/link";

export function DisclosureBanner() {
  return (
    <aside className="my-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
      本文含 affiliate 連結，若你透過連結註冊，我會收到分潤，但對你的價格不會有影響。
      詳見 <Link href="/disclosure" className="underline">揭露聲明</Link>。
    </aside>
  );
}
