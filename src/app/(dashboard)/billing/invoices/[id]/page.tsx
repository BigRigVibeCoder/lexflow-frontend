"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

function formatCents(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const [showVoidDialog, setShowVoidDialog] = useState(false);
  return (
    <div data-testid="invoice-detail-page">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Invoice</h1><p className="text-sm text-slate-500">ID: {params.id}</p></div>
        <div className="flex gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700" data-testid="status-badge">Draft</span>
          <button onClick={() => setShowVoidDialog(true)} className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50" data-testid="void-btn">Void Invoice</button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4" data-testid="inv-total"><p className="text-xs text-slate-500">Total</p><p className="text-xl font-bold text-slate-900">{formatCents(0)}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4" data-testid="inv-paid"><p className="text-xs text-slate-500">Paid</p><p className="text-xl font-bold text-green-700">{formatCents(0)}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4" data-testid="inv-outstanding"><p className="text-xs text-slate-500">Outstanding</p><p className="text-xl font-bold text-red-700">{formatCents(0)}</p></div>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white" data-testid="line-items-table"><table className="w-full text-sm"><thead><tr className="border-b text-left text-xs font-medium text-slate-500 uppercase"><th className="px-4 py-3">Description</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Amount</th></tr></thead><tbody><tr className="text-slate-400 text-center"><td colSpan={3} className="px-4 py-8">Line items load via tRPC</td></tr></tbody></table></div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6" data-testid="payment-history"><h2 className="font-semibold text-slate-900">Payment History</h2><p className="mt-2 text-sm text-slate-400">Payments load via tRPC</p></div>
      {showVoidDialog && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" data-testid="void-dialog"><div className="rounded-xl bg-white p-6 shadow-xl"><h3 className="font-semibold text-slate-900">Void Invoice?</h3><p className="mt-2 text-sm text-slate-500">This action cannot be undone.</p><div className="mt-4 flex gap-2"><button onClick={() => setShowVoidDialog(false)} className="flex-1 rounded-lg border px-3 py-2 text-sm">Cancel</button><button className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm text-white" data-testid="confirm-void">Confirm Void</button></div></div></div>}
    </div>
  );
}
