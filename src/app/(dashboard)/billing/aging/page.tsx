"use client";

function formatCents(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

export default function AgingReportPage() {
  return (
    <div data-testid="aging-report-page">
      <h1 className="text-2xl font-bold text-slate-900">Accounts Receivable Aging</h1>
      <div className="mt-6 grid grid-cols-5 gap-4">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center" data-testid="bucket-current"><p className="text-xs font-medium text-green-600">Current</p><p className="mt-1 text-xl font-bold text-green-900">{formatCents(0)}</p></div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center" data-testid="bucket-1-30"><p className="text-xs font-medium text-blue-600">1-30 Days</p><p className="mt-1 text-xl font-bold text-blue-900">{formatCents(0)}</p></div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center" data-testid="bucket-31-60"><p className="text-xs font-medium text-amber-600">31-60 Days</p><p className="mt-1 text-xl font-bold text-amber-900">{formatCents(0)}</p></div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-center" data-testid="bucket-61-90"><p className="text-xs font-medium text-orange-600">61-90 Days</p><p className="mt-1 text-xl font-bold text-orange-900">{formatCents(0)}</p></div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center" data-testid="bucket-90plus"><p className="text-xs font-medium text-red-600">90+ Days</p><p className="mt-1 text-xl font-bold text-red-900">{formatCents(0)}</p></div>
      </div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white" data-testid="aging-table">
        <table className="w-full text-sm"><thead><tr className="border-b text-left text-xs font-medium text-slate-500 uppercase"><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Client/Matter</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Outstanding</th><th className="px-4 py-3">Due Date</th><th className="px-4 py-3">Age</th></tr></thead>
        <tbody><tr className="text-slate-400 text-center"><td colSpan={6} className="px-4 py-8">Aging data loads via tRPC</td></tr></tbody></table>
      </div>
    </div>
  );
}
