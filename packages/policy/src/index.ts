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
