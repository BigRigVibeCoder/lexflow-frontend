import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NewClientPage from "./page";

describe("NewClientPage", () => {
  it("renders form fields", () => { render(<NewClientPage />); expect(screen.getByTestId("firstName")).toBeDefined(); expect(screen.getByTestId("lastName")).toBeDefined(); });
  it("renders submit button", () => { render(<NewClientPage />); expect(screen.getByTestId("submit-client")).toBeDefined(); });
});
