"use client";
import { useState } from "react";

export default function MatterTreatmentsPage() {
  const [provider, setProvider] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <div data-testid="matter-treatments-page">
      <h2 className="text-lg font-semibold text-slate-900">Medical Treatments</h2>
      <div className="mt-2 rounded-xl border border-green-200 bg-green-50 p-3"><p className="text-sm font-medium text-green-700">Total Medical Bills: <span data-testid="total-bills">$0.00</span></p></div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-3 gap-3">
          <input type="text" placeholder="Provider" value={provider} onChange={(e) => setProvider(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="treatment-provider" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="treatment-date" />
          <input type="text" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="treatment-amount" />
        </div>
        <button className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white" data-testid="add-treatment-btn">Add Treatment</button>
      </div>
      <div className="mt-4" data-testid="treatment-list"><p className="text-sm text-slate-400">Treatment log loaded via tRPC</p></div>
    </div>
  );
}
