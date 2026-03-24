import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }) }) }),
    update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([]) }) }) }),
  },
}));
vi.mock("@/lib/db/schema", () => ({
  users: { id: "id", email: "email", failedLoginCount: "failedLoginCount", lockedUntil: "lockedUntil", lastLoginAt: "lastLoginAt", status: "status", passwordHash: "passwordHash", fullName: "fullName", role: "role", totpEnabled: "totpEnabled" },
}));
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), info: vi.fn(), debug: vi.fn(), error: vi.fn() } }));

describe("auth module", () => {
  it("module loads without error", async () => {
    const mod = await import("./auth");
    expect(mod).toBeDefined();
  });
});
