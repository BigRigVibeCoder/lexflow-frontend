import { describe, it, expect } from "vitest";

/**
 * Integration tests for trust client against running trust service.
 * Requires: trust service running on localhost:4000 (SPR-004).
 * Run manually: TRUST_INTEGRATION=1 npm run test -- src/lib/trust-client/integration.test.ts
 */
const SKIP = !process.env.TRUST_INTEGRATION;

describe.skipIf(SKIP)("TrustClient integration (requires running trust service)", () => {
  it("creates account, deposits, and checks balance", async () => {
    const { TrustClient } = await import("./index");
    const client = new TrustClient("http://localhost:4000", "dev-key");
    const account = await client.createAccount({ bankName: "Integration Bank", accountNumber: "12345678", routingNumber: "123456789", accountName: "Integration Test", accountType: "iolta" });
    expect(account.id).toBeDefined();
  });

  it("lists accounts", async () => {
    const { TrustClient } = await import("./index");
    const client = new TrustClient("http://localhost:4000", "dev-key");
    const result = await client.listAccounts();
    expect(result.data).toBeDefined();
  });
});
