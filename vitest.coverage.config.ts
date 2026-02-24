import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["packages/**/*.test.ts", "tests/integration/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      include: [
        "apps/operator-api/src/app.ts",
        "packages/domain/src/**/*.ts",
        "packages/policy/src/**/*.ts",
        "packages/observability/src/**/*.ts",
      ],
      exclude: [
        "**/*.test.ts",
      ],
      reporter: ["text", "lcov", "json-summary"],
      thresholds: {
        lines: 85,
        branches: 80,
        functions: 85,
        statements: 85,
      },
    },
  },
});
