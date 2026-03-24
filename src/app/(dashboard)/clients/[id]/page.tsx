"use client";
import { useParams } from "next/navigation";

export default function ClientDetailPage() {
  const params = useParams();
  return (
    <div data-testid="client-detail-page">
      <h1 className="text-2xl font-bold text-slate-900">Client Detail</h1>
      <p className="mt-2 text-sm text-slate-500">Client ID: {params.id}</p>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6"><h2 className="font-semibold text-slate-900">Contact Info</h2><p className="mt-2 text-sm text-slate-400">Loaded via tRPC</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-6"><h2 className="font-semibold text-slate-900">Insurance</h2><p className="mt-2 text-sm text-slate-400">Loaded via tRPC</p></div>
      </div>
    </div>
  );
}
