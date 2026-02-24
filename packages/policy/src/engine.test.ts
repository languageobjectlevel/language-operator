import { describe, expect, it } from "vitest";
import { PolicyEngine } from "./engine.js";
import type { BudgetWindow, PolicyInput, PolicyRule } from "./models.js";
import { createDefaultRules } from "./index.js";

const budget: BudgetWindow = {
  hourlyLimitCents: 500,
  dailyLimitCents: 2_000,
};

describe("policy engine", () => {
  it("returns default allow with no matching rule", () => {
    const engine = new PolicyEngine([]);
    const decision = engine.evaluate(
      { inputSource: "operator", action: "task.create" },
      budget,
    );

    expect(decision.outcome).toBe("allow");
    expect(decision.reasonCode).toBe("POLICY_ALLOW");
  });

  it("returns first matched decision from custom rules", () => {
    const customRules: PolicyRule[] = [
      {
        id: "always-deny",
        evaluate: (_input: PolicyInput) => ({
          outcome: "deny",
          reasonCode: "CUSTOM_DENY",
          message: "Denied by custom rule",
          timestamp: new Date().toISOString(),
        }),
      },
    ];

    const engine = new PolicyEngine(customRules);
    const decision = engine.evaluate(
      { inputSource: "operator", action: "task.create" },
      budget,
    );

    expect(decision.outcome).toBe("deny");
    expect(decision.reasonCode).toBe("CUSTOM_DENY");
  });

  it("ships default rules with stable ordering", () => {
    const rules = createDefaultRules();
    expect(rules.map((r) => r.id)).toEqual([
      "external-shell-deny",
      "daily-limit",
      "hourly-limit",
    ]);
  });
});
