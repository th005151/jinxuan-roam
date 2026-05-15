import * as React from "react";

type Tone = "light" | "dark" | "mono";

interface LogoMarkProps {
  /** Diameter in px. Default 32. */
  size?: number;
  /** Visual context. Default "light". */
  tone?: Tone;
  className?: string;
  /** Override bg color. Wins over `tone`. */
  bg?: string;
  /** Override fg color. Wins over `tone`. */
  fg?: string;
  /** Accessible label. Default "littlefoxmoney". */
  "aria-label"?: string;
}

const TONE_CLASS: Record<Tone, string> = {
  light: "bg-brand text-white",
  dark: "bg-emerald-400 text-emerald-900",
  mono: "bg-zinc-900 text-white",
};

export function LogoMark({
  size = 32,
  tone = "light",
  className,
  bg,
  fg,
  "aria-label": ariaLabel = "littlefoxmoney",
}: LogoMarkProps) {
  const overrideStyle: React.CSSProperties = {};
  if (bg) overrideStyle.background = bg;
  if (fg) overrideStyle.color = fg;

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center rounded-full font-sans font-extrabold leading-none shrink-0",
        TONE_CLASS[tone],
        className ?? "",
      ].join(" ")}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.46,
        letterSpacing: "-0.05em",
        ...overrideStyle,
      }}
    >
      FX
    </span>
  );
}

export default LogoMark;
