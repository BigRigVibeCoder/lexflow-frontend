import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: { insert: vi.fn().mockReturnValue({ values: vi.fn() }) } }));
vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn() } }));

describe("audit middleware", () => {
  it("exports writeAuditLog function", async () => {
    const mod = await import("./audit");
    expect(mod.writeAuditLog).toBeDefined();
    expect(typeof mod.writeAuditLog).toBe("function");
  });
});
