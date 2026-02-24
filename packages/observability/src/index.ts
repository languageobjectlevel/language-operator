export type LogLevel = "debug" | "info" | "warn" | "error";

export interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  context?: Record<string, unknown>;
}

export function createLog(entry: Omit<StructuredLog, "timestamp">): StructuredLog {
  return {
    ...entry,
    timestamp: new Date().toISOString(),
  };
}
