"use client";
import { useState } from "react";
import Link from "next/link";

export default function TrustAccountListPage() {
  const [search, setSearch] = useState("");
  return (
    <div data-testid="trust-accounts-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Trust Accounts</h1>
        <Link href="/trust/accounts/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">New Account</Link>
      </div>
      <div className="mt-4"><input type="text" placeholder="Search accounts..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="account-search" /></div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white" data-testid="account-table">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase"><th className="px-4 py-3">Account</th><th className="px-4 py-3">Bank</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Balance</th><th className="px-4 py-3">Ledgers</th></tr></thead>
          <tbody><tr className="text-slate-400 text-center"><td colSpan={5} className="px-4 py-8">Account data loads via tRPC</td></tr></tbody>
        </table>
      </div>
    </div>
  );
}
