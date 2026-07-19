import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "react-calendar-time": path.resolve(root, "../src/index.ts"),
    },
  },
  server: {
    port: 5174,
  },
  build: {
    outDir: path.resolve(root, "../site-dist"),
    emptyOutDir: true,
  },
});
