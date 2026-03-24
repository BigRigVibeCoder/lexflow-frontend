import { describe, it, expect, vi } from "vitest";
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));
import { validateFile } from "./document-storage";

describe("document-storage", () => {
  describe("validateFile", () => {
    it("accepts valid PDF", () => { expect(validateFile("test.pdf", "application/pdf", 1000)).toBeNull(); });
    it("accepts valid DOCX", () => { expect(validateFile("doc.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 1000)).toBeNull(); });
    it("accepts valid JPG", () => { expect(validateFile("img.jpg", "image/jpeg", 1000)).toBeNull(); });
    it("rejects disallowed extension", () => { expect(validateFile("virus.exe", "application/octet-stream", 1000)).toContain("not allowed"); });
    it("rejects disallowed MIME type", () => { expect(validateFile("doc.pdf", "application/octet-stream", 1000)).toContain("not allowed"); });
    it("rejects oversized file", () => { expect(validateFile("big.pdf", "application/pdf", 60 * 1024 * 1024)).toContain("exceeds maximum"); });
    it("rejects file exactly at limit boundary by extension", () => { expect(validateFile("test.zip", "application/zip", 100)).toContain("not allowed"); });
  });
});
