import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TransferPage from "./page";

describe("TransferPage", () => {
  it("renders form", () => { render(<TransferPage />); expect(screen.getByTestId("from-ledger")).toBeDefined(); expect(screen.getByTestId("to-ledger")).toBeDefined(); });
  it("renders submit", () => { render(<TransferPage />); expect(screen.getByTestId("submit-transfer")).toBeDefined(); });
});
