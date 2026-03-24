import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ReconciliationPage from "./page";

describe("ReconciliationPage", () => {
  it("renders CSV upload", () => { render(<ReconciliationPage />); expect(screen.getByTestId("csv-upload")).toBeDefined(); });
  it("renders recon start form", () => { render(<ReconciliationPage />); expect(screen.getByTestId("stmt-end-date")).toBeDefined(); expect(screen.getByTestId("start-recon-btn")).toBeDefined(); });
  it("renders workspace", () => { render(<ReconciliationPage />); expect(screen.getByTestId("recon-workspace")).toBeDefined(); });
});
