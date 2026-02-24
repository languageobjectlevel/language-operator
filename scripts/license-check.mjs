import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));

if (!packageJson.license || packageJson.license !== "Apache-2.0") {
  console.error("License check failed: root license must be Apache-2.0");
  process.exit(1);
}

console.log("License check passed");
