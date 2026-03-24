import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";

describe("DashboardPage", () => {
  it("renders KPI cards", () => { render(<DashboardPage />); expect(screen.getByTestId("kpi-active-matters")).toBeDefined(); expect(screen.getByTestId("kpi-upcoming-deadlines")).toBeDefined(); });
  it("renders recent activity", () => { render(<DashboardPage />); expect(screen.getByTestId("recent-activity")).toBeDefined(); });
  it("renders status chart", () => { render(<DashboardPage />); expect(screen.getByTestId("matter-status-chart")).toBeDefined(); });
});
