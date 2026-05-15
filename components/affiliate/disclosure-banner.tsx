import Link from "next/link";

export function DisclosureBanner() {
  return (
    <aside
      role="note"
      className="my-6 rounded-md border-l-[3px] border-brand bg-brand-soft p-4 text-sm text-zinc-700 dark:bg-emerald-900/40 dark:text-zinc-200"
    >
      本文含 affiliate 連結，若你透過連結註冊，我會收到分潤，但對你的價格不會有影響。
      詳見 <Link href="/disclosure" className="font-semibold underline decoration-brand decoration-2 underline-offset-2 hover:text-brand">揭露聲明</Link>。
    </aside>
  );
}
