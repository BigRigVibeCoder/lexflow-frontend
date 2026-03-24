import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

describe("treatments router", () => {
  it("exports treatmentsRouter with all procedures", async () => {
    const mod = await import("./treatments");
    expect(mod.treatmentsRouter).toBeDefined();
    expect(mod.treatmentsRouter._def.procedures.list).toBeDefined();
    expect(mod.treatmentsRouter._def.procedures.add).toBeDefined();
    expect(mod.treatmentsRouter._def.procedures.update).toBeDefined();
    expect(mod.treatmentsRouter._def.procedures.remove).toBeDefined();
  });
});
