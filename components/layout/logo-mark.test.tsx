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
