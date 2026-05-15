export interface TocEntry {
  depth: 2 | 3;
  text: string;
  id: string;
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s　]+/g, "-")
    .replace(/[^\p{L}\p{N}\-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractToc(markdown: string): TocEntry[] {
  const lines = markdown.split(/\r?\n/);
  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of lines) {
    const fenceMatch = /^(```|~~~)/.exec(line);
    if (fenceMatch) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m || !m[1] || !m[2]) continue;
    const depth = m[1].length === 2 ? 2 : 3;
    const text = m[2].trim();
    entries.push({ depth, text, id: slugify(text) });
  }

  return entries;
}
