/**
 * Captures README screenshots from the local website.
 * Usage: node scripts/capture-screenshots.mjs
 */
import { chromium } from "playwright";
import { createServer } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "examples");

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const server = await createServer({
    configFile: path.join(root, "website/vite.config.ts"),
    server: { port: 5199, strictPort: true },
  });
  await server.listen();

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1100, height: 900 },
    deviceScaleFactor: 2,
  });

  await page.goto("http://localhost:5199/", { waitUntil: "networkidle" });

  // Date — inline showcase calendar
  const datePicker = page.locator(".showcase-block").first().locator(".ctp-calendar-time-picker");
  await datePicker.scrollIntoViewIfNeeded();
  await datePicker.screenshot({ path: path.join(outDir, "date.png") });

  // Time — open hero input, switch to Time tab
  await page.locator(".hero-stage .ctp-input").click();
  const popover = page.locator("body > .ctp-calendar-time-picker").first();
  await popover.waitFor({ state: "visible" });
  await popover.getByRole("tab", { name: "Time" }).click();
  await popover.locator(".ctp-body-calendar-time").waitFor({ state: "visible" });
  await popover.screenshot({ path: path.join(outDir, "time.png") });
  await page.keyboard.press("Escape");
  await popover.waitFor({ state: "hidden" }).catch(() => undefined);

  // Range
  const rangePicker = page.locator(".showcase-block").nth(1).locator(".ctp-calendar-time-picker");
  await rangePicker.scrollIntoViewIfNeeded();
  await rangePicker.screenshot({ path: path.join(outDir, "range.png") });

  // Input (closed)
  const heroStage = page.locator(".stage-panel").first();
  await heroStage.scrollIntoViewIfNeeded();
  await heroStage.screenshot({ path: path.join(outDir, "input.png") });

  await browser.close();
  await server.close();
  console.log("Wrote examples/date.png, time.png, range.png, input.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
