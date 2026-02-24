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
    const created = createResponse.json<{ id: string; executionId: string }>();

    const getResponse = await app.inject({
      method: "GET",
      url: `/v1/tasks/${created.id}`,
    });

    expect(getResponse.statusCode).toBe(200);

    const executionResponse = await app.inject({
      method: "GET",
      url: `/v1/executions/${created.executionId}`,
    });

    expect(executionResponse.statusCode).toBe(200);
    await app.close();
  });

  it("returns 400 for invalid task payload", async () => {
    const app = createApp();
    const response = await app.inject({
      method: "POST",
      url: "/v1/tasks",
      payload: { input: "" },
    });

    expect(response.statusCode).toBe(400);
    await app.close();
  });

  it("handles missing task and execution routes", async () => {
    const app = createApp();

    const missingTask = await app.inject({
      method: "GET",
      url: "/v1/tasks/not-found",
    });

    const missingExecution = await app.inject({
      method: "GET",
      url: "/v1/executions/not-found",
    });

    expect(missingTask.statusCode).toBe(404);
    expect(missingExecution.statusCode).toBe(404);
    await app.close();
  });

  it("supports task cancellation and idempotent repeated cancel", async () => {
    const app = createApp();
    const created = await app.inject({
      method: "POST",
      url: "/v1/tasks",
      payload: { input: "Cancel this task" },
    });

    const task = created.json<{ id: string }>();

    const firstCancel = await app.inject({
      method: "POST",
      url: `/v1/tasks/${task.id}/cancel`,
    });

    const secondCancel = await app.inject({
      method: "POST",
      url: `/v1/tasks/${task.id}/cancel`,
    });

    expect(firstCancel.statusCode).toBe(200);
    expect(secondCancel.statusCode).toBe(200);
    await app.close();
  });

  it("evaluates policy and validates payload", async () => {
    const app = createApp();

    const deniedResponse = await app.inject({
      method: "POST",
      url: "/v1/policies/evaluate",
      payload: {
        inputSource: "external",
        action: "shell.execute",
      },
    });

    const invalidResponse = await app.inject({
      method: "POST",
      url: "/v1/policies/evaluate",
      payload: {
        inputSource: "unknown",
        action: "shell.execute",
      },
    });

    expect(deniedResponse.statusCode).toBe(200);
    const decision = deniedResponse.json<{ outcome: string }>();
    expect(decision.outcome).toBe("deny");
    expect(invalidResponse.statusCode).toBe(400);

    await app.close();
  });

  it("returns health probes", async () => {
    const app = createApp();

    const liveness = await app.inject({ method: "GET", url: "/v1/health/liveness" });
    const readiness = await app.inject({ method: "GET", url: "/v1/health/readiness" });

    expect(liveness.statusCode).toBe(200);
    expect(readiness.statusCode).toBe(200);

    await app.close();
  });
});
