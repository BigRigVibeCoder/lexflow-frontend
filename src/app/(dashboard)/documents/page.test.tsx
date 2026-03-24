import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DocumentListPage from "./page";

describe("DocumentListPage", () => {
  it("renders heading", () => { render(<DocumentListPage />); expect(screen.getByText("Documents")).toBeDefined(); });
  it("renders search input", () => { render(<DocumentListPage />); expect(screen.getByTestId("doc-search")).toBeDefined(); });
  it("renders category filter", () => { render(<DocumentListPage />); expect(screen.getByTestId("category-filter")).toBeDefined(); });
  it("renders table", () => { render(<DocumentListPage />); expect(screen.getByTestId("document-table")).toBeDefined(); });
});
