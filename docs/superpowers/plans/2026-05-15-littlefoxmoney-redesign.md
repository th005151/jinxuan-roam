# littlefoxmoney Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace placeholder branding (Coinkit + C monogram + create-next-app styles) with the full littlefoxmoney brand system + Modern Editorial visual redesign + two-column article layout, keeping all existing routing, MDX, analytics, SEO, affiliate behavior intact.

**Architecture:** Tailwind 4 CSS-first `@theme inline` registration + `next/font/google` 4-family load + new `Logo` / `LogoMark` / `Wordmark` components composed into Header/Footer + restyled domain components + new `ArticleTOC` / `ArticleSidebarCta` for article sidebar. Dark mode preserved with explicit dark-token mapping per component. SSR uses `tone="light"` first paint then swaps after `useTheme()` resolves.

**Tech Stack:** Next.js 15 (app router) + React 19 + TypeScript 5 + Tailwind 4 + next-themes + @mdx-js/* + zod + vitest + @testing-library/react + Playwright.

**Spec:** [`docs/superpowers/specs/2026-05-15-littlefoxmoney-redesign-design.md`](../specs/2026-05-15-littlefoxmoney-redesign-design.md)

**Conventions:**
- Tests: vitest unit tests live next to source (`foo.tsx` ↔ `foo.test.tsx`). E2E in `tests/e2e/*.spec.ts`.
- Each component test imports from `@testing-library/react` and `vitest`. `@testing-library/jest-dom/vitest` matchers are auto-loaded via `vitest.setup.ts`.
- Commits on `master` (personal project, no PR flow).
- Each task ends with `npm run test`, `npm run lint`, then commit.

---

## Phase 0 — Foundation: Tokens + Fonts

### Task 1: Register design tokens in Tailwind 4 `@theme inline`

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css with the full token block**

Read current file. Replace its entire content with:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@source "../content/**/*.{md,mdx}";

@theme inline {
  --font-sans: var(--font-inter), var(--font-noto-sans-tc), system-ui, sans-serif;
  --font-serif: var(--font-source-serif), var(--font-noto-serif-tc), Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --color-brand: #059669;        /* emerald-600 */
  --color-brand-deep: #047857;   /* emerald-700 */
  --color-brand-soft: #ECFDF5;   /* emerald-50 */
  --color-ink: #18181B;          /* zinc-900 */
  --color-ink-muted: #71717A;    /* zinc-500 */

  --shadow-brand-hover: 0 8px 24px rgba(5,150,105,0.08);
  --shadow-mark: 0 12px 28px -8px rgba(5,150,105,0.4);
}

@layer base {
  body { font-family: var(--font-sans); }
  .prose-article { font-family: var(--font-serif); }
}
```

- [ ] **Step 2: Verify build still passes**

Run: `npm run lint && npx tsc --noEmit`
Expected: 0 errors / 0 warnings.

Run: `npm run build`
Expected: build succeeds, all 9 routes generated as before.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(theme): register Tailwind 4 brand tokens via @theme inline"
```

---

### Task 2: Load 4 Google Fonts via next/font and wire CSS variables

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace layout.tsx with font-loaded version**

Read current `app/layout.tsx`. Replace its content with:

```tsx
import type { Metadata } from "next";
import { Inter, Noto_Sans_TC, Source_Serif_4, Noto_Serif_TC } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Ga4Script } from "@/components/analytics/ga4-script";
import { siteConfig } from "@/lib/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-serif",
  display: "swap",
});

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteConfig.locale}
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansTC.variable} ${sourceSerif.variable} ${notoSerifTC.variable}`}
    >
      <body className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50 font-sans">
        <Ga4Script measurementId={process.env.NEXT_PUBLIC_GA4_ID ?? ""} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Key changes vs original: 4 next/font imports + variables piped to `<html className>`, body className changed `dark:text-zinc-100` → `dark:text-zinc-50` + added `font-sans`.

- [ ] **Step 2: Verify dev server starts and fonts load**

Run: `npm run build`
Expected: build succeeds. In build output, observe `Generating static pages` shows pages building cleanly. No font-related errors.

Run: `npm run test`
Expected: 25/25 unit tests still pass (no behavioral change to anything tested).

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(fonts): load Inter / Noto Sans TC / Source Serif 4 / Noto Serif TC via next/font"
```

---

## Phase 1 — Brand Components (TDD)

### Task 3: Create `LogoMark` component (FX in emerald circle)

**Files:**
- Create: `components/layout/logo-mark.tsx`
- Create: `components/layout/logo-mark.test.tsx`

- [ ] **Step 1: Write the failing test**

Write `components/layout/logo-mark.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogoMark } from "./logo-mark";

