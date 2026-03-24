import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MatterDeadlinesPage from "./page";

describe("MatterDeadlinesPage", () => {
  it("renders form fields", () => { render(<MatterDeadlinesPage />); expect(screen.getByTestId("deadline-title")).toBeDefined(); expect(screen.getByTestId("deadline-date")).toBeDefined(); });
  it("renders add button", () => { render(<MatterDeadlinesPage />); expect(screen.getByTestId("add-deadline-btn")).toBeDefined(); });
});
