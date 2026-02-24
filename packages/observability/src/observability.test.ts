import { describe, expect, it } from "vitest";
import { MetricsCollector, createLog } from "./index.js";

describe("observability utilities", () => {
  it("creates structured logs with timestamp", () => {
    const entry = createLog({
      level: "info",
      component: "test",
      message: "hello",
    });

    expect(entry.timestamp).toBeDefined();
    expect(entry.component).toBe("test");
  });

  it("tracks counters and gauges", () => {
    const metrics = new MetricsCollector();
    metrics.increment("tasks.created");
    metrics.increment("tasks.created", 2);
    metrics.gauge("queue.depth", 5);

    const snapshot = metrics.snapshot();
    expect(snapshot.counters["tasks.created"]).toBe(3);
    expect(snapshot.gauges["queue.depth"]).toBe(5);
  });
});
