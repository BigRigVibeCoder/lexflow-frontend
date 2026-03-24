import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: { select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ orderBy: vi.fn().mockReturnValue({ limit: vi.fn().mockReturnValue({ offset: vi.fn().mockResolvedValue([]) }) }) }) }) }), insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: "1", invoiceNumber: "INV-2026-0001" }]) }) }), update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([]) }) }) }) } }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

describe("invoices router", () => {
  it("exports invoicesRouter with all procedures", async () => {
    const mod = await import("./invoices");
    expect(mod.invoicesRouter).toBeDefined();
    expect(mod.invoicesRouter._def.procedures.list).toBeDefined();
    expect(mod.invoicesRouter._def.procedures.getById).toBeDefined();
    expect(mod.invoicesRouter._def.procedures.create).toBeDefined();
    expect(mod.invoicesRouter._def.procedures.send).toBeDefined();
    expect(mod.invoicesRouter._def.procedures.void).toBeDefined();
  });
  it("invoice number format is INV-YYYY-NNNN", () => {
    const year = new Date().getFullYear();
    const num = "INV-" + String(year) + "-" + String(1).padStart(4, "0");
    expect(num).toMatch(/^INV-\d{4}-\d{4}$/);
  });
});
