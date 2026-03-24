import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MatterListPage from "./page";

describe("MatterListPage", () => {
  it("renders heading", () => { render(<MatterListPage />); expect(screen.getByText("Matters")).toBeDefined(); });
  it("renders search and filter", () => { render(<MatterListPage />); expect(screen.getByTestId("matter-search")).toBeDefined(); expect(screen.getByTestId("status-filter")).toBeDefined(); });
});
