import { describe, expect, it } from "vitest";
import { PARTNER_KEYS, partners, isPartnerKey } from "./partners";

describe("PARTNER_KEYS", () => {
  it("includes the 6 v1 travel partners", () => {
    expect(PARTNER_KEYS).toEqual([
      "klook",
      "trip",
      "kkday",
      "agoda",
      "booking",
      "expedia",
    ]);
  });
});

describe("partners record", () => {
  it("has an entry for every key", () => {
    for (const key of PARTNER_KEYS) {
      expect(partners[key]).toBeDefined();
      expect(partners[key].key).toBe(key);
      expect(partners[key].displayName.length).toBeGreaterThan(0);
      expect(partners[key].tagline.length).toBeGreaterThan(0);
    }
  });
});

describe("isPartnerKey", () => {
  it("returns true for valid keys", () => {
    expect(isPartnerKey("klook")).toBe(true);
    expect(isPartnerKey("agoda")).toBe(true);
  });
  it("returns false for non-keys", () => {
    expect(isPartnerKey("max")).toBe(false);
    expect(isPartnerKey("")).toBe(false);
  });
});
