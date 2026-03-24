import { describe, it, expect, vi } from "vitest";
vi.mock("next/navigation", () => ({ useParams: () => ({ id: "test-matter" }) }));
import { render, screen, fireEvent } from "@testing-library/react";
import MatterDetailPage from "./page";

describe("MatterDetailPage", () => {
  it("renders tabs", () => { render(<MatterDetailPage />); expect(screen.getByTestId("tab-overview")).toBeDefined(); expect(screen.getByTestId("tab-team")).toBeDefined(); expect(screen.getByTestId("tab-trust")).toBeDefined(); });
  it("shows trust placeholder", () => { render(<MatterDetailPage />); fireEvent.click(screen.getByTestId("tab-trust")); expect(screen.getByText("Coming in SPR-005")).toBeDefined(); });
});
