import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardShell } from "./dashboard-shell";

vi.mock("next-auth/react", () => ({ signOut: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));
vi.mock("next/link", () => ({ default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => <a href={href} {...props}>{children}</a> }));

describe("DashboardShell", () => {
  it("renders shell with navigation", () => {
    render(<DashboardShell user={{ name: "Test", role: "owner" }}><div data-testid="child">child</div></DashboardShell>);
    expect(screen.getByTestId("dashboard-shell")).toBeInTheDocument();
    expect(screen.getByText("LexFlow")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
  it("shows logout button", () => {
    render(<DashboardShell user={{ name: "Test", role: "owner" }}><div>c</div></DashboardShell>);
    expect(screen.getByTestId("logout")).toBeInTheDocument();
  });
});
