import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
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

        {/* Top — tea-leaf mark */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 9999,
            background: "#ECFDF5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 26 Q 4 14 16 4 Q 28 14 26 26 Q 16 22 6 26 Z"
              fill="#059669"
            />
            <path
              d="M8 24 Q 16 16 24 6"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </svg>
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
              fontSize: 72,
              fontWeight: 700,
              color: "#18181B",
              lineHeight: 1.15,
              letterSpacing: "0.02em",
              maxWidth: 880,
            }}
          >
            {siteConfig.name}
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
