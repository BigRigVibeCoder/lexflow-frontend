"use client";
import { useState } from "react";

export default function DocumentListPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  return (
    <div data-testid="document-list-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
      </div>
      <div className="mt-4 flex gap-3">
        <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="doc-search" />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="category-filter">
          <option value="">All Categories</option>
          <option value="pleading">Pleading</option>
          <option value="correspondence">Correspondence</option>
          <option value="medical_record">Medical Record</option>
          <option value="billing">Billing</option>
          <option value="evidence">Evidence</option>
          <option value="court_order">Court Order</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white" data-testid="document-table">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase"><th className="px-4 py-3">Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Size</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Actions</th></tr></thead>
          <tbody><tr className="text-slate-400 text-center"><td colSpan={5} className="px-4 py-8">Document data loads via tRPC documents.list</td></tr></tbody>
        </table>
      </div>
    </div>
  );
}
