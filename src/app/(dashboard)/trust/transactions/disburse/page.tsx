"use client";
import { useState } from "react";

export default function DisbursePage() {
  const [form, setForm] = useState({ amount: "", description: "", payeeName: "", paymentMethod: "check", referenceNumber: "" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div data-testid="disburse-page" className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Record Disbursement</h1>
      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div><label className="text-sm font-medium text-slate-700">Amount</label><input type="text" value={form.amount} onChange={(e) => update("amount", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="disburse-amount" placeholder="0.00" /></div>
        <div><label className="text-sm font-medium text-slate-700">Payee Name</label><input type="text" value={form.payeeName} onChange={(e) => update("payeeName", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="payee-name" /></div>
        <div><label className="text-sm font-medium text-slate-700">Description</label><textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="disburse-desc" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium text-slate-700">Payment Method</label><select value={form.paymentMethod} onChange={(e) => update("paymentMethod", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="disburse-method"><option value="check">Check</option><option value="wire">Wire</option><option value="ach">ACH</option><option value="other">Other</option></select></div>
          <div><label className="text-sm font-medium text-slate-700">Check #</label><input type="text" value={form.referenceNumber} onChange={(e) => update("referenceNumber", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="check-number" /></div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700" data-testid="overdraft-warning">Overdraft protection: disbursement will fail if amount exceeds ledger balance.</div>
        <button className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors" data-testid="submit-disburse">Record Disbursement</button>
      </div>
    </div>
  );
}
