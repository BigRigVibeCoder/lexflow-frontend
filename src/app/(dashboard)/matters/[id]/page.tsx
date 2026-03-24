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
        {tab === "Trust" && <div data-testid="tab-trust-content"><div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center"><p className="font-medium text-amber-700">Coming in SPR-005</p><p className="mt-1 text-sm text-amber-600">Trust accounting integration is scheduled for Sprint 5.</p></div></div>}
        {!["Overview","Team","Deadlines","Medical","Trust"].includes(tab) && <div data-testid="tab-placeholder"><p className="text-sm text-slate-400">{tab} tab — coming soon</p></div>}
      </div>
    </div>
  );
}
