import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), info: vi.fn(), debug: vi.fn(), error: vi.fn() } }));

describe("tRPC setup", () => {
  it("exports core utilities", async () => {
    const mod = await import("./trpc");
    expect(mod.router).toBeDefined();
    expect(mod.publicProcedure).toBeDefined();
    expect(mod.protectedProcedure).toBeDefined();
    expect(mod.permissionProcedure).toBeDefined();
    expect(typeof mod.permissionProcedure).toBe("function");
  });
});
