import { describe, it, expect, vi } from "vitest";
vi.mock("next/navigation", () => ({ useParams: () => ({ id: "test-id" }) }));
import { render, screen } from "@testing-library/react";
import ClientDetailPage from "./page";

describe("ClientDetailPage", () => {
  it("renders client detail heading", () => { render(<ClientDetailPage />); expect(screen.getByText("Client Detail")).toBeDefined(); });
  it("displays client ID from params", () => { render(<ClientDetailPage />); expect(screen.getByText(/test-id/)).toBeDefined(); });
});
