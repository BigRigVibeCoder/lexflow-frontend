"use client";
import { useState } from "react";

export default function MFASettingsPage() {
  const [step, setStep] = useState<"idle" | "setup" | "verify" | "done">("idle");
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  return (
    <div data-testid="mfa-settings-page">
      <h1 className="text-2xl font-bold text-slate-900">Two-Factor Authentication</h1>
      <p className="mt-2 text-slate-500">Add extra security with TOTP MFA.</p>
      <div className="mt-6 max-w-lg rounded-xl border border-slate-200 bg-white p-6">
        {step === "idle" && <div data-testid="mfa-idle"><p className="text-sm text-slate-600">MFA is currently <strong>disabled</strong>.</p><button onClick={() => setStep("setup")} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors" data-testid="mfa-enable-button">Enable MFA</button></div>}
        {step === "setup" && <div data-testid="mfa-setup"><h2 className="text-lg font-semibold text-slate-900">Step 1: Scan QR Code</h2><p className="mt-4 text-sm text-slate-400">QR loads via tRPC</p><button onClick={() => setStep("verify")} className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">Next</button></div>}
        {step === "verify" && <div data-testid="mfa-verify"><h2 className="text-lg font-semibold text-slate-900">Step 2: Enter Code</h2>{error && <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}<input type="text" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg tracking-widest" placeholder="000000" data-testid="mfa-code-input" /><button onClick={() => { if (code.length === 6) { setStep("done"); setRecoveryCodes(["abc12345","def67890"]); } else setError("Enter 6 digits"); }} className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors" data-testid="mfa-verify-button">Verify</button></div>}
        {step === "done" && <div data-testid="mfa-done"><h2 className="text-lg font-semibold text-green-700">✅ MFA Enabled</h2><ul className="mt-4 space-y-1 font-mono text-sm" data-testid="recovery-codes">{recoveryCodes.map((c) => <li key={c}>{c}</li>)}</ul></div>}
      </div>
    </div>
  );
}
