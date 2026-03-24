import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TimeEntryPage from "./page";

describe("TimeEntryPage", () => {
  it("renders heading", () => { render(<TimeEntryPage />); expect(screen.getByText("Time Entries")).toBeDefined(); });
  it("renders timer", () => { render(<TimeEntryPage />); expect(screen.getByTestId("timer-display")).toBeDefined(); expect(screen.getByTestId("timer-toggle")).toBeDefined(); });
  it("renders entry form", () => { render(<TimeEntryPage />); expect(screen.getByTestId("time-matter")).toBeDefined(); expect(screen.getByTestId("save-time-entry")).toBeDefined(); });
  it("formats duration correctly", () => { render(<TimeEntryPage />); expect(screen.getByTestId("timer-display").textContent).toBe("00:00"); });
});
