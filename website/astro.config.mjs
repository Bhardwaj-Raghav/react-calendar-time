import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

const root = path.dirname(fileURLToPath(import.meta.url));
const site =
  process.env.SITE_URL?.replace(/\/$/, "") ||
  "https://react-calendar-time.vercel.app";

export default defineConfig({
  site,
  root,
  srcDir: path.join(root, "src"),
  publicDir: path.join(root, "public"),
  outDir: path.resolve(root, "../site-dist"),
  integrations: [react(), sitemap()],
  vite: {
    resolve: {
      alias: [
        {
          find: "react-calendar-time/style.css",
          replacement: path.resolve(root, "../src/styles/datepicker.scss"),
        },
        {
          find: /^react-calendar-time$/,
          replacement: path.resolve(root, "../src/index.ts"),
        },
      ],
    },
  },
});
