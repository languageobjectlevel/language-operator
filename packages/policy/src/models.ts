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

export interface PolicyRule {
  id: string;
  evaluate(input: PolicyInput, budget: BudgetWindow): PolicyDecision | null;
}
