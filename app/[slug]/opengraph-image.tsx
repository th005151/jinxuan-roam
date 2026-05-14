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
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "white",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 28, color: "#71717a" }}>{siteConfig.shortName}</div>
        <div style={{ fontSize: 64, fontWeight: 700, color: "#18181b", lineHeight: 1.2 }}>
          {title}
        </div>
        <div style={{ fontSize: 24, color: "#71717a" }}>By {author}</div>
      </div>
    ),
    { ...size }
  );
}
