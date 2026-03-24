"use client";
import { useState } from "react";

export default function TransferPage() {
  const [form, setForm] = useState({ fromLedgerId: "", toLedgerId: "", amount: "", description: "" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div data-testid="transfer-page" className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Transfer Between Ledgers</h1>
      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div><label className="text-sm font-medium text-slate-700">From Ledger</label><input type="text" value={form.fromLedgerId} onChange={(e) => update("fromLedgerId", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="from-ledger" placeholder="Select source ledger" /></div>
        <div><label className="text-sm font-medium text-slate-700">To Ledger</label><input type="text" value={form.toLedgerId} onChange={(e) => update("toLedgerId", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="to-ledger" placeholder="Select destination ledger" /></div>
        <div><label className="text-sm font-medium text-slate-700">Amount</label><input type="text" value={form.amount} onChange={(e) => update("amount", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="transfer-amount" placeholder="0.00" /></div>
        <div><label className="text-sm font-medium text-slate-700">Description</label><textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="transfer-desc" /></div>
        <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors" data-testid="submit-transfer">Execute Transfer</button>
      </div>
    </div>
  );
}
