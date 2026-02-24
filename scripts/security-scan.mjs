import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const denyPatterns = [/ghp_[A-Za-z0-9]{20,}/, /-----BEGIN (RSA|EC|DSA) PRIVATE KEY-----/];

async function scanDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await scanDir(fullPath);
    } else if (/\.(ts|js|mjs|json|md|yml|yaml)$/i.test(entry.name)) {
      const content = await readFile(fullPath, "utf8");
      for (const pattern of denyPatterns) {
        if (pattern.test(content)) {
          console.error(`Security scan failed on ${fullPath}: matched ${pattern}`);
          process.exit(1);
        }
      }
    }
  }
}

await scanDir(process.cwd());
console.log("Security scan passed");
