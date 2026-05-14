import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "@/lib/config/site";

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.shortName}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/about" className="hover:underline">關於</Link>
          <Link href="/disclosure" className="hover:underline">揭露</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