describe("LogoMark", () => {
  it("renders 'FX' text", () => {
    render(<LogoMark />);
    expect(screen.getByText("FX")).toBeInTheDocument();
  });

  it("uses default aria-label 'littlefoxmoney'", () => {
    render(<LogoMark />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "littlefoxmoney");
  });

  it("respects custom aria-label", () => {
    render(<LogoMark aria-label="Brand mark" />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "Brand mark");
  });

  it("applies size to width / height / font-size (size × 0.46)", () => {
    render(<LogoMark size={64} />);
    const el = screen.getByRole("img");
    expect(el).toHaveStyle({
      width: "64px",
      height: "64px",
      fontSize: `${64 * 0.46}px`,
    });
  });

  it("default size 32 → font-size 14.72px", () => {
    render(<LogoMark />);
    const el = screen.getByRole("img");
    expect(el).toHaveStyle({ width: "32px", height: "32px", fontSize: `${32 * 0.46}px` });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- logo-mark`
Expected: FAIL — module not found `./logo-mark`.

- [ ] **Step 3: Implement `LogoMark`**

Write `components/layout/logo-mark.tsx`:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- logo-mark`
Expected: PASS (5/5).

- [ ] **Step 5: Commit**

```bash
git add components/layout/logo-mark.tsx components/layout/logo-mark.test.tsx
git commit -m "feat(brand): add LogoMark component (FX in emerald circle)"
```

---

### Task 4: Create `Wordmark` component (little[fox]money)

**Files:**
- Create: `components/layout/wordmark.tsx`
- Create: `components/layout/wordmark.test.tsx`

- [ ] **Step 1: Write the failing test**

Write `components/layout/wordmark.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Wordmark } from "./wordmark";

describe("Wordmark", () => {
  it("renders 'little', 'fox', and 'money' text", () => {
    const { container } = render(<Wordmark />);
    expect(container.textContent).toBe("littlefoxmoney");
  });

  it("wraps 'fox' in a span with the accent color", () => {
    const { container } = render(<Wordmark accent="#059669" />);
    const fox = Array.from(container.querySelectorAll("span")).find(
      (s) => s.textContent === "fox"
    );
    expect(fox).toBeDefined();
    expect(fox).toHaveStyle({ color: "#059669" });
  });

  it("default size 18, color zinc-900, accent emerald-600", () => {
    const { container } = render(<Wordmark />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveStyle({
      fontSize: "18px",
      color: "#18181B",
      letterSpacing: "-0.045em",
    });
  });

  it("respects custom size and colors", () => {
    const { container } = render(<Wordmark size={24} color="#000" accent="#ff0000" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveStyle({ fontSize: "24px", color: "#000" });
    const fox = Array.from(container.querySelectorAll("span")).find(
      (s) => s.textContent === "fox"
    );
    expect(fox).toHaveStyle({ color: "#ff0000" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- wordmark`
Expected: FAIL — module not found `./wordmark`.

- [ ] **Step 3: Implement `Wordmark`**

Write `components/layout/wordmark.tsx`:

```tsx
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

export default Wordmark;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- wordmark`
Expected: PASS (4/4).

- [ ] **Step 5: Commit**

```bash
git add components/layout/wordmark.tsx components/layout/wordmark.test.tsx
git commit -m "feat(brand): add Wordmark component (little[fox]money)"
```

---

### Task 5: Create `Logo` component (composes mark + wordmark + subtitle)

**Files:**
- Create: `components/layout/logo.tsx`
- Create: `components/layout/logo.test.tsx`

- [ ] **Step 1: Write the failing test**

Write `components/layout/logo.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./logo";

describe("Logo", () => {
  it("default horizontal renders mark + wordmark", () => {
    const { container } = render(<Logo />);
    expect(screen.getByText("FX")).toBeInTheDocument();
    expect(container.textContent).toContain("littlefoxmoney");
  });

  it("variant 'mark-only' renders only the mark, no wordmark text", () => {
    const { container } = render(<Logo variant="mark-only" />);
    expect(screen.getByText("FX")).toBeInTheDocument();
    expect(container.textContent).toBe("FX");
  });

  it("variant 'wordmark-only' renders wordmark, no FX mark", () => {
    const { container } = render(<Logo variant="wordmark-only" />);
    expect(screen.queryByText("FX")).toBeNull();
    expect(container.textContent).toContain("littlefoxmoney");
  });

  it("showSubtitle renders 小狐理財", () => {
    const { container } = render(<Logo showSubtitle />);
    expect(container.textContent).toContain("小狐理財");
  });

  it("vertical variant + showSubtitle renders wide-spaced subtitle", () => {
    const { container } = render(<Logo variant="vertical" showSubtitle />);
    expect(container.textContent).toContain("小 狐 理 財");
  });

  it("dark tone passes through to LogoMark", () => {
    render(<Logo tone="dark" />);
    const mark = screen.getByText("FX");
    expect(mark.className).toContain("bg-emerald-400");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- "logo.test"`
Expected: FAIL — module not found `./logo`.

- [ ] **Step 3: Implement `Logo`**

Write `components/layout/logo.tsx`:

```tsx
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

export default Logo;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- "logo.test"`
Expected: PASS (6/6).

Run: `npm run test`
Expected: previous 25 + 5 + 4 + 6 = 40 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/layout/logo.tsx components/layout/logo.test.tsx
git commit -m "feat(brand): add Logo component composing mark + wordmark + subtitle"
```

---

## Phase 2 — Identity Update

### Task 6: Update siteConfig + UTM source rebrand + smoke test

**Files:**
- Modify: `lib/config/site.ts`
- Modify: `lib/affiliate/links.ts`
- Modify: `lib/affiliate/links.test.ts`
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Replace `lib/config/site.ts`**

Replace the file with:

```ts
export const siteConfig = {
  name: "小狐理財 littlefoxmoney",
  shortName: "littlefoxmoney",
  description: "台灣加密貨幣新手指南：MAX、幣安、派網一站搞懂。",
  tagline: "台灣加密貨幣新手指南",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://littlefoxmoney.com",
  locale: "zh-TW",
  author: {
    name: "（你的暱稱）",
    bio: "台灣加密貨幣中度玩家。實際用過 MAX、幣安、派網；這個站是我的學習筆記。",
  },
} as const;

export type SiteConfig = typeof siteConfig;
```

- [ ] **Step 2: Update `lib/affiliate/links.ts` to use new UTM source**

In `lib/affiliate/links.ts`, change the line:

```ts
url.searchParams.set("utm_source", "coinkit");
```

to:

```ts
url.searchParams.set("utm_source", "littlefoxmoney");
```

- [ ] **Step 3: Update affiliate unit test assertions**

In `lib/affiliate/links.test.ts`, line 14 and line 21 both assert `utm_source=coinkit`. Replace both occurrences:

```ts
expect(url.searchParams.get("utm_source")).toBe("coinkit");
```

with:

```ts
expect(url.searchParams.get("utm_source")).toBe("littlefoxmoney");
```

Run: `npm run test -- links`
Expected: PASS.

- [ ] **Step 4: Update Playwright smoke test UTM assertion**

In `tests/e2e/smoke.spec.ts:55`, change:

```ts
expect(location).toContain("utm_source=coinkit");
```

to:

```ts
expect(location).toContain("utm_source=littlefoxmoney");
```

- [ ] **Step 5: Run all unit tests**

Run: `npm run test`
Expected: all unit tests pass with new shortName / UTM. (E2E run is deferred — see Task 38.)

- [ ] **Step 6: Commit**

```bash
git add lib/config/site.ts lib/affiliate/links.ts lib/affiliate/links.test.ts tests/e2e/smoke.spec.ts
git commit -m "feat(identity): rebrand site to littlefoxmoney + update UTM source"
```

---

### Task 7: Create `app/icon.tsx` favicon (FX squircle)

**Files:**
- Create: `app/icon.tsx`

- [ ] **Step 1: Write `app/icon.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#059669",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 235,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          borderRadius: 96,
        }}
      >
        FX
      </div>
    ),
    size
  );
}
```

- [ ] **Step 2: Verify build emits the icon**

Run: `npm run build`
Expected: build output mentions `/icon`. The static favicon will be served at `/icon` and Next adds `<link rel="icon" href="/icon">` automatically.

- [ ] **Step 3: Commit**

```bash
git add app/icon.tsx
git commit -m "feat(brand): add FX squircle favicon at /icon"
```

---

### Task 8: Create `app/apple-icon.tsx` (no border-radius)

**Files:**
- Create: `app/apple-icon.tsx`

- [ ] **Step 1: Write `app/apple-icon.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#059669",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 235,
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        FX
      </div>
    ),
    size
  );
}
```

(No `borderRadius` — iOS applies its own mask.)

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build emits `/apple-icon` route.

- [ ] **Step 3: Commit**

```bash
git add app/apple-icon.tsx
git commit -m "feat(brand): add apple-icon (no border-radius for iOS mask)"
```

---

### Task 9: Rewrite default OG image with FX mark + emerald accent + serif headline

**Files:**
- Modify: `app/opengraph-image.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";

export const runtime = "edge";
export const alt = `${siteConfig.shortName} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFFFFF",
          padding: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Decorative soft circle */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "#ECFDF5",
          }}
        />

        {/* Top — FX mark */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 9999,
            background: "#059669",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: "-0.05em",
            zIndex: 1,
          }}
        >
          FX
        </div>

        {/* Bottom — eyebrow + headline + url */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, zIndex: 1 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#059669",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              fontFamily: "Source Serif 4, Georgia, serif",
              fontSize: 64,
              fontWeight: 700,
              color: "#18181B",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              maxWidth: 880,
            }}
          >
            新手也能搞懂的加密貨幣
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#71717A",
              letterSpacing: 0.5,
            }}
          >
            {new URL(siteConfig.url).host}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds, `/opengraph-image` listed in output.

- [ ] **Step 3: Commit**

```bash
git add app/opengraph-image.tsx
git commit -m "feat(brand): rewrite default OG image with FX mark + emerald accent"
```

---

### Task 10: Rewrite per-article OG image with FX mark + serif title

**Files:**
- Modify: `app/[slug]/opengraph-image.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";
import { siteConfig } from "@/lib/config/site";

