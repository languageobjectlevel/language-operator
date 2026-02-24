export interface ApiErrorContract {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
}

export interface TaskResponseContract {
  id: string;
  input: string;
  createdAt: string;
  status: "created" | "running" | "completed" | "failed" | "cancelled";
  executionId?: string;
}

export interface PolicyEvaluationContract {
  outcome: "allow" | "deny" | "quarantine";
  reasonCode: string;
  message: string;
  timestamp: string;
}
