export type PolicyOutcome = "allow" | "deny" | "quarantine";

export interface PolicyDecision {
  outcome: PolicyOutcome;
  reasonCode: string;
  message: string;
  timestamp: string;
}

export interface BudgetWindow {
  hourlyLimitCents: number;
  dailyLimitCents: number;
}

export interface PolicyInput {
  inputSource: "system" | "operator" | "external";
  action: string;
  amountCents?: number;
}

export function evaluatePolicy(input: PolicyInput, budget: BudgetWindow): PolicyDecision {
  const timestamp = new Date().toISOString();

  if (input.inputSource === "external" && input.action.toLowerCase().includes("shell")) {
    return {
      outcome: "deny",
      reasonCode: "EXTERNAL_SHELL_DENIED",
      message: "External shell actions are blocked by default policy",
      timestamp,
    };
  }

  if (typeof input.amountCents === "number") {
    if (input.amountCents > budget.dailyLimitCents) {
      return {
        outcome: "deny",
        reasonCode: "DAILY_LIMIT_EXCEEDED",
        message: "Requested amount exceeds daily budget window",
        timestamp,
      };
    }
    if (input.amountCents > budget.hourlyLimitCents) {
      return {
        outcome: "quarantine",
        reasonCode: "HOURLY_LIMIT_REVIEW",
        message: "Requested amount exceeds hourly budget and needs review",
        timestamp,
      };
    }
  }

  return {
    outcome: "allow",
    reasonCode: "POLICY_ALLOW",
    message: "Policy evaluation passed",
    timestamp,
  };
}
