import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ClientListPage from "./page";

describe("ClientListPage", () => {
  it("renders client list heading", () => { render(<ClientListPage />); expect(screen.getByText("Clients")).toBeDefined(); });
  it("renders search input", () => { render(<ClientListPage />); expect(screen.getByTestId("client-search")).toBeDefined(); });
  it("renders new client button", () => { render(<ClientListPage />); expect(screen.getByText("New Client")).toBeDefined(); });
});
