"use client";
import { useState } from "react";

export default function InvoiceWizardPage() {
  const [step, setStep] = useState<"select" | "review" | "done">("select");
  const [flatFeeDesc, setFlatFeeDesc] = useState("");
  const [flatFeeCents, setFlatFeeCents] = useState(0);
  return (
    <div data-testid="invoice-wizard-page" className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Create Invoice</h1>
      <div className="mt-2 flex gap-2">
        <span className={"rounded-full px-3 py-1 text-xs font-medium " + (step === "select" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500")}>1. Select Items</span>
        <span className={"rounded-full px-3 py-1 text-xs font-medium " + (step === "review" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500")}>2. Review</span>
      </div>
      {step === "select" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="unbilled-time"><h2 className="font-semibold text-slate-900">Unbilled Time Entries</h2><p className="mt-2 text-sm text-slate-400">Select time entries to include</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="unbilled-expenses"><h2 className="font-semibold text-slate-900">Unbilled Expenses</h2><p className="mt-2 text-sm text-slate-400">Select expenses to include</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="flat-fee-section"><h2 className="font-semibold text-slate-900">Flat Fee (Optional)</h2><div className="mt-2 grid grid-cols-2 gap-3"><input type="text" value={flatFeeDesc} onChange={(e) => setFlatFeeDesc(e.target.value)} placeholder="Description" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="flat-fee-desc" /><input type="number" value={flatFeeCents || ""} onChange={(e) => setFlatFeeCents(Number(e.target.value))} placeholder="Amount (cents)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="flat-fee-amount" /></div></div>
          <button onClick={() => setStep("review")} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" data-testid="next-step">Review Invoice</button>
        </div>
      )}
      {step === "review" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="invoice-preview"><h2 className="font-semibold text-slate-900">Invoice Preview</h2><p className="mt-2 text-sm text-slate-400">Line items preview</p></div>
          <div className="flex gap-3"><button onClick={() => setStep("select")} className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm" data-testid="back-step">Back</button><button onClick={() => setStep("done")} className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700" data-testid="create-invoice">Create Invoice</button></div>
        </div>
      )}
      {step === "done" && <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6 text-center" data-testid="invoice-created"><p className="font-semibold text-green-700">Invoice Created</p></div>}
    </div>
  );
}
