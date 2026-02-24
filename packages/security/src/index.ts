const forbiddenPatterns: RegExp[] = [
  /\brm\s+-rf\b/i,
  /\bcurl\b.*\|\s*sh/i,
  /\bwget\b.*\|\s*sh/i,
  /\bshutdown\b/i,
  /\bhalt\b/i,
  /\bmkfs\b/i,
  /\bdd\b\s+if=/i,
];

export function hasDangerousCommandPattern(input: string): boolean {
  const normalized = input.toLowerCase();
  return forbiddenPatterns.some((pattern) => pattern.test(normalized));
}

export function sanitizeUserInput(input: string): string {
  return input
    .split("")
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join("")
    .trim();
}

export function validateSafeAction(action: string): { ok: boolean; reason?: string } {
  if (hasDangerousCommandPattern(action)) {
    return {
      ok: false,
      reason: "Action contains forbidden command pattern",
    };
  }
  if (action.length > 256) {
    return {
      ok: false,
      reason: "Action exceeds maximum allowed length",
    };
  }
  return { ok: true };
}
