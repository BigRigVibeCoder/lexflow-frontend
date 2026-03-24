import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NewMatterWizardPage from "./page";

describe("NewMatterWizardPage", () => {
  it("renders step 1", () => { render(<NewMatterWizardPage />); expect(screen.getByTestId("step-1")).toBeDefined(); });
  it("advances to step 2", () => { render(<NewMatterWizardPage />); fireEvent.click(screen.getByTestId("next-btn")); expect(screen.getByTestId("step-2")).toBeDefined(); });
  it("goes back", () => { render(<NewMatterWizardPage />); fireEvent.click(screen.getByTestId("next-btn")); fireEvent.click(screen.getByTestId("back-btn")); expect(screen.getByTestId("step-1")).toBeDefined(); });
});
