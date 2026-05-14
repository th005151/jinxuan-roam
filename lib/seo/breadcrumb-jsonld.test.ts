import { describe, it, expect } from "vitest";
import { buildBreadcrumbJsonLd } from "./breadcrumb-jsonld";

describe("buildBreadcrumbJsonLd", () => {
  it("returns valid BreadcrumbList schema", () => {
    const result = buildBreadcrumbJsonLd([
      { name: "首頁", url: "https://example.com/" },
      { name: "MAX 開戶", url: "https://example.com/max-signup-tutorial" },
    ]);
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("BreadcrumbList");
    expect(Array.isArray(result.itemListElement)).toBe(true);
    const items = result.itemListElement as unknown as Array<{
      "@type": string;
      position: number;
      name: string;
      item: string;
    }>;
    expect(items.length).toBe(2);
    expect(items[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
      name: "首頁",
      item: "https://example.com/",
    });
    expect(items[1]).toMatchObject({
      "@type": "ListItem",
      position: 2,
      name: "MAX 開戶",
      item: "https://example.com/max-signup-tutorial",
    });
  });
});
