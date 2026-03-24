"use client";
import { useState } from "react";

export default function FeeTransferPage() {
  const [form, setForm] = useState({ clientLedgerId: "", operatingAccountId: "", amount: "", description: "", invoiceReference: "" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div data-testid="fee-transfer-page" className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Fee Transfer to Operating</h1>
      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div><label className="text-sm font-medium text-slate-700">Client Ledger</label><input type="text" value={form.clientLedgerId} onChange={(e) => update("clientLedgerId", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="fee-ledger" /></div>
        <div><label className="text-sm font-medium text-slate-700">Operating Account</label><input type="text" value={form.operatingAccountId} onChange={(e) => update("operatingAccountId", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="operating-acct" /></div>
        <div><label className="text-sm font-medium text-slate-700">Amount</label><input type="text" value={form.amount} onChange={(e) => update("amount", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="fee-amount" placeholder="0.00" /></div>
        <div><label className="text-sm font-medium text-slate-700">Invoice Reference</label><input type="text" value={form.invoiceReference} onChange={(e) => update("invoiceReference", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="invoice-ref" /></div>
        <div><label className="text-sm font-medium text-slate-700">Description</label><textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="fee-desc" /></div>
        <button className="w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors" data-testid="submit-fee-transfer">Transfer Earned Fees</button>
      </div>
    </div>
  );
}
