import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NewTrustAccountPage from "./page";

describe("NewTrustAccountPage", () => {
  it("renders form fields", () => { render(<NewTrustAccountPage />); expect(screen.getByTestId("bank-name")).toBeDefined(); expect(screen.getByTestId("routing-number")).toBeDefined(); });
  it("renders submit", () => { render(<NewTrustAccountPage />); expect(screen.getByTestId("submit-account")).toBeDefined(); });
});
