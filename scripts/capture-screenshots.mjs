import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "screenshots");
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function capture(url, file, { width, height, dark }) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  if (dark) {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "dark");
    });
  } else {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "light");
    });
  }
  await page.goto(`http://localhost:3000${url}`, { waitUntil: "networkidle" });
  // brief settle for next-themes to apply class
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, file), fullPage: true });
  await ctx.close();
  console.log(`saved ${file}`);
}

const desktop = { width: 1280, height: 900, dark: false };
const desktopDark = { width: 1280, height: 900, dark: true };
const mobile = { width: 390, height: 844, dark: false };

await capture("/", "01-home-light.png", desktop);
await capture("/", "02-home-dark.png", desktopDark);
await capture("/max-vs-binance", "03-article-light.png", desktop);
await capture("/max-vs-binance", "04-article-dark.png", desktopDark);
await capture("/", "05-home-mobile.png", mobile);
await capture("/about", "06-about-light.png", desktop);
await capture("/random-404", "07-404-light.png", desktop);
await capture("/icon", "08-favicon.png", { width: 256, height: 256, dark: false });

await browser.close();
console.log("done");
