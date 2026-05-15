"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { siteConfig } from "@/lib/config/site";

export function Footer() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  const tone = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <footer className="mt-20 border-t border-zinc-100 py-10 text-[13px] text-zinc-500 dark:border-zinc-900 dark:text-zinc-400">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6">
        <Logo variant="horizontal" markSize={28} textSize={16} tone={tone} showSubtitle />
        <p className="max-w-2xl leading-relaxed">
          本站內容僅供教育與資訊用途，不構成投資建議。加密貨幣具高度價格波動風險，投資前請自行評估。
        </p>
        <nav className="flex flex-wrap gap-5">
          <Link href="/about" className="hover:text-brand">關於本站</Link>
          <Link href="/disclosure" className="hover:text-brand">Affiliate 揭露</Link>
          <Link href="/privacy" className="hover:text-brand">隱私權政策</Link>
        </nav>
        <p>© {new Date().getFullYear()} {siteConfig.name}</p>
      </div>
    </footer>
  );
}
