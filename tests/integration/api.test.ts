import { describe, expect, it } from "vitest";
import { createApp } from "../../apps/operator-api/src/app.js";

describe("operator API integration", () => {
  it("creates and fetches task", async () => {
    const app = createApp();

    const createResponse = await app.inject({
      method: "POST",
      url: "/v1/tasks",
      payload: { input: "Execute pipeline" },
    });

    expect(createResponse.statusCode).toBe(201);
    const created = createResponse.json<{ id: string }>();

    const getResponse = await app.inject({
      method: "GET",
      url: `/v1/tasks/${created.id}`,
    });

    expect(getResponse.statusCode).toBe(200);
    await app.close();
  });

  it("evaluates policy route", async () => {
    const app = createApp();

    const response = await app.inject({
      method: "POST",
      url: "/v1/policies/evaluate",
      payload: {
        inputSource: "external",
        action: "shell.execute",
      },
    });

    expect(response.statusCode).toBe(200);
    const decision = response.json<{ outcome: string }>();
    expect(decision.outcome).toBe("deny");
    await app.close();
  });
});
