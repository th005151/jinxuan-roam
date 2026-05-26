#!/usr/bin/env node
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import { mapNotionPageToFrontmatter, contentHash } from "./sync-notion-helpers.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(REPO_ROOT, "content/articles");
const IMAGES_DIR = path.join(REPO_ROOT, "public/uploads/notion");

const TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!TOKEN || !DATABASE_ID) {
  console.warn("[sync-notion] NOTION_TOKEN or NOTION_DATABASE_ID not set. Skipping sync; build will use existing files.");
  process.exit(0);
}

const notion = new Client({ auth: TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return download(res.headers.location, destPath).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", async () => {
          await fs.mkdir(path.dirname(destPath), { recursive: true });
          await fs.writeFile(destPath, Buffer.concat(chunks));
          resolve();
        });
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function rehostImages(markdownBody, slug) {
  const slugDir = path.join(IMAGES_DIR, slug);
  const pattern = /!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)/g;
  let out = markdownBody;
  const matches = [...markdownBody.matchAll(pattern)];
  for (const m of matches) {
    const [full, alt, url] = m;
    try {
      const ext = (url.match(/\.(jpe?g|png|webp|gif)\b/i)?.[1] ?? "jpg").toLowerCase();
      const fileName = `${contentHash(url)}.${ext === "jpeg" ? "jpg" : ext}`;
      const destPath = path.join(slugDir, fileName);
      await download(url, destPath);
      const publicPath = `/uploads/notion/${slug}/${fileName}`;
      out = out.replace(full, `![${alt}](${publicPath})`);
    } catch (err) {
      console.warn(`[sync-notion] image fetch failed for ${slug}: ${err.message}`);
    }
  }
  return out;
}

function frontmatterYaml(fm) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(fm)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const item of v) lines.push(`  - ${JSON.stringify(item)}`);
    } else if (typeof v === "string") {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    } else {
      lines.push(`${k}: ${v}`);
    }
  }
  lines.push("---", "");
  return lines.join("\n");
}

async function clearOldSynced() {
  await fs.mkdir(ARTICLES_DIR, { recursive: true });
  const files = await fs.readdir(ARTICLES_DIR);
  for (const f of files) {
    if (f.endsWith(".mdx") && !f.endsWith("_seed.mdx")) {
      await fs.unlink(path.join(ARTICLES_DIR, f));
    }
  }
}

async function resolveDataSourceId(databaseId) {
  const db = await notion.databases.retrieve({ database_id: databaseId });
  const sources = db.data_sources ?? [];
  if (sources.length === 0) {
    throw new Error(`database ${databaseId} has no data_sources (notion API v5 expects at least one)`);
  }
  if (sources.length > 1) {
    console.warn(`[sync-notion] database has ${sources.length} data sources; using the first ("${sources[0].name ?? sources[0].id}")`);
  }
  return sources[0].id;
}

async function main() {
  try {
    const dataSourceId = await resolveDataSourceId(DATABASE_ID);
    const queried = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Status", select: { equals: "Published" } },
      sorts: [{ property: "Published At", direction: "descending" }],
      page_size: 100,
    });

    if (queried.has_more) {
      console.warn("[sync-notion] >100 published articles; pagination not implemented, only first 100 synced.");
    }

    await clearOldSynced();

    const seenSlugs = new Map();
    let ok = 0;
    let skipped = 0;
    for (const page of queried.results) {
      try {
        const fm = mapNotionPageToFrontmatter(page);
        if (!fm) {
          skipped++;
          continue;
        }
        const originalSlug = fm.slug;
        if (seenSlugs.has(originalSlug)) {
          const count = seenSlugs.get(originalSlug);
          seenSlugs.set(originalSlug, count + 1);
          fm.slug = `${originalSlug}-${count + 1}`;
          fm.canonical = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://jinxuan-roam.vercel.app"}/${fm.slug}`;
          console.warn(`[sync-notion] slug collision for "${originalSlug}"; using "${fm.slug}"`);
        } else {
          seenSlugs.set(originalSlug, 1);
        }
        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const mdResult = n2m.toMarkdownString(mdBlocks);
        const rawBody = mdResult?.parent ?? "";
        const body = await rehostImages(rawBody, fm.slug);
        const out = frontmatterYaml(fm) + body.trim() + "\n";
        const outPath = path.join(ARTICLES_DIR, `${fm.slug}.mdx`);
        await fs.writeFile(outPath, out, "utf8");
        ok++;
      } catch (err) {
        console.warn(`[sync-notion] page ${page.id} failed: ${err.message}`);
        skipped++;
      }
    }

    console.log(`[sync-notion] ${ok} synced, ${skipped} skipped.`);
  } catch (err) {
    console.warn(`[sync-notion] global failure (continuing with existing files): ${err.message}`);
    process.exit(0); // do not break the build
  }
}

main();
