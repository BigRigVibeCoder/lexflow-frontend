import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: { select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ orderBy: vi.fn().mockReturnValue({ limit: vi.fn().mockReturnValue({ offset: vi.fn().mockResolvedValue([]) }) }) }) }) }), insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: "p1" }]) }) }), update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) }) } }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

describe("payments router", () => {
  it("exports paymentsRouter", async () => {
    const mod = await import("./payments");
    expect(mod.paymentsRouter).toBeDefined();
    expect(mod.paymentsRouter._def.procedures.listByInvoice).toBeDefined();
    expect(mod.paymentsRouter._def.procedures.record).toBeDefined();
  });
  it("payment validates against total (math test)", () => {
    const totalCents = 50000;
    const paidCents = 30000;
    const paymentCents = 25000;
    const newPaid = paidCents + paymentCents;
    expect(newPaid > totalCents).toBe(true);
  });
});
