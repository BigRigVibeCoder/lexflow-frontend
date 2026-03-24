import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import UserDetailPage from "./page";

vi.mock("next/navigation", () => ({ useParams: () => ({ id: "test-uuid" }) }));

describe("UserDetailPage", () => {
  it("renders user detail form", () => {
    render(<UserDetailPage />);
    expect(screen.getByTestId("user-detail-page")).toBeInTheDocument();
    expect(screen.getByTestId("user-role-select")).toBeInTheDocument();
    expect(screen.getByTestId("save-user-button")).toBeInTheDocument();
    expect(screen.getByTestId("deactivate-user-button")).toBeInTheDocument();
  });
});
