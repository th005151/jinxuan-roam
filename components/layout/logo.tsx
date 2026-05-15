import * as React from "react";
import { LogoMark } from "./logo-mark";
import { Wordmark } from "./wordmark";

type Variant = "horizontal" | "vertical" | "mark-only" | "wordmark-only";
type Tone = "light" | "dark" | "mono";

interface LogoProps {
  variant?: Variant;
  tone?: Tone;
  /** Mark diameter in px. Default 32. */
  markSize?: number;
  /** Wordmark font-size in px. Default = round(markSize × 0.6). */
  textSize?: number;
  /** Show the 中文 subtitle row. Default false. */
  showSubtitle?: boolean;
  className?: string;
}

const TEXT_COLOR: Record<Tone, { color: string; accent: string }> = {
  light: { color: "#18181B", accent: "#059669" },
  dark: { color: "#FAFAFA", accent: "#34D399" },
  mono: { color: "#18181B", accent: "#18181B" },
};

export function Logo({
  variant = "horizontal",
  tone = "light",
  markSize = 32,
  textSize,
  showSubtitle = false,
  className,
}: LogoProps) {
  const ts = textSize ?? Math.round(markSize * 0.6);
  const t = TEXT_COLOR[tone];

  if (variant === "mark-only") {
    return <LogoMark size={markSize} tone={tone} className={className} />;
  }

  if (variant === "wordmark-only") {
    return (
      <span className={["inline-flex flex-col gap-1.5", className ?? ""].join(" ")}>
        <Wordmark size={ts} color={t.color} accent={t.accent} />
        {showSubtitle && <Subtitle tone={tone} />}
      </span>
    );
  }

  if (variant === "vertical") {
    return (
      <span className={["inline-flex flex-col items-center gap-3", className ?? ""].join(" ")}>
        <LogoMark size={markSize} tone={tone} />
        <Wordmark size={ts} color={t.color} accent={t.accent} />
        {showSubtitle && <Subtitle tone={tone} wide />}
      </span>
    );
  }

  // horizontal (default)
  return (
    <span className={["inline-flex items-center gap-3", className ?? ""].join(" ")}>
      <LogoMark size={markSize} tone={tone} />
      <span className="inline-flex flex-col gap-1">
        <Wordmark size={ts} color={t.color} accent={t.accent} />
        {showSubtitle && <Subtitle tone={tone} small />}
      </span>
    </span>
  );
}

function Subtitle({ tone, wide, small }: { tone: Tone; wide?: boolean; small?: boolean }) {
  const color = tone === "dark" ? "rgba(250,250,250,0.65)" : "#71717A";
  return (
    <span
      style={{
        fontFamily: '"Noto Sans TC", system-ui, sans-serif',
        fontSize: small ? 11 : 12,
        fontWeight: 500,
        letterSpacing: wide ? "0.4em" : "0.32em",
        color,
      }}
    >
      {wide ? "小 狐 理 財" : "小狐理財"}
    </span>
  );
}
