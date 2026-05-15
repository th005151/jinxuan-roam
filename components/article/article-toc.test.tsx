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
