import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), info: vi.fn(), debug: vi.fn(), error: vi.fn() } }));

describe("auth router", () => {
  it("exports authRouter with all procedures", async () => {
    const mod = await import("./auth");
    expect(mod.authRouter).toBeDefined();
    expect(mod.authRouter._def.procedures.me).toBeDefined();
    expect(mod.authRouter._def.procedures.listUsers).toBeDefined();
    expect(mod.authRouter._def.procedures.createUser).toBeDefined();
    expect(mod.authRouter._def.procedures.updateUser).toBeDefined();
    expect(mod.authRouter._def.procedures.deactivateUser).toBeDefined();
  });
});
