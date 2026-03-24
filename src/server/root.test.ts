import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), info: vi.fn(), debug: vi.fn(), error: vi.fn() } }));

describe("root router", () => {
  it("exports appRouter", async () => {
    const mod = await import("./root");
    expect(mod.appRouter).toBeDefined();
    expect(mod.appRouter._def).toBeDefined();
  });
});
