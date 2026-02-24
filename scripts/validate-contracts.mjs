import { access } from "node:fs/promises";

const requiredFiles = [
  "contracts/openapi/operator.v1.yaml",
  "contracts/asyncapi/operator.events.v1.yaml",
];

for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    console.error(`Missing contract file: ${file}`);
    process.exit(1);
  }
}

console.log("Contract files validated");
