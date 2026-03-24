import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ handlers: { GET: vi.fn(), POST: vi.fn() } }));

describe("NextAuth route handler", () => {
  it("module is importable", async () => {
    const mod = await import("./route");
    expect(mod.GET).toBeDefined();
    expect(mod.POST).toBeDefined();
  });
});
