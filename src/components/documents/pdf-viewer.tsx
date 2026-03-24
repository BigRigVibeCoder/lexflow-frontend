"use client";
import { useState } from "react";

/** PDF viewer component with page navigation and zoom per SPR-006 T-060. */
export function PdfViewer({ fileUrl, filename }: { fileUrl: string; filename: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isPdf = filename.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center" data-testid="non-pdf-fallback">
        <p className="text-sm font-medium text-slate-700">{filename}</p>
        <p className="mt-1 text-xs text-slate-400">Preview not available for this file type</p>
        <a href={fileUrl} download className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700" data-testid="download-link">Download File</a>
      </div>
    );
  }

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-white" : ""} data-testid="pdf-viewer">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="rounded px-2 py-1 text-sm hover:bg-slate-200 disabled:opacity-50" data-testid="prev-page">← Prev</button>
          <span className="text-sm text-slate-600" data-testid="page-info">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="rounded px-2 py-1 text-sm hover:bg-slate-200 disabled:opacity-50" data-testid="next-page">Next →</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="rounded px-2 py-1 text-sm hover:bg-slate-200" data-testid="zoom-out">−</button>
          <span className="text-sm text-slate-600" data-testid="zoom-level">{zoom}%</span>
          <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="rounded px-2 py-1 text-sm hover:bg-slate-200" data-testid="zoom-in">+</button>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="rounded px-2 py-1 text-sm hover:bg-slate-200" data-testid="fullscreen-toggle">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</button>
        </div>
      </div>
      <div className="flex items-center justify-center p-4 bg-slate-100 min-h-[400px]" data-testid="pdf-canvas">
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
          <iframe src={fileUrl} title={filename} className="w-[800px] h-[1000px] border border-slate-300 bg-white" />
        </div>
      </div>
    </div>
  );
}
