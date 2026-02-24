import type { BudgetWindow, PolicyDecision, PolicyInput, PolicyRule } from "../models.js";

function decision(
  outcome: PolicyDecision["outcome"],
  reasonCode: string,
  message: string,
): PolicyDecision {
  return {
    outcome,
    reasonCode,
    message,
    timestamp: new Date().toISOString(),
  };
}

export class ExternalShellDenyRule implements PolicyRule {
  readonly id = "external-shell-deny";

  evaluate(input: PolicyInput): PolicyDecision | null {
    if (input.inputSource === "external" && input.action.toLowerCase().includes("shell")) {
      return decision(
        "deny",
        "EXTERNAL_SHELL_DENIED",
        "External shell actions are blocked by default policy",
      );
    }
    return null;
  }
}

export class DailyLimitRule implements PolicyRule {
  readonly id = "daily-limit";

  evaluate(input: PolicyInput, budget: BudgetWindow): PolicyDecision | null {
    if (typeof input.amountCents === "number" && input.amountCents > budget.dailyLimitCents) {
      return decision("deny", "DAILY_LIMIT_EXCEEDED", "Requested amount exceeds daily budget window");
    }
    return null;
  }
}

export class HourlyLimitRule implements PolicyRule {
  readonly id = "hourly-limit";

  evaluate(input: PolicyInput, budget: BudgetWindow): PolicyDecision | null {
    if (typeof input.amountCents === "number" && input.amountCents > budget.hourlyLimitCents) {
      return decision(
        "quarantine",
        "HOURLY_LIMIT_REVIEW",
        "Requested amount exceeds hourly budget and needs review",
      );
    }
    return null;
  }
}
