import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ThreeWayReportPage from "./page";

describe("ThreeWayReportPage", () => {
  it("renders three balance columns", () => { render(<ThreeWayReportPage />); expect(screen.getByTestId("bank-balance")).toBeDefined(); expect(screen.getByTestId("book-balance")).toBeDefined(); expect(screen.getByTestId("ledger-total")).toBeDefined(); });
  it("renders variance cards", () => { render(<ThreeWayReportPage />); expect(screen.getByTestId("bank-book-variance")).toBeDefined(); expect(screen.getByTestId("book-ledger-variance")).toBeDefined(); });
});
