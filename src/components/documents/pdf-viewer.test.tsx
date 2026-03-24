import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PdfViewer } from "./pdf-viewer";

describe("PdfViewer", () => {
  it("renders PDF viewer for PDF files", () => { render(<PdfViewer fileUrl="/test.pdf" filename="doc.pdf" />); expect(screen.getByTestId("pdf-viewer")).toBeDefined(); });
  it("renders navigation controls", () => { render(<PdfViewer fileUrl="/test.pdf" filename="doc.pdf" />); expect(screen.getByTestId("prev-page")).toBeDefined(); expect(screen.getByTestId("next-page")).toBeDefined(); });
  it("renders zoom controls", () => { render(<PdfViewer fileUrl="/test.pdf" filename="doc.pdf" />); expect(screen.getByTestId("zoom-out")).toBeDefined(); expect(screen.getByTestId("zoom-in")).toBeDefined(); });
  it("renders fullscreen toggle", () => { render(<PdfViewer fileUrl="/test.pdf" filename="doc.pdf" />); expect(screen.getByTestId("fullscreen-toggle")).toBeDefined(); });
  it("shows download link for non-PDF files", () => { render(<PdfViewer fileUrl="/test.docx" filename="doc.docx" />); expect(screen.getByTestId("non-pdf-fallback")).toBeDefined(); expect(screen.getByTestId("download-link")).toBeDefined(); });
  it("toggles fullscreen", () => { render(<PdfViewer fileUrl="/test.pdf" filename="doc.pdf" />); fireEvent.click(screen.getByTestId("fullscreen-toggle")); expect(screen.getByText("Exit Fullscreen")).toBeDefined(); });
});
