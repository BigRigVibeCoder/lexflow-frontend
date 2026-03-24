import { describe, it, expect, vi } from "vitest";
vi.mock("next/navigation", () => ({ useParams: () => ({ id: "test-acct" }) }));
import { render, screen } from "@testing-library/react";
import TrustAccountDetailPage from "./page";

describe("TrustAccountDetailPage", () => {
  it("renders account detail", () => { render(<TrustAccountDetailPage />); expect(screen.getByTestId("account-balance")).toBeDefined(); });
  it("renders tabs", () => { render(<TrustAccountDetailPage />); expect(screen.getByTestId("tab-ledgers")).toBeDefined(); expect(screen.getByTestId("tab-transactions")).toBeDefined(); });
});