export const runtime = "nodejs";
export const alt = "Article preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const title = article?.frontmatter.title ?? siteConfig.name;
  const author = article?.frontmatter.author ?? siteConfig.author.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFFFFF",
          padding: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "#ECFDF5",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              background: "#059669",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: "-0.05em",
            }}
          >
            FX
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#18181B" }}>
            {siteConfig.shortName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, zIndex: 1 }}>
          <div
            style={{
              fontFamily: "Source Serif 4, Georgia, serif",
              fontSize: 56,
              fontWeight: 700,
              color: "#18181B",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 22, color: "#71717A" }}>By {author}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/[slug]/opengraph-image.tsx
git commit -m "feat(brand): rewrite per-article OG image with FX mark + serif title"
```

---

## Phase 3 — Layout Shell

### Task 11: Refactor `Header` to use `<Logo />` + dark mode tone

**Files:**
- Modify: `components/layout/header.tsx`

- [ ] **Step 1: Replace file content**

```tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  const tone = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <header className="border-b border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="littlefoxmoney 首頁">
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
```

Note: header is now a client component because it reads `useTheme()`. The brand text inside `<Logo />` does not depend on `siteConfig.shortName` (avoid coupling text styling to config).

- [ ] **Step 2: Verify tests + build**

Run: `npm run test && npx tsc --noEmit && npm run lint`
Expected: 0 errors / 0 warnings / 40 tests pass.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/layout/header.tsx
git commit -m "refactor(header): use Logo component + dark mode tone wiring"
```

---

### Task 12: Refactor `Footer` to use `<Logo showSubtitle />`

**Files:**
- Modify: `components/layout/footer.tsx`

- [ ] **Step 1: Replace file content**

```tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { siteConfig } from "@/lib/config/site";

export function Footer() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  const tone = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <footer className="mt-20 border-t border-zinc-100 py-10 text-[13px] text-zinc-500 dark:border-zinc-900 dark:text-zinc-400">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6">
        <Logo variant="horizontal" markSize={28} textSize={16} tone={tone} showSubtitle />
        <p className="max-w-2xl leading-relaxed">
          本站內容僅供教育與資訊用途，不構成投資建議。加密貨幣具高度價格波動風險，投資前請自行評估。
        </p>
        <nav className="flex flex-wrap gap-5">
          <Link href="/about" className="hover:text-brand">關於本站</Link>
          <Link href="/disclosure" className="hover:text-brand">Affiliate 揭露</Link>
          <Link href="/privacy" className="hover:text-brand">隱私權政策</Link>
        </nav>
        <p>© {new Date().getFullYear()} {siteConfig.name}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify tests + build**

Run: `npm run test && npx tsc --noEmit && npm run lint`
Expected: 0 errors / 40 tests pass.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/layout/footer.tsx
git commit -m "refactor(footer): use Logo with subtitle + dark mode tone"
```

---

## Phase 4 — Homepage

### Task 13: Refactor `Hero` (eyebrow + clamp h1 + sub max-width + tagline source)

**Files:**
- Modify: `components/home/hero.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-16 pb-12">
      <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
        {siteConfig.tagline}
      </p>
      <h1
        className="font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
        style={{ fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1.1, letterSpacing: "-0.025em" }}
      >
        新手也能搞懂的加密貨幣
      </h1>
      <p className="mt-5 max-w-[480px] text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        從零開始：MAX 入金 → USDT 提領到幣安 → 派網被動策略。中度玩家的學習筆記。
      </p>
      <Link
        href="/max-vs-binance"
        className="mt-8 inline-block rounded-md bg-brand px-6 py-3 text-white shadow-sm transition hover:bg-brand-deep hover:shadow-md"
      >
        從這裡開始 →
      </Link>
    </section>
  );
}
```

Note: `clamp(32px, 5vw, 60px)` — mobile floor 32px (per spec §4.3), desktop ceiling 60px. The `/test-sample` link is replaced with the actual existing article slug `/max-vs-binance` (the only published article).

- [ ] **Step 2: Verify tests + build**

Run: `npm run test && npx tsc --noEmit && npm run lint`
Expected: 0 errors / 40 tests pass.

- [ ] **Step 3: Commit**

```bash
git add components/home/hero.tsx
git commit -m "refactor(hero): eyebrow + clamp h1 + tagline source + emerald CTA"
```

---

### Task 14: Refactor `ExchangeCard` (emerald dot, hover lift, radius 8, emerald CTA)

**Files:**
- Modify: `components/home/exchange-card.tsx`

- [ ] **Step 1: Replace file content**

```tsx
"use client";

import type { ExchangeInfo } from "@/lib/config/exchanges";
import { AffiliateLink } from "@/components/cta/affiliate-link";

export function ExchangeCard({ info }: { info: ExchangeInfo }) {
  return (
    <div className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-brand-hover dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex items-center gap-2">
        <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-brand" />
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{info.displayName}</h3>
      </div>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{info.tagline}</p>
      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-zinc-500">手續費</dt>
          <dd className="text-zinc-900 dark:text-zinc-100">{info.fee}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-500">台幣入金</dt>
          <dd className="text-zinc-900 dark:text-zinc-100">{info.twdDeposit ? "✓" : "需轉幣"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-500">新手友善度</dt>
          <dd className="text-zinc-900 dark:text-zinc-100">{"★".repeat(info.beginnerFriendly)}</dd>
        </div>
      </dl>
      <AffiliateLink
        exchange={info.key}
        sourceArticle="home"
        position="inline"
        className="mt-5 block rounded-md bg-brand px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-deep"
      >
        前往註冊 →
      </AffiliateLink>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/home/exchange-card.tsx
git commit -m "refactor(exchange-card): emerald dot + hover lift + brand CTA"
```

---

### Task 15: Refactor `ArticleCard` (read time + emerald hover)

**Files:**
- Modify: `components/home/article-card.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import Link from "next/link";
import type { ArticleFrontmatter } from "@/lib/schemas/article";
import { articleHref } from "@/lib/articles";

export function ArticleCard({ fm }: { fm: ArticleFrontmatter }) {
  return (
    <Link
      href={articleHref(fm.slug)}
      className="group block rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-brand-hover dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <h3 className="text-base font-semibold text-zinc-900 transition group-hover:text-brand dark:text-zinc-50 dark:group-hover:text-emerald-400">
        {fm.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{fm.description}</p>
      <div className="mt-3 flex gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <time>{fm.publishedAt}</time>
      </div>
    </Link>
  );
}
```

