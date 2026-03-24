import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DisbursePage from "./page";

describe("DisbursePage", () => {
  it("renders form", () => { render(<DisbursePage />); expect(screen.getByTestId("disburse-amount")).toBeDefined(); expect(screen.getByTestId("payee-name")).toBeDefined(); });
  it("renders overdraft warning", () => { render(<DisbursePage />); expect(screen.getByTestId("overdraft-warning")).toBeDefined(); });
});
