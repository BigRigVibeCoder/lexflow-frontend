import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UploadDropzone } from "./upload-dropzone";

describe("UploadDropzone", () => {
  it("renders drop area", () => { render(<UploadDropzone matterId="m1" />); expect(screen.getByTestId("drop-area")).toBeDefined(); });
  it("renders file input", () => { render(<UploadDropzone matterId="m1" />); expect(screen.getByTestId("file-input")).toBeDefined(); });
  it("shows accepted formats", () => { render(<UploadDropzone matterId="m1" />); expect(screen.getByText(/max 50MB/)).toBeDefined(); });
});
