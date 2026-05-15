import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#059669",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 235,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          borderRadius: 96,
        }}
      >
        FX
      </div>
    ),
    size
  );
}
