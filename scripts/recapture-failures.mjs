import { chromium } from "@playwright/test";
import path from "node:path";

const OUT = path.join(process.cwd(), "screenshots");
const browser = await chromium.launch();

async function capture(url, file, { width, height, dark }) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  if (dark) {
    await page.addInitScript(() => window.localStorage.setItem("theme", "dark"));
  } else {
    await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
  }
  await page.goto(`http://localhost:3000${url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, file), fullPage: true });
  await ctx.close();
  console.log(`saved ${file}`);
}

await capture("/max-vs-binance", "03-article-light.png", { width: 1280, height: 900, dark: false });
await capture("/max-vs-binance", "04-article-dark.png", { width: 1280, height: 900, dark: true });

await browser.close();
console.log("done");
