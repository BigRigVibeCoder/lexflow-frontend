import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), info: vi.fn(), debug: vi.fn(), error: vi.fn() } }));
vi.mock("qrcode", () => ({ toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,mock") }));

describe("mfa router", () => {
  it("exports mfaRouter with all procedures", async () => {
    const mod = await import("./mfa");
    expect(mod.mfaRouter).toBeDefined();
    expect(mod.mfaRouter._def.procedures.setupTotp).toBeDefined();
    expect(mod.mfaRouter._def.procedures.verifyTotp).toBeDefined();
    expect(mod.mfaRouter._def.procedures.disableTotp).toBeDefined();
    expect(mod.mfaRouter._def.procedures.generateRecoveryCodes).toBeDefined();
  });
});
