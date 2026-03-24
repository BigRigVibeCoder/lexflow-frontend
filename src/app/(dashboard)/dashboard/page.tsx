"use client";

export default function DashboardPage() {
  return (
    <div data-testid="dashboard-page">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="kpi-active-matters"><p className="text-sm font-medium text-slate-500">Active Matters</p><p className="mt-2 text-3xl font-bold text-slate-900">—</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="kpi-upcoming-deadlines"><p className="text-sm font-medium text-slate-500">Upcoming Deadlines (7d)</p><p className="mt-2 text-3xl font-bold text-slate-900">—</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="kpi-total-clients"><p className="text-sm font-medium text-slate-500">Total Clients</p><p className="mt-2 text-3xl font-bold text-slate-900">—</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="kpi-medical-bills"><p className="text-sm font-medium text-slate-500">Total Medical Bills</p><p className="mt-2 text-3xl font-bold text-slate-900">—</p></div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="recent-activity"><h2 className="font-semibold text-slate-900">Recent Activity</h2><p className="mt-2 text-sm text-slate-400">Activity feed loads via tRPC</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="matter-status-chart"><h2 className="font-semibold text-slate-900">Matter Status</h2><p className="mt-2 text-sm text-slate-400">Status chart loads via tRPC</p></div>
      </div>
    </div>
  );
}
