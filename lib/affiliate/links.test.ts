import { afterEach, describe, expect, it } from "vitest";
import { resolveAffiliateUrl, isPartnerKey } from "./links";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("isPartnerKey (re-exported)", () => {
  it("matches partner ids", () => {
    expect(isPartnerKey("klook")).toBe(true);
    expect(isPartnerKey("max")).toBe(false);
  });
});

describe("resolveAffiliateUrl", () => {
  it("returns null when env var missing", () => {
    delete process.env.AFFILIATE_KLOOK;
    expect(resolveAffiliateUrl("klook")).toBeNull();
  });

  it("builds URL with jinxuan UTM params", () => {
    process.env.AFFILIATE_KLOOK = "https://www.klook.com/affiliate?aid=123";
    const url = resolveAffiliateUrl("klook", "kyoto-3day");
    expect(url).toContain("utm_source=jinxuan");
    expect(url).toContain("utm_medium=article-cta");
    expect(url).toContain("utm_campaign=kyoto-3day");
  });

  it("returns null for non-partner keys", () => {
    expect(resolveAffiliateUrl("foo")).toBeNull();
  });
});
