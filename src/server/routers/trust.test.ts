import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));
vi.mock("@/lib/trust-client", () => ({
  trustClient: {
    listAccounts: vi.fn(), getAccount: vi.fn(), createAccount: vi.fn(),
    listLedgers: vi.fn(), createLedger: vi.fn(),
    recordDeposit: vi.fn(), recordDisbursement: vi.fn(), recordTransfer: vi.fn(),
    recordFeeTransfer: vi.fn(), voidEntry: vi.fn(),
    listTransactions: vi.fn(), getTransaction: vi.fn(),
    importBankStatement: vi.fn(), startReconciliation: vi.fn(),
    getReconciliation: vi.fn(), getThreeWayReport: vi.fn(),
  },
  CircuitBreakerError: class CircuitBreakerError extends Error { constructor(m: string) { super(m); this.name = "CircuitBreakerError"; } },
}));

describe("trust router", () => {
  it("exports trustRouter with all procedures", async () => {
    const mod = await import("./trust");
    expect(mod.trustRouter).toBeDefined();
    expect(mod.trustRouter._def.procedures.listAccounts).toBeDefined();
    expect(mod.trustRouter._def.procedures.getAccount).toBeDefined();
    expect(mod.trustRouter._def.procedures.createAccount).toBeDefined();
    expect(mod.trustRouter._def.procedures.deposit).toBeDefined();
    expect(mod.trustRouter._def.procedures.disburse).toBeDefined();
    expect(mod.trustRouter._def.procedures.transfer).toBeDefined();
    expect(mod.trustRouter._def.procedures.voidEntry).toBeDefined();
    expect(mod.trustRouter._def.procedures.listTransactions).toBeDefined();
    expect(mod.trustRouter._def.procedures.importStatement).toBeDefined();
    expect(mod.trustRouter._def.procedures.startReconciliation).toBeDefined();
    expect(mod.trustRouter._def.procedures.threeWayReport).toBeDefined();
  });
});
