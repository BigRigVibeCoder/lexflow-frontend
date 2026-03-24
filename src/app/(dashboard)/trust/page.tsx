"use client";
import Link from "next/link";

export default function TrustDashboardPage() {
  return (
    <div data-testid="trust-dashboard-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Trust Accounting</h1>
        <Link href="/trust/accounts/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">New Account</Link>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="kpi-total-balance"><p className="text-sm font-medium text-slate-500">Total Trust Balance</p><p className="mt-2 text-3xl font-bold text-slate-900">&mdash;</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="kpi-account-count"><p className="text-sm font-medium text-slate-500">Trust Accounts</p><p className="mt-2 text-3xl font-bold text-slate-900">&mdash;</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="kpi-recent-transactions"><p className="text-sm font-medium text-slate-500">Recent Transactions</p><p className="mt-2 text-3xl font-bold text-slate-900">&mdash;</p></div>
      </div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6" data-testid="account-summary">
        <h2 className="font-semibold text-slate-900">Account Summary</h2>
        <p className="mt-2 text-sm text-slate-400">Account data loads via tRPC trust.listAccounts</p>
      </div>
    </div>
  );
}
