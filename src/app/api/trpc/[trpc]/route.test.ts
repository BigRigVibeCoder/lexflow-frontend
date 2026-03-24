import { describe, it, expect, vi } from "vitest";

vi.mock("@/server/root", () => ({ appRouter: { _def: {} } }));
vi.mock("@/server/trpc", () => ({ createContext: vi.fn() }));

describe("tRPC route handler", () => {
  it("module is importable", async () => {
    const mod = await import("./route");
    expect(mod.GET).toBeDefined();
    expect(mod.POST).toBeDefined();
  });
});
