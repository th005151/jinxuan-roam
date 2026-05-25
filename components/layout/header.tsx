"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "@/lib/config/site";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  const tone = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <header className="border-b border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label={`${siteConfig.name} 首頁`}>
          <Logo variant="horizontal" markSize={32} textSize={18} tone={tone} />
        </Link>
        <nav className="flex items-center gap-5 text-[13px]">
          <Link href="/about" className="hover:text-brand">關於</Link>
          <Link href="/disclosure" className="hover:text-brand">揭露</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
