import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";

export const runtime = "edge";
export const alt = `${siteConfig.shortName} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFFFFF",
          padding: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Decorative soft circle */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "#ECFDF5",
          }}
        />

        {/* Top — FX mark */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 9999,
            background: "#059669",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: "-0.05em",
            zIndex: 1,
          }}
        >
          FX
        </div>

        {/* Bottom — eyebrow + headline + url */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, zIndex: 1 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#059669",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              fontFamily: "Source Serif 4, Georgia, serif",
              fontSize: 64,
              fontWeight: 700,
              color: "#18181B",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              maxWidth: 880,
            }}
          >
            新手也能搞懂的加密貨幣
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#71717A",
              letterSpacing: 0.5,
            }}
          >
            {new URL(siteConfig.url).host}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
