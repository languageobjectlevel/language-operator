import { rm } from "node:fs/promises";

const targets = ["coverage", "dist", "apps/operator-api/dist", "packages/contracts/dist", "packages/domain/dist", "packages/events/dist", "packages/observability/dist", "packages/policy/dist"];

await Promise.all(targets.map(async (target) => {
  await rm(target, { recursive: true, force: true });
}));

console.log("Clean completed");
