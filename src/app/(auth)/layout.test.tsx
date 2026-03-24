import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AuthLayout from "./layout";

describe("AuthLayout", () => {
  it("renders children", () => {
    render(<AuthLayout><div data-testid="child">child</div></AuthLayout>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
