import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue({ user: { id: "1", name: "Test", role: "owner" } }) }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

describe("DashboardLayout", () => {
  it("module is importable", async () => {
    const mod = await import("./layout");
    expect(mod.default).toBeDefined();
  });
});
