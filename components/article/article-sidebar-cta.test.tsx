import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleSidebarCta } from "./article-sidebar-cta";

describe("ArticleSidebarCta", () => {
  it("returns null when no partner is given", () => {
    const { container } = render(<ArticleSidebarCta partner={undefined} sourceArticle="a" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders Klook display name when partner='klook'", () => {
    render(<ArticleSidebarCta partner="klook" sourceArticle="a" />);
    expect(screen.getByText("Klook 客路")).toBeInTheDocument();
  });

  it("renders the affiliate link with brand background when href override is provided", () => {
    const { container } = render(
      <ArticleSidebarCta
        partner="klook"
        partnerLink="https://www.klook.com/affiliate?aid=test"
        sourceArticle="a"
      />
    );
    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.className).toContain("bg-brand");
  });
});
