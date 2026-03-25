import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: { select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ orderBy: vi.fn().mockReturnValue({ limit: vi.fn().mockReturnValue({ offset: vi.fn().mockResolvedValue([]) }) }) }) }) }), insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: "1" }]) }) }), delete: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([]) }) }) } }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

describe("expense entries router", () => {
  it("exports expenseEntriesRouter", async () => {
    const mod = await import("./expense-entries");
    expect(mod.expenseEntriesRouter).toBeDefined();
    expect(mod.expenseEntriesRouter._def.procedures.list).toBeDefined();
    expect(mod.expenseEntriesRouter._def.procedures.create).toBeDefined();
    expect(mod.expenseEntriesRouter._def.procedures.delete).toBeDefined();
  });
});
