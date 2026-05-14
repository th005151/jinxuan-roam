import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "./route";

function makeRequest(url: string): Request {
  return new Request(url);
}

describe("GET /go/[exchange]", () => {
  beforeEach(() => {
    vi.stubEnv("AFFILIATE_MAX", "https://max.maicoin.com/signup?r=abc");
  });

  it("redirects to the resolved affiliate URL", async () => {
    const res = await GET(makeRequest("https://site.com/go/max?from=home"), {
      params: Promise.resolve({ exchange: "max" }),
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toContain("max.maicoin.com");
    expect(res.headers.get("location")).toContain("utm_campaign=home");
  });

  it("returns 404 for unknown exchange", async () => {
    const res = await GET(makeRequest("https://site.com/go/unknown"), {
      params: Promise.resolve({ exchange: "unknown" }),
    });
    expect(res.status).toBe(404);
  });

  it("returns 503 when env var missing", async () => {
    vi.stubEnv("AFFILIATE_MAX", "");
    const res = await GET(makeRequest("https://site.com/go/max"), {
      params: Promise.resolve({ exchange: "max" }),
    });
    expect(res.status).toBe(503);
  });
});
