import { describe, it, expect } from "vitest";
import { documents, documentAccessLog, documentCategoryEnum, documentAccessActionEnum } from "./documents";

describe("documents schema", () => {
  it("documents table has required columns", () => {
    const cols = Object.keys(documents);
    expect(cols).toContain("id");
    expect(cols).toContain("matterId");
    expect(cols).toContain("title");
    expect(cols).toContain("originalFilename");
    expect(cols).toContain("storedFilename");
    expect(cols).toContain("mimeType");
    expect(cols).toContain("sizeBytes");
    expect(cols).toContain("category");
    expect(cols).toContain("tags");
    expect(cols).toContain("isDeleted");
  });
  it("access log has required columns", () => {
    const cols = Object.keys(documentAccessLog);
    expect(cols).toContain("documentId");
    expect(cols).toContain("userId");
    expect(cols).toContain("action");
  });
  it("category enum has all values", () => {
    expect(documentCategoryEnum.enumValues).toContain("medical_record");
    expect(documentCategoryEnum.enumValues).toContain("pleading");
    expect(documentCategoryEnum.enumValues).toHaveLength(7);
  });
  it("access action enum has all values", () => {
    expect(documentAccessActionEnum.enumValues).toEqual(["view", "download", "delete"]);
  });
});
