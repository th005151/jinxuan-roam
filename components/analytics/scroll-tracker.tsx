"use client";

import { useEffect } from "react";
import { trackScroll75 } from "@/lib/analytics/ga4";

export function ScrollTracker({ sourceArticle }: { sourceArticle: string }) {
  useEffect(() => {
    let fired = false;
    const onScroll = () => {
      if (fired) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total >= 0.75) {
        trackScroll75(sourceArticle);
        fired = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sourceArticle]);

  return null;
}
