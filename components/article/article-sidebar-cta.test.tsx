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
