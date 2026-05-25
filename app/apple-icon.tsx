import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ECFDF5",
          borderRadius: 128,
        }}
      >
        {/* Tea-leaf mark */}
        <svg
          width="360"
          height="360"
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
    ),
    size
  );
}
