import type { TaskSpec, TaskStatus, ExecutionRecord } from "./index.js";

const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
  created: ["running", "cancelled"],
  running: ["completed", "failed", "cancelled"],
  completed: [],
  failed: [],
  cancelled: [],
};

export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return allowedTransitions[from].includes(to);
}

export function transitionTask(task: TaskSpec, to: TaskStatus): TaskSpec {
  if (!canTransition(task.status, to)) {
    throw new Error(`Invalid task transition from ${task.status} to ${to}`);
  }
  return {
    ...task,
    status: to,
  };
}

export function startExecution(taskId: string): ExecutionRecord {
  return {
    id: crypto.randomUUID(),
    taskId,
    startedAt: new Date().toISOString(),
    status: "running",
  };
}

export function finishExecution(execution: ExecutionRecord, result: string): ExecutionRecord {
  if (execution.status !== "running") {
    throw new Error("Execution must be running before completion");
  }
  return {
    ...execution,
    status: "completed",
    completedAt: new Date().toISOString(),
    result,
  };
}
