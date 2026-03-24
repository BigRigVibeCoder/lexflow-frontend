import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

describe("deadlines router", () => {
  it("exports deadlinesRouter with all procedures", async () => {
    const mod = await import("./deadlines");
    expect(mod.deadlinesRouter).toBeDefined();
    expect(mod.deadlinesRouter._def.procedures.add).toBeDefined();
    expect(mod.deadlinesRouter._def.procedures.complete).toBeDefined();
    expect(mod.deadlinesRouter._def.procedures.listByMatter).toBeDefined();
    expect(mod.deadlinesRouter._def.procedures.listUpcoming).toBeDefined();
    expect(mod.deadlinesRouter._def.procedures.listOverdue).toBeDefined();
  });
});
