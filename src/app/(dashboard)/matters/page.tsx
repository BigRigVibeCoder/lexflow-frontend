"use client";
import { useState } from "react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  intake: "bg-blue-100 text-blue-700", pre_litigation: "bg-yellow-100 text-yellow-700",
  litigation: "bg-orange-100 text-orange-700", discovery: "bg-purple-100 text-purple-700",
  trial: "bg-red-100 text-red-700", settlement: "bg-green-100 text-green-700",
  closed: "bg-slate-100 text-slate-500", archived: "bg-slate-100 text-slate-400",
};

export default function MatterListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  return (
    <div data-testid="matter-list-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Matters</h1>
        <Link href="/matters/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">New Matter</Link>
      </div>
      <div className="mt-4 flex gap-3">
        <input type="text" placeholder="Search matters..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="matter-search" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="status-filter">
          <option value="">All Statuses</option>
          {Object.keys(STATUS_COLORS).map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white" data-testid="matter-table">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase"><th className="px-4 py-3">Matter #</th><th className="px-4 py-3">Client</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">SOL Date</th></tr></thead>
          <tbody><tr className="text-slate-400 text-center"><td colSpan={5} className="px-4 py-8">Matter data loads via tRPC</td></tr></tbody>
        </table>
      </div>
    </div>
  );
}
