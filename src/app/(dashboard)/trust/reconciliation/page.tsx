"use client";
import { useState } from "react";

export default function ReconciliationPage() {
  const [statementEndDate, setStatementEndDate] = useState("");
  const [statementEndBalance, setStatementEndBalance] = useState("");
  return (
    <div data-testid="reconciliation-page">
      <h1 className="text-2xl font-bold text-slate-900">Bank Reconciliation</h1>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="csv-upload">
          <h2 className="font-semibold text-slate-900">Import Bank Statement</h2>
          <p className="mt-2 text-sm text-slate-400">Upload CSV bank statement</p>
          <input type="file" accept=".csv" className="mt-3 text-sm" data-testid="csv-file-input" />
          <button className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700" data-testid="upload-csv-btn">Import Statement</button>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="recon-start">
          <h2 className="font-semibold text-slate-900">Start Reconciliation</h2>
          <div className="mt-3 space-y-3">
            <div><label className="text-sm font-medium text-slate-700">Statement End Date</label><input type="date" value={statementEndDate} onChange={(e) => setStatementEndDate(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="stmt-end-date" /></div>
            <div><label className="text-sm font-medium text-slate-700">Statement End Balance</label><input type="text" value={statementEndBalance} onChange={(e) => setStatementEndBalance(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="stmt-end-balance" placeholder="0.00" /></div>
            <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700" data-testid="start-recon-btn">Start Reconciliation</button>
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6" data-testid="recon-workspace">
        <h2 className="font-semibold text-slate-900">Reconciliation Workspace</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div data-testid="unmatched-bank"><h3 className="text-sm font-medium text-slate-700">Unmatched Bank Transactions</h3><p className="mt-2 text-sm text-slate-400">Pending items load after reconciliation starts</p></div>
          <div data-testid="unmatched-book"><h3 className="text-sm font-medium text-slate-700">Unmatched Book Entries</h3><p className="mt-2 text-sm text-slate-400">Pending items load after reconciliation starts</p></div>
        </div>
      </div>
    </div>
  );
}
