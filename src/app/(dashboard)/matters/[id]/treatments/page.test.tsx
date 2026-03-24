import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MatterTreatmentsPage from "./page";

describe("MatterTreatmentsPage", () => {
  it("renders total bills", () => { render(<MatterTreatmentsPage />); expect(screen.getByTestId("total-bills")).toBeDefined(); });
  it("renders add button", () => { render(<MatterTreatmentsPage />); expect(screen.getByTestId("add-treatment-btn")).toBeDefined(); });
});
