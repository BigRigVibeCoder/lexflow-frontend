import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

describe("contacts router", () => {
  it("exports contactsRouter with all procedures", async () => {
    const mod = await import("./contacts");
    expect(mod.contactsRouter).toBeDefined();
    expect(mod.contactsRouter._def.procedures.list).toBeDefined();
    expect(mod.contactsRouter._def.procedures.getById).toBeDefined();
    expect(mod.contactsRouter._def.procedures.create).toBeDefined();
    expect(mod.contactsRouter._def.procedures.update).toBeDefined();
    expect(mod.contactsRouter._def.procedures.linkToMatter).toBeDefined();
    expect(mod.contactsRouter._def.procedures.unlinkFromMatter).toBeDefined();
    expect(mod.contactsRouter._def.procedures.listByMatter).toBeDefined();
  });
});
