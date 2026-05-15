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
