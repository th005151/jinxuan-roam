import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Wordmark } from "./wordmark";

describe("Wordmark", () => {
  it("renders '金萱', '漫', and '遊' text", () => {
    const { container } = render(<Wordmark />);
    expect(container.textContent).toBe("金萱漫遊");
  });

  it("wraps '漫' in a span with the accent color", () => {
    const { container } = render(<Wordmark accent="#059669" />);
    const man = Array.from(container.querySelectorAll("span")).find(
      (s) => s.textContent === "漫"
    );
    expect(man).toBeDefined();
    expect(man).toHaveStyle({ color: "#059669" });
  });

  it("default size 18, color zinc-900, accent emerald-600", () => {
    const { container } = render(<Wordmark />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveStyle({
      fontSize: "18px",
      color: "#18181B",
      letterSpacing: "0.02em",
    });
  });

  it("respects custom size and colors", () => {
    const { container } = render(<Wordmark size={24} color="#000" accent="#ff0000" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveStyle({ fontSize: "24px", color: "#000" });
    const man = Array.from(container.querySelectorAll("span")).find(
      (s) => s.textContent === "漫"
    );
    expect(man).toHaveStyle({ color: "#ff0000" });
  });
});
