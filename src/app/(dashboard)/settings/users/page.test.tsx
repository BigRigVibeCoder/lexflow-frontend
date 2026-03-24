import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UsersPage from "./page";

describe("UsersPage", () => {
  it("renders user management page", () => {
    render(<UsersPage />);
    expect(screen.getByTestId("users-page")).toBeInTheDocument();
    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByTestId("create-user-button")).toBeInTheDocument();
    expect(screen.getByTestId("users-table")).toBeInTheDocument();
  });
});
