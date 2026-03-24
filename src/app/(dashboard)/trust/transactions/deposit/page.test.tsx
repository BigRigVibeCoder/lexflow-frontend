import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DepositPage from "./page";

describe("DepositPage", () => {
  it("renders form", () => { render(<DepositPage />); expect(screen.getByTestId("deposit-amount")).toBeDefined(); expect(screen.getByTestId("payor-name")).toBeDefined(); });
  it("renders submit", () => { render(<DepositPage />); expect(screen.getByTestId("submit-deposit")).toBeDefined(); });
});
