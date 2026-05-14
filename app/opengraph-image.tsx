import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";

export const runtime = "edge";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, textAlign: "center" }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, color: "#a1a1aa", textAlign: "center" }}>
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
