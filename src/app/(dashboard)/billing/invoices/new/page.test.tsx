import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InvoiceWizardPage from "./page";

describe("InvoiceWizardPage", () => {
  it("renders wizard", () => { render(<InvoiceWizardPage />); expect(screen.getByText("Create Invoice")).toBeDefined(); });
  it("renders unbilled sections", () => { render(<InvoiceWizardPage />); expect(screen.getByTestId("unbilled-time")).toBeDefined(); });
  it("renders flat fee", () => { render(<InvoiceWizardPage />); expect(screen.getByTestId("flat-fee-section")).toBeDefined(); });
});