Note: read-time is not yet in the frontmatter schema. We'll keep this card minimal and document a future schema addition in Task 38 follow-up. Hover accent uses `group-hover:text-brand`.

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/home/article-card.tsx
git commit -m "refactor(article-card): emerald hover accent + tighter typography"
```

---

### Task 16: Refactor homepage container (max-w-4xl + section spacing)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import { Hero } from "@/components/home/hero";
import { ExchangeCard } from "@/components/home/exchange-card";
import { ArticleCard } from "@/components/home/article-card";
import { exchanges, EXCHANGE_KEYS } from "@/lib/config/exchanges";
import { getAllArticles } from "@/lib/articles";

export default async function HomePage() {
  const articles = await getAllArticles();

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">推薦交易所</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXCHANGE_KEYS.map((key) => (
            <ExchangeCard key={key} info={exchanges[key]} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">最新文章</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {articles.map((a) => (
            <ArticleCard key={a.frontmatter.slug} fm={a.frontmatter} />
          ))}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds, homepage statically rendered.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "refactor(home): widen container to max-w-4xl + responsive grid"
```

---

## Phase 5 — Article Structure + Dark Mode

### Task 17: Map MDX `h1` → `h2` element to fix dual-h1 SEO issue

**Files:**
- Modify: `mdx-components.tsx`
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Update `mdx-components.tsx` h1 mapping**

In `mdx-components.tsx`, replace the `h1` mapper:

```tsx
h1: ({ children }) => (
  <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight">{children}</h1>
),
```

with:

```tsx
h1: ({ children }) => (
  <h2 className="mt-10 mb-4 text-2xl font-bold tracking-tight">{children}</h2>
),
```

Reasoning: ArticleHeader's `<h1>` is the page's only h1 for SEO. MDX `#` markdown should render as h2 to avoid double-h1.

- [ ] **Step 2: Update Playwright smoke test to drop `.first()` workaround**

In `tests/e2e/smoke.spec.ts`, change:

```ts
await expect(page.locator("article h1").first()).toContainText("MAX vs 幣安");
```

to:

```ts
await expect(page.locator("article h1")).toContainText("MAX vs 幣安");
```

