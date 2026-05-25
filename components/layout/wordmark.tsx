import * as React from "react";

interface WordmarkProps {
  /** Font-size in px. Default 18 (header use). */
  size?: number;
  /** Color of "金萱" / "遊". Default zinc-900. */
  color?: string;
  /** Color of "漫". Default emerald-600. */
  accent?: string;
  className?: string;
}

export function Wordmark({
  size = 18,
  color = "#18181B",
  accent = "#059669",
  className,
}: WordmarkProps) {
  return (
    <span
      className={["inline-flex items-baseline font-serif font-extrabold leading-none", className ?? ""].join(" ")}
      style={{
        fontSize: size,
        letterSpacing: "0.02em",
        color,
      }}
    >
      金萱<span style={{ color: accent }}>漫</span>遊
    </span>
  );
}
