import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: false,
  clean: true,
  external: ["react", "react-dom", "dayjs"],
  treeshake: true,
  splitting: false,
  cjsInterop: true,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
