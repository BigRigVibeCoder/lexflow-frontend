"use client";
import { useState } from "react";

export default function NewTrustAccountPage() {
  const [form, setForm] = useState({ bankName: "", accountNumber: "", routingNumber: "", accountName: "", accountType: "iolta" as const });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div data-testid="new-trust-account-page" className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">New Trust Account</h1>
      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div><label className="text-sm font-medium text-slate-700">Bank Name</label><input type="text" value={form.bankName} onChange={(e) => update("bankName", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="bank-name" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium text-slate-700">Account Number</label><input type="text" value={form.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="account-number" /></div>
          <div><label className="text-sm font-medium text-slate-700">Routing Number</label><input type="text" value={form.routingNumber} onChange={(e) => update("routingNumber", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="routing-number" /></div>
        </div>
        <div><label className="text-sm font-medium text-slate-700">Display Name</label><input type="text" value={form.accountName} onChange={(e) => update("accountName", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="account-name" /></div>
        <div><label className="text-sm font-medium text-slate-700">Type</label><select value={form.accountType} onChange={(e) => update("accountType", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="account-type"><option value="iolta">IOLTA</option><option value="operating">Operating</option></select></div>
        <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors" data-testid="submit-account">Create Account</button>
      </div>
    </div>
  );
}
