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
