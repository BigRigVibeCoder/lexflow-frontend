import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BillingDashboardPage from "./page";

describe("BillingDashboardPage", () => {
  it("renders heading", () => { render(<BillingDashboardPage />); expect(screen.getByText("Billing Dashboard")).toBeDefined(); });
  it("renders KPI cards", () => { render(<BillingDashboardPage />); expect(screen.getByTestId("kpi-outstanding")).toBeDefined(); expect(screen.getByTestId("kpi-overdue")).toBeDefined(); });
});
