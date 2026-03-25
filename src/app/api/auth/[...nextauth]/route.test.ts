import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("next-auth", () => ({ default: vi.fn(() => vi.fn()) }));

describe("NextAuth route handler", () => {
  it("exports GET and POST handlers", async () => {
    const mod = await import("./route");
    expect(mod.GET).toBeDefined();
    expect(mod.POST).toBeDefined();
  });
});
