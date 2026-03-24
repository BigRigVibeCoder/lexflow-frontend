"use client";

function formatCents(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

export default function BillingDashboardPage() {
  return (
    <div data-testid="billing-dashboard-page">
      <h1 className="text-2xl font-bold text-slate-900">Billing Dashboard</h1>
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="kpi-outstanding"><p className="text-sm font-medium text-slate-500">Total Outstanding</p><p className="mt-2 text-3xl font-bold text-red-600">{formatCents(0)}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="kpi-overdue"><p className="text-sm font-medium text-slate-500">Overdue</p><p className="mt-2 text-3xl font-bold text-amber-600">{formatCents(0)}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="kpi-monthly-revenue"><p className="text-sm font-medium text-slate-500">Monthly Revenue</p><p className="mt-2 text-3xl font-bold text-green-600">{formatCents(0)}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="kpi-invoices"><p className="text-sm font-medium text-slate-500">Active Invoices</p><p className="mt-2 text-3xl font-bold text-slate-900">&mdash;</p></div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="invoice-list"><h2 className="font-semibold text-slate-900">Recent Invoices</h2><p className="mt-2 text-sm text-slate-400">Invoices load via tRPC</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="revenue-chart"><h2 className="font-semibold text-slate-900">Monthly Revenue</h2><p className="mt-2 text-sm text-slate-400">Chart renders from payment data</p></div>
      </div>
    </div>
  );
}
