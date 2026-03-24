import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MFAVerifyPage from "./page";

describe("MFAVerifyPage", () => {
  it("renders verification form", () => {
    render(<MFAVerifyPage />);
    expect(screen.getByTestId("mfa-verify-page")).toBeInTheDocument();
    expect(screen.getByTestId("mfa-verify-input")).toBeInTheDocument();
    expect(screen.getByTestId("mfa-verify-submit")).toBeInTheDocument();
  });
});
