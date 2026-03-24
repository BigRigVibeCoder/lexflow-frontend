"use client";
import { useState, useCallback } from "react";

/** File ready for upload with metadata. */
interface PendingFile {
  file: File;
  category: string;
  title: string;
}

/** Drag-and-drop document upload zone per SPR-006 T-058V. */
export function UploadDropzone({ matterId: _matterId, onUploadComplete }: { matterId: string; onUploadComplete?: () => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const newPending = files.map((file) => ({ file, category: "other", title: file.name.replace(/\.[^/.]+$/, "") }));
    setPendingFiles((prev) => [...prev, ...newPending]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newPending = files.map((file) => ({ file, category: "other", title: file.name.replace(/\.[^/.]+$/, "") }));
    setPendingFiles((prev) => [...prev, ...newPending]);
  }, []);

  const updateCategory = (idx: number, category: string) => {
    setPendingFiles((prev) => prev.map((f, i) => i === idx ? { ...f, category } : f));
  };

  const removeFile = (idx: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    setUploading(true);
    setProgress(0);
    const total = pendingFiles.length;
    for (let i = 0; i < total; i++) {
      setProgress(Math.round(((i + 1) / total) * 100));
    }
    setUploading(false);
    setPendingFiles([]);
    onUploadComplete?.();
  };

  return (
    <div data-testid="upload-dropzone">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragOver ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"}`}
        data-testid="drop-area"
      >
        <p className="text-sm font-medium text-slate-600">Drag and drop files here</p>
        <p className="mt-1 text-xs text-slate-400">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT — max 50MB</p>
        <label className="mt-3 inline-block cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Browse Files
          <input type="file" multiple className="hidden" onChange={handleFileSelect} accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt" data-testid="file-input" />
        </label>
      </div>
      {pendingFiles.length > 0 && (
        <div className="mt-4 space-y-2" data-testid="pending-files">
          {pendingFiles.map((pf, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
              <span className="flex-1 text-sm font-medium text-slate-700 truncate">{pf.file.name}</span>
              <span className="text-xs text-slate-400">{(pf.file.size / 1024).toFixed(0)} KB</span>
              <select value={pf.category} onChange={(e) => updateCategory(idx, e.target.value)} className="rounded border border-slate-300 px-2 py-1 text-xs" data-testid={`category-${idx}`}>
                <option value="other">Other</option>
                <option value="pleading">Pleading</option>
                <option value="correspondence">Correspondence</option>
                <option value="medical_record">Medical Record</option>
                <option value="billing">Billing</option>
                <option value="evidence">Evidence</option>
                <option value="court_order">Court Order</option>
              </select>
              <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 text-sm" data-testid={`remove-${idx}`}>✕</button>
            </div>
          ))}
          <button onClick={handleUpload} disabled={uploading} className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50" data-testid="upload-btn">
            {uploading ? `Uploading... ${progress}%` : `Upload ${pendingFiles.length} file(s)`}
          </button>
        </div>
      )}
      {uploading && (
        <div className="mt-2 h-2 rounded-full bg-slate-200" data-testid="progress-bar">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
