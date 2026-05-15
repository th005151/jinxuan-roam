import * as React from "react";

interface WordmarkProps {
  /** Font-size in px. Default 18 (header use). */
  size?: number;
  /** Color of "little" and "money". Default zinc-900. */
  color?: string;
  /** Color of "fox". Default emerald-600. */
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
      className={["inline-flex items-baseline font-sans font-extrabold leading-none", className ?? ""].join(" ")}
      style={{
        fontSize: size,
        letterSpacing: "-0.045em",
        color,
      }}
    >
      little<span style={{ color: accent }}>fox</span>money
    </span>
  );
}
