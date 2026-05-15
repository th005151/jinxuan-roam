"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/article-toc";

interface Props {
  entries: TocEntry[];
}

export function ArticleTOC({ entries }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;
    const elements = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records.filter((r) => r.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="文章目錄" className="text-[13px]">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        目錄
      </p>
      <ul className="space-y-1">
        {entries.map((e) => {
          const isActive = activeId === e.id;
          const indent = e.depth === 3 ? "pl-4" : "pl-2";
          const baseColor = isActive
            ? "text-brand font-semibold border-l-2 border-brand"
            : "text-zinc-600 hover:text-brand border-l-2 border-transparent dark:text-zinc-400";
          return (
            <li key={e.id} className={`${indent} ${baseColor}`}>
              <a href={`#${e.id}`} className="block py-1 leading-snug">
                {e.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
