import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 py-8 text-sm text-zinc-500 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl space-y-4 px-4">
        <p>
          本站內容僅供教育與資訊用途，不構成投資建議。加密貨幣具高度價格波動風險，投資前請自行評估。
        </p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/about" className="hover:underline">關於本站</Link>
          <Link href="/disclosure" className="hover:underline">Affiliate 揭露</Link>
          <Link href="/privacy" className="hover:underline">隱私權政策</Link>
        </nav>
        <p>© {new Date().getFullYear()} {siteConfig.name}</p>
      </div>
    </footer>
  );
}
