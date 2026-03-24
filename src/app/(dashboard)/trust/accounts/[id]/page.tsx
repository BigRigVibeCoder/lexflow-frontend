"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function TrustAccountDetailPage() {
  const params = useParams();
  const [tab, setTab] = useState<"ledgers" | "transactions">("ledgers");
  return (
    <div data-testid="trust-account-detail-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trust Account</h1>
          <p className="text-sm text-slate-500">Account ID: {params.id}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/trust/transactions/deposit?account=${String(params.id)}`} className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700">Deposit</Link>
          <Link href={`/trust/transactions/disburse?account=${String(params.id)}`} className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700">Disburse</Link>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6" data-testid="account-balance"><p className="text-sm font-medium text-slate-500">Balance</p><p className="mt-1 text-2xl font-bold text-slate-900">&mdash;</p></div>
      <div className="mt-4 flex gap-1 border-b border-slate-200">
        <button onClick={() => setTab("ledgers")} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab === "ledgers" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`} data-testid="tab-ledgers">Client Ledgers</button>
        <button onClick={() => setTab("transactions")} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab === "transactions" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`} data-testid="tab-transactions">Transactions</button>
      </div>
      <div className="mt-4" data-testid="tab-content">
        {tab === "ledgers" && <div data-testid="ledger-list"><p className="text-sm text-slate-400">Client ledgers loaded via tRPC</p></div>}
        {tab === "transactions" && <div data-testid="transaction-list"><p className="text-sm text-slate-400">Transaction history loaded via tRPC</p></div>}
      </div>
    </div>
  );
}
