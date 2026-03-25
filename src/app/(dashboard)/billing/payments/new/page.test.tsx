import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PaymentRecordingPage from "./page";

describe("PaymentRecordingPage", () => {
  it("renders form", () => { render(<PaymentRecordingPage />); expect(screen.getByTestId("payment-amount")).toBeDefined(); });
  it("renders submit", () => { render(<PaymentRecordingPage />); expect(screen.getByTestId("submit-payment")).toBeDefined(); });
});
