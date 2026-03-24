import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: { select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ orderBy: vi.fn().mockReturnValue({ limit: vi.fn().mockReturnValue({ offset: vi.fn().mockResolvedValue([]) }) }) }) }) }), insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: "1" }]) }) }), update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([]) }) }) }), delete: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([]) }) }) } }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

describe("time entries router", () => {
  it("exports timeEntriesRouter with CRUD", async () => {
    const mod = await import("./time-entries");
    expect(mod.timeEntriesRouter).toBeDefined();
    expect(mod.timeEntriesRouter._def.procedures.list).toBeDefined();
    expect(mod.timeEntriesRouter._def.procedures.create).toBeDefined();
    expect(mod.timeEntriesRouter._def.procedures.update).toBeDefined();
    expect(mod.timeEntriesRouter._def.procedures.delete).toBeDefined();
  });
});
