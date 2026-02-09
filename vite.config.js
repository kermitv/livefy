import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

function copyDocsToDist() {
  return {
    name: "copy-docs-to-dist",
    closeBundle() {
      const docsDir = resolve(process.cwd(), "docs");
      const distDocsDir = resolve(process.cwd(), "dist/docs");
      if (!existsSync(docsDir)) return;
      mkdirSync(distDocsDir, { recursive: true });
      cpSync(docsDir, distDocsDir, { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [copyDocsToDist()],
});
