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

export class MetricsCollector {
  private counters = new Map<string, number>();
  private gauges = new Map<string, number>();

  increment(name: string, value = 1): void {
    this.counters.set(name, (this.counters.get(name) ?? 0) + value);
  }

  gauge(name: string, value: number): void {
    this.gauges.set(name, value);
  }

  snapshot(): { counters: Record<string, number>; gauges: Record<string, number> } {
    return {
      counters: Object.fromEntries(this.counters.entries()),
      gauges: Object.fromEntries(this.gauges.entries()),
    };
  }
}
