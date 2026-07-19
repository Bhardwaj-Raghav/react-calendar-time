/**
 * Captures README screenshots from the Astro website.
 * Usage: node scripts/capture-screenshots.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import http from "node:http";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "examples");
const port = 5199;

function waitForServer(url, attempts = 40) {
  return new Promise((resolve, reject) => {
    let left = attempts;
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        left -= 1;
        if (left <= 0) {
          reject(new Error(`Server did not start: ${url}`));
          return;
        }
        setTimeout(tick, 250);
      });
    };
    tick();
  });
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const child = spawn(
    "npx",
    ["astro", "dev", "--root", "website", "--port", String(port), "--host", "127.0.0.1"],
    {
      cwd: root,
      shell: true,
      stdio: "pipe",
    }
  );

  try {
    await waitForServer(`http://127.0.0.1:${port}/`);

    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 1100, height: 900 },
      deviceScaleFactor: 2,
    });

    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });

    const datePicker = page
      .locator(".showcase-block")
      .first()
      .locator(".ctp-calendar-time-picker");
    await datePicker.scrollIntoViewIfNeeded();
    await datePicker.screenshot({ path: path.join(outDir, "date.png") });

    await page.locator(".hero-stage .ctp-input").click();
    const popover = page.locator("body > .ctp-calendar-time-picker").first();
    await popover.waitFor({ state: "visible" });
    await popover.getByRole("tab", { name: "Time" }).click();
    await popover.locator(".ctp-body-calendar-time").waitFor({ state: "visible" });
    await popover.screenshot({ path: path.join(outDir, "time.png") });
    await page.keyboard.press("Escape");
    await popover.waitFor({ state: "hidden" }).catch(() => undefined);

    const rangePicker = page
      .locator(".showcase-block")
      .nth(1)
      .locator(".ctp-calendar-time-picker");
    await rangePicker.scrollIntoViewIfNeeded();
    await rangePicker.screenshot({ path: path.join(outDir, "range.png") });

    const heroStage = page.locator(".stage-panel").first();
    await heroStage.scrollIntoViewIfNeeded();
    await heroStage.screenshot({ path: path.join(outDir, "input.png") });

    await browser.close();
    console.log("Wrote examples/date.png, time.png, range.png, input.png");
  } finally {
    child.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
