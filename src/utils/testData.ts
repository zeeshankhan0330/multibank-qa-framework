/**
 * Generates a unique test email per run/worker to avoid collisions when
 * specs execute in parallel (fullyParallel: true in playwright.config.ts).
 * Using timestamp + worker-scoped random suffix rather than a fixed
 * fixture email is what makes @regression safe to run concurrently
 * against a shared staging environment.
 */
export function generateTestEmail(prefix = 'qa.automation'): string {
  const uniqueSuffix = `${Date.now()}.${Math.floor(Math.random() * 10_000)}`;
  return `${prefix}+${uniqueSuffix}@multibank-test.invalid`;
}

export function generateStrongPassword(): string {
  return `Qa!${Math.random().toString(36).slice(2, 10)}Aa1`;
}
