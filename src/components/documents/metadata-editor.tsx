"use client";
import React, { useState } from "react";

/** Document metadata for editing. */
interface DocumentMeta {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}

/** Inline metadata editor with auto-save per SPR-006 T-061. */
export function MetadataEditor({ document, onSave }: { document: DocumentMeta; onSave: (updates: Partial<DocumentMeta>) => void }) {
  const [title, setTitle] = useState(document.title);
  const [description, setDescription] = useState(document.description);
  const [category, setCategory] = useState(document.category);
  const [tags, setTags] = useState(document.tags);
  const [newTag, setNewTag] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSave({ title: newTitle });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 800);
    setSaveStatus("saving");
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updated = [...tags, newTag.trim()];
      setTags(updated);
      onSave({ tags: updated });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    onSave({ tags: updated });
  };

  return (
    <div className="space-y-4" data-testid="metadata-editor">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Document Details</h3>
        {saveStatus === "saving" && <span className="text-xs text-amber-600" data-testid="save-saving">Saving...</span>}
        {saveStatus === "saved" && <span className="text-xs text-green-600" data-testid="save-saved">Saved</span>}
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Title</label>
        <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="edit-title" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Description</label>
        <textarea value={description} onChange={(e) => { setDescription(e.target.value); onSave({ description: e.target.value }); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" rows={3} data-testid="edit-description" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Category</label>
        <select value={category} onChange={(e) => { setCategory(e.target.value); onSave({ category: e.target.value }); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="edit-category">
          <option value="other">Other</option><option value="pleading">Pleading</option><option value="correspondence">Correspondence</option><option value="medical_record">Medical Record</option><option value="billing">Billing</option><option value="evidence">Evidence</option><option value="court_order">Court Order</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Tags</label>
        <div className="mt-1 flex flex-wrap gap-1" data-testid="tag-list">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-600" data-testid={`remove-tag-${tag}`}>×</button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()} className="flex-1 rounded-lg border border-slate-300 px-3 py-1 text-sm" placeholder="Add tag..." data-testid="new-tag-input" />
          <button onClick={addTag} className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700" data-testid="add-tag-btn">Add</button>
        </div>
      </div>
    </div>
  );
}
