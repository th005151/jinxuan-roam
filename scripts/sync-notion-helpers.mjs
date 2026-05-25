import crypto from "node:crypto";

const ASCII_KEBAB_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function contentHash(input) {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 8);
}

export function slugify(input) {
  if (!input) return `post-${contentHash(String(Math.random()))}`;
  const ascii = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  if (ascii && ASCII_KEBAB_RE.test(ascii)) return ascii;
  return `post-${contentHash(input)}`;
}

function readPlainText(richTextProp) {
  if (!richTextProp) return "";
  const arr = richTextProp.title ?? richTextProp.rich_text ?? [];
  return arr.map((r) => r.plain_text ?? "").join("").trim();
}

function readSelect(prop) {
  return prop?.select?.name ?? null;
}

function readMultiSelect(prop) {
  return (prop?.multi_select ?? []).map((m) => m.name);
}

function readDate(prop) {
  return prop?.date?.start ?? null;
}

function readUrl(prop) {
  return prop?.url ?? null;
}

export function mapNotionPageToFrontmatter(page) {
  const props = page.properties ?? {};
  const status = readSelect(props.Status);
  if (status !== "Published") return null;

  const title = readPlainText(props.Title);
  const declaredSlug = readPlainText(props.Slug);
  const slug = declaredSlug && ASCII_KEBAB_RE.test(declaredSlug)
    ? declaredSlug
    : slugify(title);

  const publishedAt = readDate(props["Published At"]) ?? new Date().toISOString().slice(0, 10);

  return {
    title,
    slug,
    description: readPlainText(props.Excerpt) || title,
    publishedAt,
    updatedAt: publishedAt,
    author: "金萱",
    keywords: readMultiSelect(props.Tags),
    canonical: `https://jinxuan-roam.vercel.app/${slug}`,
    hasAffiliate: Boolean(readSelect(props.Partner) && readSelect(props.Partner) !== "none"),
    relatedSlugs: ["", "", ""], // P2: auto-related not implemented; caller fills manually if needed
    country: readSelect(props.Country) ?? undefined,
    location: readPlainText(props.Location) || undefined,
    tripType: readSelect(props["Trip Type"]) ?? undefined,
    travelDate: readDate(props["Travel Date"]) ?? undefined,
    partner: (() => {
      const p = readSelect(props.Partner);
      return p && p !== "none" ? p : undefined;
    })(),
    partnerLink: readUrl(props["Partner Link"]) ?? undefined,
  };
}
