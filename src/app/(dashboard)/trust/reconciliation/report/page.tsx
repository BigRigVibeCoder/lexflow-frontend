"use client";

export default function ThreeWayReportPage() {
  return (
    <div data-testid="three-way-report-page">
      <h1 className="text-2xl font-bold text-slate-900">Three-Way Reconciliation Report</h1>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center" data-testid="bank-balance"><p className="text-sm font-medium text-slate-500">Bank Balance</p><p className="mt-2 text-2xl font-bold text-slate-900">&mdash;</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center" data-testid="book-balance"><p className="text-sm font-medium text-slate-500">Book Balance</p><p className="mt-2 text-2xl font-bold text-slate-900">&mdash;</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center" data-testid="ledger-total"><p className="text-sm font-medium text-slate-500">Client Ledger Total</p><p className="mt-2 text-2xl font-bold text-slate-900">&mdash;</p></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="bank-book-variance"><p className="text-sm font-medium text-slate-500">Bank → Book Variance</p><p className="mt-1 text-xl font-bold text-slate-900">&mdash;</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="book-ledger-variance"><p className="text-sm font-medium text-slate-500">Book → Ledger Variance</p><p className="mt-1 text-xl font-bold text-slate-900">&mdash;</p></div>
      </div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6" data-testid="ledger-breakdown">
        <h2 className="font-semibold text-slate-900">Client Ledger Breakdown</h2>
        <p className="mt-2 text-sm text-slate-400">Breakdown loaded via tRPC trust.threeWayReport</p>
      </div>
    </div>
  );
}
