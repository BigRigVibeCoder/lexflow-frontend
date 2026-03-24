"use client";
import { useState, type FormEvent } from "react";

export default function MFAVerifyPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> { e.preventDefault(); setError(null); if (code.length !== 6) { setError("Enter 6 digits"); return; } setError("MFA verification requires tRPC client"); }
  return (
    <main data-testid="mfa-verify-page"><div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <header className="mb-6 text-center"><h1 className="text-2xl font-bold text-slate-900">Two-Factor Authentication</h1><p className="mt-1 text-sm text-slate-500">Enter 6-digit code</p></header>
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4"><input type="text" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-center text-2xl tracking-[0.5em]" placeholder="000000" autoFocus data-testid="mfa-verify-input" /><button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors" data-testid="mfa-verify-submit">Verify</button></form>
    </div></main>
  );
}
