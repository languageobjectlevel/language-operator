import { describe, expect, it } from "vitest";
import { canTransition, transitionTask, type TaskSpec } from "./index.js";

describe("task state transitions", () => {
  it("allows created -> running transition", () => {
    expect(canTransition("created", "running")).toBe(true);
  });

  it("rejects completed -> running transition", () => {
    expect(canTransition("completed", "running")).toBe(false);
  });

  it("applies valid transition", () => {
    const task: TaskSpec = {
      id: "task-1",
      input: "run workflow",
      createdAt: new Date().toISOString(),
      status: "created",
    };

    const next = transitionTask(task, "running");
    expect(next.status).toBe("running");
  });

  it("throws on invalid transition", () => {
    const task: TaskSpec = {
      id: "task-2",
      input: "invalid flow",
      createdAt: new Date().toISOString(),
      status: "completed",
    };

    expect(() => transitionTask(task, "running")).toThrowError("Invalid task transition");
  });
});
