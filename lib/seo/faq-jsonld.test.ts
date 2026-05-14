import { describe, it, expect } from "vitest";
import { buildFaqJsonLd } from "./faq-jsonld";

describe("buildFaqJsonLd", () => {
  it("returns valid FAQPage schema", () => {
    const result = buildFaqJsonLd([
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ]);
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("FAQPage");
    const items = result.mainEntity as unknown as Array<{
      "@type": string;
      name: string;
      acceptedAnswer: { "@type": string; text: string };
    }>;
    expect(items.length).toBe(2);
    expect(items[0]).toMatchObject({
      "@type": "Question",
      name: "Q1?",
      acceptedAnswer: { "@type": "Answer", text: "A1." },
    });
    expect(items[1]?.acceptedAnswer.text).toBe("A2.");
  });
});
