import { describe, it, expect, vi } from "vitest";
vi.mock("next/navigation", () => ({ useParams: () => ({ id: "inv-1" }) }));
import { render, screen } from "@testing-library/react";
import InvoiceDetailPage from "./page";

describe("InvoiceDetailPage", () => {
  it("renders detail", () => { render(<InvoiceDetailPage />); expect(screen.getByTestId("inv-total")).toBeDefined(); });
  it("renders void button", () => { render(<InvoiceDetailPage />); expect(screen.getByTestId("void-btn")).toBeDefined(); });
  it("renders payment history", () => { render(<InvoiceDetailPage />); expect(screen.getByTestId("payment-history")).toBeDefined(); });
});
