import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TrustAccountListPage from "./page";

describe("TrustAccountListPage", () => {
  it("renders heading", () => { render(<TrustAccountListPage />); expect(screen.getByText("Trust Accounts")).toBeDefined(); });
  it("renders search", () => { render(<TrustAccountListPage />); expect(screen.getByTestId("account-search")).toBeDefined(); });
});
