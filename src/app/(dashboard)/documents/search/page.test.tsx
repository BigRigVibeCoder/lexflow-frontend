import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DocumentSearchPage from "./page";

describe("DocumentSearchPage", () => {
  it("renders heading", () => { render(<DocumentSearchPage />); expect(screen.getByText("Document Search")).toBeDefined(); });
  it("renders search input", () => { render(<DocumentSearchPage />); expect(screen.getByTestId("global-search-input")).toBeDefined(); });
  it("shows empty state", () => { render(<DocumentSearchPage />); expect(screen.getByText(/Enter a search term/)).toBeDefined(); });
  it("shows search query text", () => {
    render(<DocumentSearchPage />);
    fireEvent.change(screen.getByTestId("global-search-input"), { target: { value: "medical" } });
    expect(screen.getByText(/medical/)).toBeDefined();
  });
});
