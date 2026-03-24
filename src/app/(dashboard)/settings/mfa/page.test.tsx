import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MFASettingsPage from "./page";

describe("MFASettingsPage", () => {
  it("renders MFA settings", () => {
    render(<MFASettingsPage />);
    expect(screen.getByTestId("mfa-settings-page")).toBeInTheDocument();
    expect(screen.getByText("Two-Factor Authentication")).toBeInTheDocument();
    expect(screen.getByTestId("mfa-enable-button")).toBeInTheDocument();
  });
});
