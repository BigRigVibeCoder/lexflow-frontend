import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/db", () => ({ db: { select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ orderBy: vi.fn().mockReturnValue({ limit: vi.fn().mockReturnValue({ offset: vi.fn().mockResolvedValue([]) }) }) }) }) }), insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([]) }) }), update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([]) }) }) }) } }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));
vi.mock("@/lib/document-storage", () => ({ validateFile: vi.fn(), storeFile: vi.fn(), readFile: vi.fn() }));

describe("documents router", () => {
  it("exports documentsRouter with all procedures", async () => {
    const mod = await import("./documents");
    expect(mod.documentsRouter).toBeDefined();
    expect(mod.documentsRouter._def.procedures.list).toBeDefined();
    expect(mod.documentsRouter._def.procedures.getById).toBeDefined();
    expect(mod.documentsRouter._def.procedures.upload).toBeDefined();
    expect(mod.documentsRouter._def.procedures.update).toBeDefined();
    expect(mod.documentsRouter._def.procedures.delete).toBeDefined();
    expect(mod.documentsRouter._def.procedures.download).toBeDefined();
    expect(mod.documentsRouter._def.procedures.search).toBeDefined();
  });
});
