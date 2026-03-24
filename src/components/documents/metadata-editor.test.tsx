import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MetadataEditor } from "./metadata-editor";

const doc = { id: "1", title: "Test Doc", description: "Desc", category: "other", tags: ["medical", "urgent"] };

describe("MetadataEditor", () => {
  it("renders title input", () => { render(<MetadataEditor document={doc} onSave={vi.fn()} />); expect(screen.getByTestId("edit-title")).toBeDefined(); });
  it("renders description textarea", () => { render(<MetadataEditor document={doc} onSave={vi.fn()} />); expect(screen.getByTestId("edit-description")).toBeDefined(); });
  it("renders category selector", () => { render(<MetadataEditor document={doc} onSave={vi.fn()} />); expect(screen.getByTestId("edit-category")).toBeDefined(); });
  it("renders existing tags", () => { render(<MetadataEditor document={doc} onSave={vi.fn()} />); expect(screen.getByText("medical")).toBeDefined(); expect(screen.getByText("urgent")).toBeDefined(); });
  it("renders add tag input", () => { render(<MetadataEditor document={doc} onSave={vi.fn()} />); expect(screen.getByTestId("new-tag-input")).toBeDefined(); });
  it("calls onSave on category change", () => {
    const onSave = vi.fn();
    render(<MetadataEditor document={doc} onSave={onSave} />);
    fireEvent.change(screen.getByTestId("edit-category"), { target: { value: "evidence" } });
    expect(onSave).toHaveBeenCalledWith({ category: "evidence" });
  });
});
