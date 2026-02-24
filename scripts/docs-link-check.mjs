import { readFile, readdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";

const markdownFiles = [];

async function collect(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      await collect(fullPath);
      continue;
    }
    if (entry.name.endsWith(".md")) {
      markdownFiles.push(fullPath);
    }
  }
}

await collect(process.cwd());

const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

for (const file of markdownFiles) {
  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(linkPattern)) {
    const link = match[1];
    if (!link || link.startsWith("http://") || link.startsWith("https://") || link.startsWith("mailto:")) {
      continue;
    }
    const normalized = link.split("#")[0];
    if (!normalized) continue;
    const target = join(dirname(file), normalized);
    try {
      await stat(target);
    } catch {
      console.error(`Broken documentation link in ${file}: ${link}`);
      process.exit(1);
    }
  }
}

console.log("Documentation links validated");
