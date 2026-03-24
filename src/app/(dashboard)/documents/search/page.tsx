"use client";
import { useState } from "react";

export default function DocumentSearchPage() {
  const [query, setQuery] = useState("");
  return (
    <div data-testid="document-search-page">
      <h1 className="text-2xl font-bold text-slate-900">Document Search</h1>
      <p className="mt-1 text-sm text-slate-500">Search across all matters</p>
      <div className="mt-4">
        <input type="text" placeholder="Search by title, filename, or description..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" data-testid="global-search-input" />
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white" data-testid="search-results">
        {query ? (
          <div className="p-4 text-sm text-slate-400">Search results for &quot;{query}&quot; load via tRPC documents.search</div>
        ) : (
          <div className="p-8 text-center text-sm text-slate-400">Enter a search term to find documents across all matters</div>
        )}
      </div>
    </div>
  );
}
