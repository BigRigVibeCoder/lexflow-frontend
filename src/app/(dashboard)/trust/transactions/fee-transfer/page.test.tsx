import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeeTransferPage from "./page";

describe("FeeTransferPage", () => {
  it("renders form", () => { render(<FeeTransferPage />); expect(screen.getByTestId("fee-ledger")).toBeDefined(); expect(screen.getByTestId("fee-amount")).toBeDefined(); });
  it("renders submit", () => { render(<FeeTransferPage />); expect(screen.getByTestId("submit-fee-transfer")).toBeDefined(); });
});
