import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./logo";

describe("Logo", () => {
  it("default horizontal renders mark + wordmark", () => {
    const { container } = render(<Logo />);
    expect(screen.getByRole("img", { name: "金萱漫遊" })).toBeInTheDocument();
    expect(container.textContent).toContain("金萱");
    expect(container.textContent).toContain("漫");
    expect(container.textContent).toContain("遊");
  });

  it("variant 'mark-only' renders only the mark, no wordmark text", () => {
    const { container } = render(<Logo variant="mark-only" />);
    expect(screen.getByRole("img", { name: "金萱漫遊" })).toBeInTheDocument();
    expect(container.textContent).toBe("");
  });

  it("variant 'wordmark-only' renders wordmark, no svg mark", () => {
    const { container } = render(<Logo variant="wordmark-only" />);
    expect(container.querySelector("svg")).toBeNull();
    expect(container.textContent).toContain("金萱漫遊");
  });

  it("showSubtitle renders 走慢一點，看細一點", () => {
    const { container } = render(<Logo showSubtitle />);
    expect(container.textContent).toContain("走慢一點，看細一點");
  });

  it("vertical variant + showSubtitle renders wide-spaced subtitle", () => {
    const { container } = render(<Logo variant="vertical" showSubtitle />);
    expect(container.textContent).toContain("走 慢 一 點，看 細 一 點");
  });

  it("dark tone passes through to LogoMark (leaf fill emerald-400)", () => {
    const { container } = render(<Logo tone="dark" />);
    const leafPath = container.querySelector("path");
    expect(leafPath).toHaveAttribute("fill", "#34D399");
  });
});
