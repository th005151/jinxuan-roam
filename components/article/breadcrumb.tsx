import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumb-jsonld";

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="breadcrumb" className="text-[13px] text-zinc-500 dark:text-zinc-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-zinc-700 dark:text-zinc-300">{item.name}</span>
              ) : (
                <Link href={item.url} className="transition hover:text-brand">{item.name}</Link>
              )}
              {!isLast && <span aria-hidden className="text-zinc-300 dark:text-zinc-600">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
