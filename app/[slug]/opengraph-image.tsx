import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";
import { siteConfig } from "@/lib/config/site";

export const runtime = "nodejs";
export const alt = "Article preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const title = article?.frontmatter.title ?? siteConfig.name;
  const author = article?.frontmatter.author ?? siteConfig.author.name;

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

        {/* Top — brand mark + site name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              background: "#ECFDF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="38"
              height="38"
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
          <div style={{ fontSize: 22, fontWeight: 600, color: "#18181B" }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, zIndex: 1 }}>
          <div
            style={{
              fontFamily: "Source Serif 4, Georgia, serif",
              fontSize: 56,
              fontWeight: 700,
              color: "#18181B",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 22, color: "#71717A" }}>By {author}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
