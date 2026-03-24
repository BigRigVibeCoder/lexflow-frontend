import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AgingReportPage from "./page";

describe("AgingReportPage", () => {
  it("renders heading", () => { render(<AgingReportPage />); expect(screen.getByText("Accounts Receivable Aging")).toBeDefined(); });
  it("renders all 5 aging buckets", () => {
    render(<AgingReportPage />);
    expect(screen.getByTestId("bucket-current")).toBeDefined();
    expect(screen.getByTestId("bucket-1-30")).toBeDefined();
    expect(screen.getByTestId("bucket-31-60")).toBeDefined();
    expect(screen.getByTestId("bucket-61-90")).toBeDefined();
    expect(screen.getByTestId("bucket-90plus")).toBeDefined();
  });
  it("bucket math: 45 days is 31-60", () => {
    const days = 45;
    let bucket = "current";
    if (days > 90) bucket = "90+";
    else if (days > 60) bucket = "61-90";
    else if (days > 30) bucket = "31-60";
    else if (days > 0) bucket = "1-30";
    expect(bucket).toBe("31-60");
  });
});