(Removes `.first()` because there's now only one h1 inside the article.)

- [ ] **Step 3: Verify build + unit tests**

Run: `npm run build && npm run test`
Expected: pass.

(E2E suite confirmation deferred to Task 38.)

- [ ] **Step 4: Commit**

```bash
git add mdx-components.tsx tests/e2e/smoke.spec.ts
git commit -m "fix(mdx): map markdown h1 to h2 element to avoid dual-h1 SEO issue"
```

---

### Task 18: Refactor `ArticleHeader` (serif h1, dot separator meta)

**Files:**
- Modify: `components/article/article-header.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import { Breadcrumb } from "./breadcrumb";
import type { ArticleFrontmatter } from "@/lib/schemas/article";
import { articleHref } from "@/lib/articles";

export function ArticleHeader({ fm }: { fm: ArticleFrontmatter }) {
  return (
    <header className="mb-10">
      <Breadcrumb
        items={[
          { name: "首頁", url: "/" },
          { name: fm.title, url: articleHref(fm.slug) },
        ]}
      />
      <h1
        className="mt-5 font-serif font-bold text-zinc-900 dark:text-zinc-50"
        style={{ fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.2, letterSpacing: "-0.015em" }}
      >
        {fm.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
        <span>📅 {fm.publishedAt}</span>
        <span aria-hidden>·</span>
        <span>✍️ {fm.author}</span>
        {fm.updatedAt !== fm.publishedAt && (
          <>
            <span aria-hidden>·</span>
            <span>✏️ 更新 {fm.updatedAt}</span>
          </>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/article/article-header.tsx
git commit -m "refactor(article-header): serif h1 + dot separator meta"
```

---

### Task 19: Refactor `Breadcrumb` (size 13, › separator, emerald hover)

**Files:**
- Modify: `components/article/breadcrumb.tsx`

- [ ] **Step 1: Replace file content**

```tsx
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
```

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/article/breadcrumb.tsx
git commit -m "refactor(breadcrumb): size 13 + emerald hover"
```

---

### Task 20: Refactor `DisclosureBanner` (amber → emerald)

**Files:**
- Modify: `components/affiliate/disclosure-banner.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import Link from "next/link";

export function DisclosureBanner() {
  return (
    <aside
      role="note"
      className="my-6 rounded-md border-l-[3px] border-brand bg-brand-soft p-4 text-sm text-zinc-700 dark:bg-emerald-900/40 dark:text-zinc-200"
    >
      本文含 affiliate 連結，若你透過連結註冊，我會收到分潤，但對你的價格不會有影響。
      詳見 <Link href="/disclosure" className="font-semibold underline decoration-brand decoration-2 underline-offset-2 hover:text-brand">揭露聲明</Link>。
    </aside>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/affiliate/disclosure-banner.tsx
git commit -m "refactor(disclosure-banner): amber → emerald + 3px brand left border"
```

---

### Task 21: Apply `prose-article` class to MDX body wrapper

**Files:**
- Modify: `app/[slug]/page.tsx`

- [ ] **Step 1: Replace the MDX wrapper div className**

In `app/[slug]/page.tsx`, find the line:

```tsx
<div className="prose prose-zinc max-w-none dark:prose-invert">
```

Replace with:

```tsx
<div className="prose-article max-w-none text-[17px] leading-[1.75] text-zinc-900 dark:text-zinc-100">
```

(Drops the dependency on `@tailwindcss/typography` — uses our `.prose-article` base class plus explicit body sizing per spec §4.3 Body article row. Per-element styling continues to come from `mdx-components.tsx`.)

- [ ] **Step 2: Verify build + tests**

Run: `npm run build && npm run test`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add app/[slug]/page.tsx
git commit -m "refactor(article): apply prose-article class for serif body font"
```

---

## Phase 6 — Sidebar (Two-Column)

### Task 22: Add optional `primaryExchange` to article frontmatter schema

**Files:**
- Modify: `lib/schemas/article.ts`
- Modify: `lib/schemas/article.test.ts`

- [ ] **Step 1: Add an optional `primaryExchange` field to the schema**

In `lib/schemas/article.ts`, change:

```ts
import { z } from "zod";
```

to:

```ts
import { z } from "zod";
import { EXCHANGE_KEYS } from "@/lib/config/exchanges";
```

And add `primaryExchange` to the schema (after `relatedSlugs`):

```ts
relatedSlugs: z.tuple([z.string(), z.string(), z.string()]),
primaryExchange: z.enum(EXCHANGE_KEYS).optional(),
```

- [ ] **Step 2: Add tests for the new field**

Append to `lib/schemas/article.test.ts`:

```ts
  it("accepts optional primaryExchange", () => {
    const result = ArticleFrontmatterSchema.safeParse({ ...validInput, primaryExchange: "max" });
    expect(result.success).toBe(true);
  });

  it("rejects unknown primaryExchange value", () => {
    const result = ArticleFrontmatterSchema.safeParse({ ...validInput, primaryExchange: "ftx" });
    expect(result.success).toBe(false);
  });

  it("accepts frontmatter without primaryExchange (it is optional)", () => {
    const result = ArticleFrontmatterSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });
```

- [ ] **Step 3: Run tests**

Run: `npm run test -- schemas/article`
Expected: all pass (existing 6 + new 3 = 9).

- [ ] **Step 4: Commit**

```bash
git add lib/schemas/article.ts lib/schemas/article.test.ts
git commit -m "feat(schema): add optional primaryExchange frontmatter field"
```

---

### Task 23: Create `ArticleSidebarCta` component

**Files:**
- Create: `components/article/article-sidebar-cta.tsx`
- Create: `components/article/article-sidebar-cta.test.tsx`

- [ ] **Step 1: Write failing test**

Write `components/article/article-sidebar-cta.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleSidebarCta } from "./article-sidebar-cta";

describe("ArticleSidebarCta", () => {
  it("returns null when no primaryExchange is given", () => {
    const { container } = render(<ArticleSidebarCta primaryExchange={undefined} sourceArticle="a" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders MAX exchange display name when primaryExchange='max'", () => {
    render(<ArticleSidebarCta primaryExchange="max" sourceArticle="a" />);
    expect(screen.getByText("MAX")).toBeInTheDocument();
  });

  it("renders the affiliate link with brand background", () => {
    const { container } = render(<ArticleSidebarCta primaryExchange="max" sourceArticle="a" />);
    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.className).toContain("bg-brand");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- article-sidebar-cta`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `ArticleSidebarCta`**

Write `components/article/article-sidebar-cta.tsx`:

```tsx
import { exchanges, type ExchangeKey } from "@/lib/config/exchanges";
import { AffiliateLink } from "@/components/cta/affiliate-link";

interface Props {
  primaryExchange: ExchangeKey | undefined;
  sourceArticle: string;
}

export function ArticleSidebarCta({ primaryExchange, sourceArticle }: Props) {
  if (!primaryExchange) return null;
  const info = exchanges[primaryExchange];

  return (
    <section className="rounded-lg bg-brand-soft p-4 dark:bg-emerald-900/40">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        本文交易所
      </p>
      <p className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-50">{info.displayName}</p>
      <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">{info.tagline}</p>
      <AffiliateLink
        exchange={primaryExchange}
        sourceArticle={sourceArticle}
        position="inline"
        className="mt-3 block rounded-md bg-brand px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-brand-deep"
      >
        開戶 →
      </AffiliateLink>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- article-sidebar-cta`
Expected: PASS (3/3).

- [ ] **Step 5: Commit**

```bash
git add components/article/article-sidebar-cta.tsx components/article/article-sidebar-cta.test.tsx
git commit -m "feat(article): add ArticleSidebarCta (renders only when primaryExchange set)"
```

---

### Task 24: Create MDX heading extraction utility for TOC

**Files:**
- Create: `lib/article-toc.ts`
- Create: `lib/article-toc.test.ts`

- [ ] **Step 1: Write failing test**

Write `lib/article-toc.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { extractToc, slugify } from "./article-toc";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips punctuation but keeps Chinese characters", () => {
    expect(slugify("為什麼要比較這兩家？")).toBe("為什麼要比較這兩家");
  });

  it("collapses repeated hyphens and trims edges", () => {
    expect(slugify("  multiple   spaces  ")).toBe("multiple-spaces");
  });
});

describe("extractToc", () => {
  it("returns empty array when no headings present", () => {
    expect(extractToc("plain paragraph text")).toEqual([]);
  });

  it("extracts h2 headings with depth 2", () => {
    const md = `# Title\n\n## Section A\n\ntext\n\n## Section B`;
    expect(extractToc(md)).toEqual([
      { depth: 2, text: "Section A", id: "section-a" },
      { depth: 2, text: "Section B", id: "section-b" },
    ]);
  });

  it("extracts h3 headings as depth 3", () => {
    const md = `## Top\n\n### Sub one\n\n### Sub two`;
    expect(extractToc(md)).toEqual([
      { depth: 2, text: "Top", id: "top" },
      { depth: 3, text: "Sub one", id: "sub-one" },
      { depth: 3, text: "Sub two", id: "sub-two" },
    ]);
  });

  it("ignores h1, h4, h5, h6", () => {
    const md = `# H1\n## H2\n#### H4\n##### H5\n###### H6`;
    expect(extractToc(md)).toEqual([{ depth: 2, text: "H2", id: "h2" }]);
  });

  it("ignores headings inside fenced code blocks", () => {
    const md = "## Real\n\n```\n## Fake heading inside code\n```\n\n## Real two";
    expect(extractToc(md)).toEqual([
      { depth: 2, text: "Real", id: "real" },
      { depth: 2, text: "Real two", id: "real-two" },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- article-toc`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/article-toc.ts`**

```ts
export interface TocEntry {
  depth: 2 | 3;
  text: string;
  id: string;
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s　]+/g, "-")
    .replace(/[^\p{L}\p{N}\-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractToc(markdown: string): TocEntry[] {
  const lines = markdown.split(/\r?\n/);
  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of lines) {
    const fenceMatch = /^(```|~~~)/.exec(line);
    if (fenceMatch) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const depth = m[1].length === 2 ? 2 : 3;
    const text = m[2].trim();
    entries.push({ depth, text, id: slugify(text) });
  }

  return entries;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- article-toc`
Expected: PASS (8/8).

- [ ] **Step 5: Commit**

```bash
git add lib/article-toc.ts lib/article-toc.test.ts
git commit -m "feat(toc): add markdown heading extractor + slugify"
```

---

### Task 25: Create `ArticleTOC` client component

**Files:**
- Create: `components/article/article-toc.tsx`
- Create: `components/article/article-toc.test.tsx`

- [ ] **Step 1: Write failing test**

Write `components/article/article-toc.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleTOC } from "./article-toc";

const sample = [
  { depth: 2 as const, text: "為什麼要比較", id: "為什麼要比較" },
  { depth: 3 as const, text: "手續費", id: "手續費" },
  { depth: 2 as const, text: "結論", id: "結論" },
];

describe("ArticleTOC", () => {
  it("renders nothing when entries is empty", () => {
    const { container } = render(<ArticleTOC entries={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders one anchor per entry, href = '#' + id", () => {
    render(<ArticleTOC entries={sample} />);
    expect(screen.getByRole("link", { name: "為什麼要比較" })).toHaveAttribute("href", "#為什麼要比較");
    expect(screen.getByRole("link", { name: "手續費" })).toHaveAttribute("href", "#手續費");
    expect(screen.getByRole("link", { name: "結論" })).toHaveAttribute("href", "#結論");
  });

  it("indents h3 entries", () => {
    render(<ArticleTOC entries={sample} />);
    const h3Link = screen.getByRole("link", { name: "手續費" });
    const li = h3Link.closest("li") as HTMLElement;
    expect(li.className).toContain("pl-4");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- article-toc.test`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/article/article-toc.tsx`**

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- article-toc.test`
Expected: PASS (3/3).

- [ ] **Step 5: Commit**

```bash
git add components/article/article-toc.tsx components/article/article-toc.test.tsx
git commit -m "feat(article): add ArticleTOC client component with active-section highlighting"
```

---

### Task 26: Refactor `app/[slug]/page.tsx` two-column layout

**Files:**
- Modify: `app/[slug]/page.tsx`
- Modify: `mdx-components.tsx`

- [ ] **Step 1: Add heading id rendering in mdx-components.tsx**

In `mdx-components.tsx`, replace the `h2` and `h3` mappers to add `id` attributes (matching what `ArticleTOC` queries):

```tsx
import { slugify } from "@/lib/article-toc";

// ...inside useMDXComponents:
h2: ({ children }) => (
  <h2 id={slugify(typeof children === "string" ? children : "")} className="mt-10 mb-3 text-2xl font-semibold tracking-tight scroll-mt-24">
    {children}
  </h2>
),
h3: ({ children }) => (
  <h3 id={slugify(typeof children === "string" ? children : "")} className="mt-6 mb-2 text-xl font-semibold scroll-mt-24">
    {children}
  </h3>
),
```

(Note: `scroll-mt-24` accounts for sticky header offset when the user clicks a TOC anchor.)

- [ ] **Step 2: Refactor `app/[slug]/page.tsx` two-column layout**

Replace `app/[slug]/page.tsx` with:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { ArticleHeader } from "@/components/article/article-header";
import { ArticleTOC } from "@/components/article/article-toc";
import { ArticleSidebarCta } from "@/components/article/article-sidebar-cta";
import { RelatedArticles } from "@/components/article/related-articles";
import { DisclosureBanner } from "@/components/affiliate/disclosure-banner";
import { ScrollTracker } from "@/components/analytics/scroll-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import { buildArticleJsonLd } from "@/lib/seo/article-jsonld";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumb-jsonld";
import { extractToc } from "@/lib/article-toc";
import { siteConfig } from "@/lib/config/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.frontmatter.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "找不到文章" };
  const { frontmatter: fm } = article;
  return {
    title: fm.title,
    description: fm.description,
    alternates: { canonical: fm.canonical },
    openGraph: {
      title: fm.title,
      description: fm.description,
      type: "article",
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt,
      authors: [fm.author],
    },
    keywords: fm.keywords,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  let MDXContent: React.ComponentType;
  try {
    ({ default: MDXContent } = await import(`@/content/articles/${slug}.mdx`));
  } catch {
    notFound();
  }
  const articleSchema = buildArticleJsonLd(article.frontmatter);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "首頁", url: siteConfig.url },
    { name: article.frontmatter.title, url: article.frontmatter.canonical },
  ]);
  const tocEntries = extractToc(article.content);

  return (
    <article className="mx-auto max-w-[960px] px-6 py-10">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_220px]">
        <div className="min-w-0 max-w-2xl">
          <ArticleHeader fm={article.frontmatter} />
          {article.frontmatter.hasAffiliate && <DisclosureBanner />}
          <div className="prose-article max-w-none text-[17px] leading-[1.75] text-zinc-900 dark:text-zinc-100">
            <MDXContent />
          </div>
          <ScrollTracker sourceArticle={article.frontmatter.slug} />
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <details open>
            <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 lg:hidden dark:text-zinc-400">
              目錄
            </summary>
            <div className="mt-2 lg:mt-0">
              <ArticleTOC entries={tocEntries} />
            </div>
          </details>
          <ArticleSidebarCta
            primaryExchange={article.frontmatter.primaryExchange}
            sourceArticle={article.frontmatter.slug}
          />
          <RelatedArticles slugs={article.frontmatter.relatedSlugs} />
        </aside>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Verify build + tests**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run test`
Expected: all unit tests pass.

- [ ] **Step 4: Commit**

```bash
git add app/[slug]/page.tsx mdx-components.tsx
git commit -m "refactor(article): two-column layout with TOC + sidebar CTA + related"
```

---

### Task 27: Refactor `RelatedArticles` for sidebar context

**Files:**
- Modify: `components/article/related-articles.tsx`

- [ ] **Step 1: Replace file content**

Re-style for sidebar (smaller heading, tighter spacing, no top border since the sidebar is already a column):

```tsx
import Link from "next/link";
import { articleHref, getArticleBySlug } from "@/lib/articles";

export async function RelatedArticles({ slugs }: { slugs: readonly string[] }) {
  const articles = await Promise.all(slugs.map((s) => getArticleBySlug(s)));
  const found = articles.filter((a): a is NonNullable<typeof a> => a !== null);
  if (found.length === 0) return null;

  return (
    <section>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        相關閱讀
      </p>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {found.map((a) => (
          <li key={a.frontmatter.slug} className="py-2">
            <Link
              href={articleHref(a.frontmatter.slug)}
              className="block text-[13px] leading-snug text-zinc-700 transition hover:text-brand dark:text-zinc-300"
            >
              {a.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

(On mobile this still shows in the sidebar, which collapses to under main content per `lg:` breakpoint in the article page grid. No duplicate render needed.)

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/article/related-articles.tsx
git commit -m "refactor(related-articles): sidebar treatment with eyebrow + dividers"
```

---

## Phase 7 — CTA Series

### Task 28: Refactor `CtaInline` (emerald-50 bg + 3px emerald left border)

**Files:**
- Modify: `components/cta/cta-inline.tsx`

- [ ] **Step 1: Replace the JSX (keep all behavior — observer, refs, GA4 firing — intact)**

Replace the return block in `cta-inline.tsx` only. Find:

```tsx
  return (
    <div
      ref={ref}
      className="my-6 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <p className="font-semibold">💡 {benefit}</p>
      <AffiliateLink
        exchange={exchange}
        sourceArticle={sourceArticle}
        position={position}
        className="mt-3 inline-block rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        前往 {info.displayName} 註冊 →
      </AffiliateLink>
      <DisclosureInline />
    </div>
  );
```

Replace with:

```tsx
  return (
    <div
      ref={ref}
      className="my-6 rounded-md border-l-[3px] border-brand bg-brand-soft p-4 dark:bg-emerald-900/40"
    >
      <p className="font-semibold text-zinc-900 dark:text-zinc-50">💡 {benefit}</p>
      <AffiliateLink
        exchange={exchange}
        sourceArticle={sourceArticle}
        position={position}
        className="mt-3 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-deep"
      >
        前往 {info.displayName} 註冊 →
      </AffiliateLink>
      <DisclosureInline />
    </div>
  );
```

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/cta/cta-inline.tsx
git commit -m "refactor(cta-inline): emerald-soft bg + 3px brand left border + brand CTA"
```

---

### Task 29: Refactor `CtaSummary` (emerald number badges + emerald links)

**Files:**
- Modify: `components/cta/cta-summary.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import Link from "next/link";
import type { ExchangeKey } from "@/lib/config/exchanges";
import { DisclosureInline } from "@/components/affiliate/disclosure-inline";
import { AffiliateLink } from "./affiliate-link";

interface Step {
  label: string;
  href: string;
  type: "affiliate" | "internal";
  exchange?: ExchangeKey;
}

interface Props {
  steps: Step[];
  sourceArticle: string;
}

export function CtaSummary({ steps, sourceArticle }: Props) {
  return (
    <section className="mt-10 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-5 text-xl font-bold text-zinc-900 dark:text-zinc-50">接下來怎麼做？</h2>
      <ol className="space-y-4">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              {idx + 1}
            </span>
            {step.type === "affiliate" && step.exchange ? (
              <AffiliateLink
                exchange={step.exchange}
                sourceArticle={sourceArticle}
                position="bottom"
                className="text-brand underline decoration-2 underline-offset-2 transition hover:text-brand-deep"
              >
                {step.label}
              </AffiliateLink>
            ) : (
              <Link
                href={step.href}
                className="text-brand underline decoration-2 underline-offset-2 transition hover:text-brand-deep"
              >
                {step.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <DisclosureInline />
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/cta/cta-summary.tsx
git commit -m "refactor(cta-summary): emerald round step badges + brand links"
```

---

### Task 30: Refactor `CtaComparison` (emerald-50 header row + right-align numbers)

**Files:**
- Modify: `components/cta/cta-comparison.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import { exchanges, type ExchangeKey } from "@/lib/config/exchanges";
import { AffiliateLink } from "./affiliate-link";

interface Row {
  exchange: ExchangeKey;
}

interface Props {
  rows: Row[];
  sourceArticle: string;
}

export function CtaComparison({ rows, sourceArticle }: Props) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-brand-soft text-zinc-700 dark:bg-emerald-900/30 dark:text-zinc-200">
            <th className="px-3 py-2 text-left font-semibold">交易所</th>
            <th className="px-3 py-2 text-right font-semibold">手續費</th>
            <th className="px-3 py-2 text-left font-semibold">台幣入金</th>
            <th className="px-3 py-2 text-right font-semibold">新手友善</th>
            <th className="px-3 py-2 text-left font-semibold">註冊</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ exchange }, idx) => {
            const info = exchanges[exchange];
            const isLast = idx === rows.length - 1;
            return (
              <tr
                key={exchange}
                className={isLast ? "" : "border-b border-zinc-200 dark:border-zinc-800"}
              >
                <td className="px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100">{info.displayName}</td>
                <td className="px-3 py-2 text-right text-zinc-700 dark:text-zinc-300">{info.fee}</td>
                <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">{info.twdDeposit ? "✓" : "需轉幣"}</td>
                <td className="px-3 py-2 text-right text-zinc-700 dark:text-zinc-300">{"★".repeat(info.beginnerFriendly)}</td>
                <td className="px-3 py-2">
                  <AffiliateLink
                    exchange={exchange}
                    sourceArticle={sourceArticle}
                    position="inline"
                    className="text-brand underline decoration-2 underline-offset-2 transition hover:text-brand-deep"
                  >
                    註冊
                  </AffiliateLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/cta/cta-comparison.tsx
git commit -m "refactor(cta-comparison): emerald header row + right-align numbers"
```

---

### Task 31: Refactor `DisclosureInline` (emerald text)

**Files:**
- Modify: `components/affiliate/disclosure-inline.tsx`

- [ ] **Step 1: Replace file content**

```tsx
export function DisclosureInline() {
  return (
    <p className="mt-2 text-xs text-emerald-700/80 dark:text-emerald-400/70">
      揭露：這是 affiliate 連結，你註冊我會收到分潤。
    </p>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/affiliate/disclosure-inline.tsx
git commit -m "refactor(disclosure-inline): emerald muted text"
```

---

### Task 32: Refactor `Faq` (emerald 3px left bar on dt + serif dd)

**Files:**
- Modify: `components/article/faq.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import type { FaqItem } from "@/lib/seo/faq-jsonld";

export function Faq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">常見問題</h2>
      <dl className="space-y-5">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="border-l-[3px] border-brand pl-3 font-semibold text-zinc-900 dark:text-zinc-50">
              {item.question}
            </dt>
            <dd className="mt-2 pl-3 font-serif text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run test && npm run lint`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/article/faq.tsx
git commit -m "refactor(faq): emerald 3px left bar on dt + serif dd"
```

---

## Phase 8 — Static Pages, 404, Visual Regression

### Task 33: Refactor `app/about/page.tsx` with explicit Tailwind typography

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Replace file content (drops `prose prose-zinc dark:prose-invert` which is no-op without typography plugin)**

```tsx
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "關於本站",
  description: `${siteConfig.author.bio} 這個頁面寫了我是誰、為什麼寫這個站。`,
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">關於本站</h1>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">我是誰</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">{siteConfig.author.bio}</p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">為什麼寫這個站</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        台灣加密貨幣新手教學很多，但大多由交易所官方或大型內容站撰寫。我想從一個剛走過這條路的中度玩家視角，
        把實際遇到的卡關、查資料的時間、踩過的小坑記下來，讓接下來要走的人省一些時間。
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">我用過的交易所</h2>
      <ul className="ml-6 list-disc space-y-1 text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        <li>MAX（2024 開始用，台幣入金主力）</li>
        <li>幣安（2025 開始用，現貨買賣）</li>
        <li>派網（2025 開始用，網格機器人）</li>
      </ul>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">我不寫的內容</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        我沒有實際操作過合約交易、DeFi yield farming、鏈上交易策略。
        為了不誤導讀者，這些主題我會明確標示「未涵蓋」。本站不提供任何投資建議。
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">如何聯絡</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        有任何錯誤指正或建議，歡迎透過 Email 聯絡（待補）。
      </p>
    </article>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "refactor(about): explicit Tailwind typography (drop prose dep)"
```

---

### Task 34: Refactor `app/disclosure/page.tsx`

**Files:**
- Modify: `app/disclosure/page.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate 揭露聲明",
  description: "本站使用 affiliate 連結。本頁說明合作交易所、分潤關係，以及推薦邏輯。",
};

export default function DisclosurePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Affiliate 揭露聲明</h1>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        本站文章中包含 affiliate（推薦）連結。當你透過這些連結註冊任何交易所或服務時，
        我可能會收到該平台的分潤。對你而言，註冊與使用價格不會受影響。
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">目前合作的交易所</h2>
      <ul className="ml-6 list-disc space-y-1 text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        <li>MAX</li>
        <li>幣安</li>
        <li>派網</li>
      </ul>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">推薦邏輯</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        我只推薦自己實際使用過的交易所與工具。affiliate 分潤從未影響我的推薦判斷——
        若有交易所付高分潤但體驗不佳，我會誠實寫出問題。
      </p>
      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">免責</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        本站內容僅供教育與資訊用途，不構成投資建議。
        加密貨幣具高度價格波動風險，投資前請自行評估並承擔風險。
      </p>
    </article>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/disclosure/page.tsx
git commit -m "refactor(disclosure): explicit Tailwind typography"
```

---

### Task 35: Refactor `app/privacy/page.tsx`

**Files:**
- Modify: `app/privacy/page.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import type { Metadata } from "next";

const POLICY_UPDATED_AT = "2026-05-15";

export const metadata: Metadata = {
  title: "隱私權政策",
  description: "本站如何處理你的個人資料、cookie 與分析資料。",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">隱私權政策</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">最後更新：{POLICY_UPDATED_AT}</p>

      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">資料蒐集</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">本站使用 Google Analytics 4 蒐集匿名統計資料，包含：</p>
      <ul className="mt-2 ml-6 list-disc space-y-1 text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        <li>頁面瀏覽記錄</li>
        <li>大致地理位置（國家層級）</li>
        <li>瀏覽器與裝置類型</li>
        <li>停留時間與互動行為（如點擊事件）</li>
      </ul>
      <p className="mt-3 text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">本站不會蒐集姓名、Email、電話等個人識別資料。</p>

      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Cookie 使用</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        本站使用 cookie 來：(1) 記錄你的主題偏好（明亮 / 暗色），
        (2) 透過 Google Analytics 進行匿名統計。
        你可以在瀏覽器設定中拒絕或清除 cookie。
      </p>

      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">第三方服務</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">本站使用以下第三方服務，這些服務可能會蒐集你的資料：</p>
      <ul className="mt-2 ml-6 list-disc space-y-1 text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        <li>Google Analytics（網站分析）</li>
        <li>Vercel（網站託管）</li>
        <li>各交易所 affiliate 連結（點擊後轉址到該交易所，受其隱私政策規範）</li>
      </ul>

      <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">聯絡</h2>
      <p className="text-[17px] leading-[1.75] text-zinc-700 dark:text-zinc-300">如有隱私相關疑問，請透過 Email 聯絡（待補）。</p>
    </article>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/privacy/page.tsx
git commit -m "refactor(privacy): explicit Tailwind typography + bump POLICY_UPDATED_AT"
```

---

### Task 36: Refactor `app/not-found.tsx` with brand emerald CTA

**Files:**
- Modify: `app/not-found.tsx`

- [ ] **Step 1: Replace file content**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">找不到這個頁面</h1>
      <p className="mt-4 text-[17px] leading-[1.75] text-zinc-500 dark:text-zinc-400">
        也許文章還沒寫，或網址打錯了。
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-brand px-6 py-3 text-white shadow-sm transition hover:bg-brand-deep hover:shadow-md"
      >
        回首頁 →
      </Link>
    </div>
  );
}
```

Note: the smoke test (`tests/e2e/smoke.spec.ts:42`) asserts `expect(html).toContain("找不到這個頁面")`. This refactor keeps that exact string in the JSX (now in the `<h1>`). No test change needed.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/not-found.tsx
git commit -m "refactor(404): brand emerald CTA + clearer 404 layout"
```

---

### Task 37: Add Playwright dark mode toggle E2E test

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Append a dark mode test to the smoke spec**

Append at the end of `tests/e2e/smoke.spec.ts`:

```ts
test("theme toggle switches html class between light and dark", async ({ page }) => {
  await page.goto("/");
  // Wait for next-themes to mount the resolved theme; default is 'system'.
  await page.waitForSelector('button[aria-label="Toggle theme"]');
  const html = page.locator("html");

  // Click toggle once → should land on either 'dark' or 'light' explicitly.
  await page.click('button[aria-label="Toggle theme"]');
  const afterFirst = await html.getAttribute("class");
  expect(afterFirst === null ? "" : afterFirst).toMatch(/dark|light/);

  // Click again → should flip.
  await page.click('button[aria-label="Toggle theme"]');
  const afterSecond = await html.getAttribute("class");
  if (afterFirst?.includes("dark")) {
    expect(afterSecond ?? "").not.toContain("dark");
  } else {
    expect(afterSecond ?? "").toContain("dark");
  }
});

test("article TOC is visible on desktop and contains entry from MDX h2", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/max-vs-binance");
  const toc = page.locator('nav[aria-label="文章目錄"]');
  await expect(toc).toBeVisible();
  // At least one TOC link should exist (the article has multiple h2 sections).
  const links = toc.locator("a");
  expect(await links.count()).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "test(e2e): add dark mode toggle + TOC visibility cases"
```

(The full E2E run happens in Task 38.)

---

### Task 38: Final acceptance — full suite + manual checks

**Files:** none modified.

- [ ] **Step 1: Run unit + type + lint**

```bash
npm run test && npx tsc --noEmit && npm run lint
```

Expected: all unit tests pass (40 + new TOC tests + new schema tests + new sidebar CTA tests = ~50+), 0 type errors, 0 lint warnings.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: build succeeds. Output should list:
- 5 static routes (`/`, `/about`, `/disclosure`, `/privacy`, `/_not-found`)
- 1 SSG route (`/[slug]`)
- 3 dynamic routes (`/go/[exchange]`, `/icon`, `/apple-icon`, `/opengraph-image`, `/[slug]/opengraph-image` — exact count may differ, just confirm they all build)

- [ ] **Step 3: Run Playwright E2E**

```bash
npm run test:e2e
```

Expected: all 9 original tests + 2 new tests (dark mode toggle + TOC visibility) pass = 11/11.

If a sitemap test fails because `littlefoxmoney.com` URL doesn't exist locally, set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` in your `.env.test` (or wherever Playwright reads env). Document this if it comes up.

- [ ] **Step 4: Manual dark mode pass**

Start dev server: `npm run dev`

For each route, toggle dark mode with the header button and visually confirm:
- `/` — Hero eyebrow emerald-400, brand mark emerald-400, ExchangeCard surface dark
- `/max-vs-binance` — Article serif body readable on zinc-950, TOC active emerald-400, DisclosureBanner emerald-soft variant
- `/about`, `/disclosure`, `/privacy`, `/random-404` — text contrast OK, brand 404 emerald

Take screenshots of each in both modes for the PR description / future regression baseline (drop into a local folder, not committed).

- [ ] **Step 5: Manual OG image preview**

Visit `http://localhost:3000/opengraph-image` and `http://localhost:3000/max-vs-binance/opengraph-image` — confirm 1200×630 PNG renders FX mark + serif title + emerald accent.

(Optional once deployed: paste the article URL into [opengraph.xyz](https://www.opengraph.xyz/) for the social-platform preview.)

- [ ] **Step 6: Lighthouse local check**

```bash
npm run build && npm run start
```

Open `http://localhost:3000` and `http://localhost:3000/max-vs-binance` in Chrome → DevTools → Lighthouse → Mobile → Performance only.
Expected: Performance > 85 on both.

If Performance drops below 85, the most likely culprit is web font loading. Check whether `display: swap` is set on all 4 fonts (it is per Task 2) and whether unused weights are being requested.

- [ ] **Step 7: Commit a follow-up note**

Create `docs/superpowers/notes/2026-05-15-redesign-followup.md`:

```markdown
# littlefoxmoney redesign — follow-up

Completed 2026-05-15 via plan `docs/superpowers/plans/2026-05-15-littlefoxmoney-redesign.md`.

## Open follow-ups (do not block ship)

- [ ] **Set `siteConfig.author.name`** to actual nickname; this propagates into ArticleHeader meta, JSON-LD `author.name`, Footer copyright, and per-article OG image.
- [ ] **Read time** in `ArticleCard` — schema currently has no `readTime` field. Decide: add to frontmatter schema (require value per article) or compute from MDX content length at build time.
- [ ] **Replaceable logo glyphs** (₣ / F× / $F) — documented in design handoff but not implemented; revisit if brand variants become needed.
- [ ] **Mascot illustration** — separate later project; v1 ships with FX mark only.
- [ ] **Spec D11 followup**: if Tailwind 4 typography plugin (`@tailwindcss/typography`) becomes available and stable, consider replacing the explicit per-element classes in static pages with `prose` classes for better long-form content authoring.
```

```bash
git add docs/superpowers/notes/2026-05-15-redesign-followup.md
git commit -m "docs: open follow-ups after littlefoxmoney redesign ship"
```

- [ ] **Step 8: Final verification**

Run: `git status`
Expected: clean working tree.

Run: `git log --oneline -40`
Expected: clear commit history showing all phases — Phase 0 foundation, Phase 1 brand components, Phase 2 identity, Phase 3 layout shell, Phase 4 home, Phase 5 article structure, Phase 6 sidebar, Phase 7 CTA, Phase 8 static pages + 404 + E2E + acceptance.

Done. The site is now branded littlefoxmoney with full Modern Editorial visual system, two-column article layout, TOC, sidebar CTA, dark mode dual palette, and FX-branded favicon / OG images.
