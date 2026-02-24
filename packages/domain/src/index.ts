export type TaskStatus = "created" | "running" | "completed" | "failed" | "cancelled";

export interface TaskSpec {
  id: string;
  input: string;
  createdAt: string;
  status: TaskStatus;
}

export interface ExecutionRecord {
  id: string;
  taskId: string;
  startedAt: string;
  completedAt?: string;
  status: TaskStatus;
  result?: string;
  error?: string;
}
