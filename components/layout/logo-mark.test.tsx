import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogoMark } from "./logo-mark";

describe("LogoMark", () => {
  it("does not render 'FX' text content", () => {
    const { container } = render(<LogoMark />);
    expect(container.textContent).toBe("");
  });

  it("uses default aria-label '金萱漫遊'", () => {
    render(<LogoMark />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "金萱漫遊");
  });

  it("respects custom aria-label", () => {
    render(<LogoMark aria-label="Brand mark" />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "Brand mark");
  });

  it("renders an svg element with path children", () => {
    const { container } = render(<LogoMark />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });

  it("custom size becomes width and height attributes", () => {
    render(<LogoMark size={64} />);
    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("width", "64");
    expect(svg).toHaveAttribute("height", "64");
  });

  it("default size 32 sets width/height to 32", () => {
    render(<LogoMark />);
    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("tone 'dark' changes fill to emerald-400", () => {
    const { container } = render(<LogoMark tone="dark" />);
    const leafPath = container.querySelector("path");
    expect(leafPath).toHaveAttribute("fill", "#34D399");
  });

  it("tone 'mono' changes fill to zinc-900", () => {
    const { container } = render(<LogoMark tone="mono" />);
    const leafPath = container.querySelector("path");
    expect(leafPath).toHaveAttribute("fill", "#18181B");
  });

  it("fg prop overrides tone fill", () => {
    const { container } = render(<LogoMark fg="#FF0000" />);
    const leafPath = container.querySelector("path");
    expect(leafPath).toHaveAttribute("fill", "#FF0000");
  });
});
