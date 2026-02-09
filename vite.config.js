import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

function getMarkdownDocs(docsDir) {
  if (!existsSync(docsDir)) return [];
  return readdirSync(docsDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .filter((fileName) => {
      const filePath = resolve(docsDir, fileName);
      return statSync(filePath).isFile();
    })
    .sort((a, b) => a.localeCompare(b));
}

function docsManifestPlugin() {
  return {
    name: "docs-manifest-plugin",
    configureServer(server) {
      server.middlewares.use("/docs/index.json", (req, res) => {
        const docsDir = resolve(process.cwd(), "docs");
        const docs = getMarkdownDocs(docsDir);
        const payload = JSON.stringify({ docs }, null, 2);
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(payload);
      });
    },
    closeBundle() {
      const docsDir = resolve(process.cwd(), "docs");
      const distDocsDir = resolve(process.cwd(), "dist/docs");
      if (!existsSync(docsDir)) return;
      mkdirSync(distDocsDir, { recursive: true });
      cpSync(docsDir, distDocsDir, { recursive: true });
      const docs = getMarkdownDocs(docsDir);
      writeFileSync(resolve(distDocsDir, "index.json"), JSON.stringify({ docs }, null, 2));
    },
  };
}

export default defineConfig({
  plugins: [docsManifestPlugin()],
});
