import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TrustDashboardPage from "./page";

describe("TrustDashboardPage", () => {
  it("renders heading", () => { render(<TrustDashboardPage />); expect(screen.getByText("Trust Accounting")).toBeDefined(); });
  it("renders KPI cards", () => { render(<TrustDashboardPage />); expect(screen.getByTestId("kpi-total-balance")).toBeDefined(); expect(screen.getByTestId("kpi-account-count")).toBeDefined(); });
  it("renders account summary", () => { render(<TrustDashboardPage />); expect(screen.getByTestId("account-summary")).toBeDefined(); });
});
