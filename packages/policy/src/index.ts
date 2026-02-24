import { PolicyEngine } from "./engine.js";
import type { BudgetWindow, PolicyDecision, PolicyInput, PolicyRule } from "./models.js";
import { DailyLimitRule, ExternalShellDenyRule, HourlyLimitRule } from "./rules/default-rules.js";

export type { BudgetWindow, PolicyDecision, PolicyInput, PolicyOutcome, PolicyRule } from "./models.js";

export function createDefaultRules(): PolicyRule[] {
  return [new ExternalShellDenyRule(), new DailyLimitRule(), new HourlyLimitRule()];
}

export function evaluatePolicy(input: PolicyInput, budget: BudgetWindow): PolicyDecision {
  const engine = new PolicyEngine(createDefaultRules());
  return engine.evaluate(input, budget);
}

export { PolicyEngine };
