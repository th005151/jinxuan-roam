import { describe, it, expect, beforeEach, vi } from "vitest";
import { resolveAffiliateUrl } from "./links";

describe("resolveAffiliateUrl", () => {
  beforeEach(() => {
    vi.stubEnv("AFFILIATE_MAX", "https://max.maicoin.com/signup?r=abc");
    vi.stubEnv("AFFILIATE_BINANCE", "https://accounts.binance.com/register?ref=xyz");
    vi.stubEnv("AFFILIATE_PIONEX", "https://www.pionex.com/signUp?r=def");
  });

  it("returns the URL with utm_source and utm_medium for a known exchange", () => {
    const url = new URL(resolveAffiliateUrl("max")!);
    expect(url.searchParams.get("r")).toBe("abc");
    expect(url.searchParams.get("utm_source")).toBe("coinkit");
    expect(url.searchParams.get("utm_medium")).toBe("article-cta");
    expect(url.searchParams.get("utm_campaign")).toBeNull();
  });

  it("appends utm_campaign when provided", () => {
    const url = new URL(resolveAffiliateUrl("binance", "max-vs-binance")!);
    expect(url.searchParams.get("utm_source")).toBe("coinkit");
    expect(url.searchParams.get("utm_medium")).toBe("article-cta");
    expect(url.searchParams.get("utm_campaign")).toBe("max-vs-binance");
  });

  it("returns null for unknown exchange", () => {
    // @ts-expect-error testing runtime guard
    expect(resolveAffiliateUrl("unknown")).toBeNull();
  });

  it("returns null when env var missing", () => {
    vi.stubEnv("AFFILIATE_MAX", "");
    expect(resolveAffiliateUrl("max")).toBeNull();
  });
});
