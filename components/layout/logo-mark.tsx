import * as React from "react";

type Tone = "light" | "dark" | "mono";

interface LogoMarkProps {
  /** Diameter in px. Default 32. */
  size?: number;
  /** Visual context. Default "light". */
  tone?: Tone;
  className?: string;
  /** Override stroke/fill color. Wins over `tone`. */
  fg?: string;
  /** Accessible label. Default "金萱漫遊". */
  "aria-label"?: string;
}

const TONE_FILL: Record<Tone, string> = {
  light: "#059669", // emerald-600
  dark: "#34D399",  // emerald-400
  mono: "#18181B",  // zinc-900
};

export function LogoMark({
  size = 32,
  tone = "light",
  className,
  fg,
  "aria-label": ariaLabel = "金萱漫遊",
}: LogoMarkProps) {
  const fill = fg ?? TONE_FILL[tone];
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={["shrink-0", className ?? ""].join(" ")}
    >
      {/* Tea leaf: pointed-tip ellipse from bottom-left → top-right.
          Path traced by two quadratic curves meeting at the tips. */}
      <path
        d="M6 26 Q 4 14 16 4 Q 28 14 26 26 Q 16 22 6 26 Z"
        fill={fill}
      />
      {/* Central vein for leaf detail */}
      <path
        d="M8 24 Q 16 16 24 6"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}
