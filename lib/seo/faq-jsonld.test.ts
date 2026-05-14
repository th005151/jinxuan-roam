import { describe, it, expect } from "vitest";
import { buildFaqJsonLd } from "./faq-jsonld";

describe("buildFaqJsonLd", () => {
  it("returns valid FAQPage schema", () => {
    const result = buildFaqJsonLd([
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ]);
    expect(result["@type"]).toBe("FAQPage");
    const items = result.mainEntity as unknown as Array<{ name: string }>;
    expect(items.length).toBe(2);
    expect(items[0]?.name).toBe("Q1?");
  });
});
