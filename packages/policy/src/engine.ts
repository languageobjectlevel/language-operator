import type { BudgetWindow, PolicyDecision, PolicyInput, PolicyRule } from "./models.js";

export class PolicyEngine {
  constructor(private readonly rules: PolicyRule[]) {}

  evaluate(input: PolicyInput, budget: BudgetWindow): PolicyDecision {
    for (const rule of this.rules) {
      const decision = rule.evaluate(input, budget);
      if (decision) {
        return decision;
      }
    }

    return {
      outcome: "allow",
      reasonCode: "POLICY_ALLOW",
      message: "Policy evaluation passed",
      timestamp: new Date().toISOString(),
    };
  }
}
