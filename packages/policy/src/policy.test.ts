import { describe, expect, it } from "vitest";
import { evaluatePolicy, type BudgetWindow } from "./index.js";

const budget: BudgetWindow = {
  hourlyLimitCents: 500,
  dailyLimitCents: 2_000,
};

describe("policy evaluator", () => {
  it("denies external shell actions", () => {
    const decision = evaluatePolicy(
      {
        inputSource: "external",
        action: "shell.execute",
      },
      budget,
    );

    expect(decision.outcome).toBe("deny");
    expect(decision.reasonCode).toBe("EXTERNAL_SHELL_DENIED");
  });

  it("quarantines requests above hourly limit", () => {
    const decision = evaluatePolicy(
      {
        inputSource: "operator",
        action: "payment.transfer",
        amountCents: 700,
      },
      budget,
    );

    expect(decision.outcome).toBe("quarantine");
  });

  it("denies requests above daily limit", () => {
    const decision = evaluatePolicy(
      {
        inputSource: "operator",
        action: "payment.transfer",
        amountCents: 3_000,
      },
      budget,
    );

    expect(decision.outcome).toBe("deny");
    expect(decision.reasonCode).toBe("DAILY_LIMIT_EXCEEDED");
  });

  it("allows in-budget operator requests", () => {
    const decision = evaluatePolicy(
      {
        inputSource: "operator",
        action: "task.create",
      },
      budget,
    );

    expect(decision.outcome).toBe("allow");
  });
});
