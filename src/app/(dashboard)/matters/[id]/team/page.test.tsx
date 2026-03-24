import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MatterTeamPage from "./page";

describe("MatterTeamPage", () => {
  it("renders team heading", () => { render(<MatterTeamPage />); expect(screen.getByText("Team Members")).toBeDefined(); });
  it("renders add member input", () => { render(<MatterTeamPage />); expect(screen.getByTestId("add-member-input")).toBeDefined(); });
});
