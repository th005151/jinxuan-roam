import { describe, it, expect } from "vitest";
import { buildBreadcrumbJsonLd } from "./breadcrumb-jsonld";

describe("buildBreadcrumbJsonLd", () => {
  it("returns valid BreadcrumbList schema", () => {
    const result = buildBreadcrumbJsonLd([
      { name: "首頁", url: "https://example.com/" },
      { name: "MAX 開戶", url: "https://example.com/max-signup-tutorial" },
    ]);
    expect(result["@type"]).toBe("BreadcrumbList");
    expect(Array.isArray(result.itemListElement)).toBe(true);
    const items = result.itemListElement as unknown as Array<{ position: number; name: string }>;
    expect(items.length).toBe(2);
    expect(items[0]?.position).toBe(1);
    expect(items[1]?.position).toBe(2);
  });
});
