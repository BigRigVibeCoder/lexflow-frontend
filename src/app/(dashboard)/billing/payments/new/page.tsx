"use client";
import { useState } from "react";

export default function PaymentRecordingPage() {
  const [form, setForm] = useState({ amountCents: 0, method: "check", referenceNumber: "" });
  const update = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div data-testid="payment-recording-page" className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Record Payment</h1>
      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div><label className="text-sm font-medium text-slate-700">Invoice</label><select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="payment-invoice"><option value="">Select invoice...</option></select></div>
        <div><label className="text-sm font-medium text-slate-700">Amount (cents)</label><input type="number" value={form.amountCents || ""} onChange={(e) => update("amountCents", Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="payment-amount" /></div>
        <div><label className="text-sm font-medium text-slate-700">Method</label><select value={form.method} onChange={(e) => update("method", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="payment-method"><option value="check">Check</option><option value="ach">ACH</option><option value="credit_card">Credit Card</option><option value="trust_transfer">Trust Transfer</option></select></div>
        {form.method === "trust_transfer" && <div className="rounded-lg border border-blue-200 bg-blue-50 p-3" data-testid="trust-transfer-section"><p className="text-sm font-medium text-blue-700">Trust Transfer</p><select className="mt-2 w-full rounded-lg border border-blue-300 px-3 py-2 text-sm" data-testid="trust-account-select"><option value="">Select trust account...</option></select></div>}
        <div><label className="text-sm font-medium text-slate-700">Reference #</label><input type="text" value={form.referenceNumber} onChange={(e) => update("referenceNumber", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="payment-ref" /></div>
        <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700" data-testid="submit-payment">Record Payment</button>
      </div>
    </div>
  );
}
