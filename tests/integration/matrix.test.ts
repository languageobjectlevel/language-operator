import { describe, expect, it } from "vitest";
import { createApp } from "../../apps/operator-api/src/app.js";

interface PolicyCase {
  name: string;
  payload: {
    inputSource: "system" | "operator" | "external";
    action: string;
    amountCents?: number;
  };
  expectedStatus: number;
  expectedOutcome?: "allow" | "deny" | "quarantine";
}

const policyCases: PolicyCase[] = [
  {
    name: "allow operator task creation action",
    payload: { inputSource: "operator", action: "task.create" },
    expectedStatus: 200,
    expectedOutcome: "allow",
  },
  {
    name: "deny external shell action",
    payload: { inputSource: "external", action: "shell.execute" },
    expectedStatus: 403,
  },
  {
    name: "quarantine operator transfer above hourly threshold",
    payload: { inputSource: "operator", action: "payment.transfer", amountCents: 1600 },
    expectedStatus: 200,
    expectedOutcome: "quarantine",
  },
  {
    name: "deny operator transfer above daily threshold",
    payload: { inputSource: "operator", action: "payment.transfer", amountCents: 12000 },
    expectedStatus: 200,
    expectedOutcome: "deny",
  },
];

describe("integration scenario matrix", () => {
  for (const testCase of policyCases) {
    it(`policy case: ${testCase.name}`, async () => {
      const app = createApp();
      const response = await app.inject({
        method: "POST",
        url: "/v1/policies/evaluate",
        payload: testCase.payload,
      });

      expect(response.statusCode).toBe(testCase.expectedStatus);

      if (testCase.expectedOutcome) {
        const body = response.json<{ outcome: string }>();
        expect(body.outcome).toBe(testCase.expectedOutcome);
      }

      await app.close();
    });
  }

  it("returns 400 for missing task input payload", async () => {
    const app = createApp();
    const response = await app.inject({
      method: "POST",
      url: "/v1/tasks",
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    await app.close();
  });

  it("returns 404 when cancelling unknown task", async () => {
    const app = createApp();
    const response = await app.inject({
      method: "POST",
      url: "/v1/tasks/unknown-task/cancel",
    });

    expect(response.statusCode).toBe(404);
    await app.close();
  });
});
