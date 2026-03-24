import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

describe("matters router", () => {
  it("exports mattersRouter with all procedures", async () => {
    const mod = await import("./matters");
    expect(mod.mattersRouter).toBeDefined();
    expect(mod.mattersRouter._def.procedures.list).toBeDefined();
    expect(mod.mattersRouter._def.procedures.getById).toBeDefined();
    expect(mod.mattersRouter._def.procedures.create).toBeDefined();
    expect(mod.mattersRouter._def.procedures.update).toBeDefined();
    expect(mod.mattersRouter._def.procedures.archive).toBeDefined();
    expect(mod.mattersRouter._def.procedures.addTeamMember).toBeDefined();
    expect(mod.mattersRouter._def.procedures.removeTeamMember).toBeDefined();
    expect(mod.mattersRouter._def.procedures.getTeam).toBeDefined();
  });
});
