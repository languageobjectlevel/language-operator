import { defineConfig, defineProject } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "json-summary"],
      thresholds: {
        lines: 85,
        branches: 80,
        functions: 85,
        statements: 85,
      },
    },
  },
  projects: [
    defineProject({
      test: {
        name: "unit",
        include: ["packages/**/*.test.ts", "apps/**/*.unit.test.ts"],
      },
    }),
    defineProject({
      test: {
        name: "integration",
        include: ["tests/integration/**/*.test.ts"],
      },
    }),
  ],
});
