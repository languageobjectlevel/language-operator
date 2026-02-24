import { readFile, writeFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));

const sbom = {
  bomFormat: "CycloneDX-Lite",
  specVersion: "1.0",
  generatedAt: new Date().toISOString(),
  root: packageJson.name,
  dependencies: {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  },
};

await writeFile("sbom/sbom.json", JSON.stringify(sbom, null, 2));
console.log("SBOM generated at sbom/sbom.json");
