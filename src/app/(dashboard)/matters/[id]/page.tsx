"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

const TABS = ["Overview", "Team", "Deadlines", "Medical", "Documents", "Time", "Billing", "Trust", "Contacts"];

export default function MatterDetailPage() {
  const params = useParams();
  const [tab, setTab] = useState("Overview");
  return (
    <div data-testid="matter-detail-page">
      <h1 className="text-2xl font-bold text-slate-900">Matter Detail</h1>
      <p className="text-sm text-slate-500">Matter ID: {params.id}</p>
      <div className="mt-4 flex gap-1 border-b border-slate-200">{TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`} data-testid={`tab-${t.toLowerCase()}`}>{t}</button>)}</div>
      <div className="mt-6" data-testid="tab-content">
        {tab === "Overview" && <div data-testid="tab-overview-content"><p className="text-sm text-slate-400">Matter overview loaded via tRPC</p></div>}
        {tab === "Team" && <div data-testid="tab-team-content"><p className="text-sm text-slate-400">Team management — see T-030</p></div>}
        {tab === "Deadlines" && <div data-testid="tab-deadlines-content"><p className="text-sm text-slate-400">Deadlines — see T-031</p></div>}
        {tab === "Medical" && <div data-testid="tab-medical-content"><p className="text-sm text-slate-400">Medical treatments — see T-032</p></div>}
        {tab === "Trust" && <div data-testid="tab-trust-content"><div className="space-y-4"><div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="matter-trust-accounts"><h3 className="font-semibold text-slate-900">Linked Trust Accounts</h3><p className="mt-2 text-sm text-slate-400">Trust accounts for this matter loaded via tRPC</p></div><div className="flex gap-2"><a href="/trust/transactions/deposit" className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700" data-testid="quick-deposit">Quick Deposit</a><a href="/trust/transactions/disburse" className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700" data-testid="quick-disburse">Quick Disburse</a></div><div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="matter-trust-balance"><p className="text-sm font-medium text-slate-500">Matter Trust Balance</p><p className="mt-1 text-2xl font-bold text-slate-900">\u2014</p></div></div></div>}
        {!["Overview","Team","Deadlines","Medical","Trust"].includes(tab) && <div data-testid="tab-placeholder"><p className="text-sm text-slate-400">{tab} tab — coming soon</p></div>}
      </div>
    </div>
  );
}
