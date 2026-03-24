import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

describe("clients router", () => {
  it("exports clientsRouter with all procedures", async () => {
    const mod = await import("./clients");
    expect(mod.clientsRouter).toBeDefined();
    expect(mod.clientsRouter._def.procedures.list).toBeDefined();
    expect(mod.clientsRouter._def.procedures.getById).toBeDefined();
    expect(mod.clientsRouter._def.procedures.create).toBeDefined();
    expect(mod.clientsRouter._def.procedures.update).toBeDefined();
    expect(mod.clientsRouter._def.procedures.deactivate).toBeDefined();
  });
});
