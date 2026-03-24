"use client";
import { useState } from "react";

type WizardStep = 1 | 2 | 3 | 4 | 5;
const STEPS = ["Select Client", "Case Details", "Fee Arrangement", "Insurance", "Review"];

export default function NewMatterWizardPage() {
  const [step, setStep] = useState<WizardStep>(1);
  const [data, setData] = useState({ clientId: "", title: "", accidentDate: "", description: "", feeType: "contingency", feePercentage: "33.33", insuranceCarrier: "", policyNumber: "" });
  const update = (k: string, v: string) => setData((p) => ({ ...p, [k]: v }));
  const next = () => setStep((s) => Math.min(s + 1, 5) as WizardStep);
  const back = () => setStep((s) => Math.max(s - 1, 1) as WizardStep);

  return (
    <div data-testid="matter-wizard" className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">New Matter</h1>
      <div className="mt-4 flex gap-2">{STEPS.map((s, i) => <div key={s} className={`flex-1 rounded-full py-1 text-center text-xs font-medium ${i + 1 === step ? "bg-blue-600 text-white" : i + 1 < step ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`}>{s}</div>)}</div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        {step === 1 && <div data-testid="step-1"><h2 className="font-semibold">Step 1: Select Client</h2><input type="text" placeholder="Search or create client..." value={data.clientId} onChange={(e) => update("clientId", e.target.value)} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="client-select" /></div>}
        {step === 2 && <div data-testid="step-2"><h2 className="font-semibold">Step 2: Case Details</h2><input type="text" placeholder="Matter title" value={data.title} onChange={(e) => update("title", e.target.value)} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="matter-title" /><input type="date" value={data.accidentDate} onChange={(e) => update("accidentDate", e.target.value)} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="accident-date" /><textarea placeholder="Description" value={data.description} onChange={(e) => update("description", e.target.value)} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="description" /></div>}
        {step === 3 && <div data-testid="step-3"><h2 className="font-semibold">Step 3: Fee Arrangement</h2><select value={data.feeType} onChange={(e) => update("feeType", e.target.value)} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="fee-type"><option value="contingency">Contingency</option><option value="hourly">Hourly</option><option value="flat">Flat</option><option value="hybrid">Hybrid</option></select></div>}
        {step === 4 && <div data-testid="step-4"><h2 className="font-semibold">Step 4: Insurance Info</h2><input type="text" placeholder="Insurance Carrier" value={data.insuranceCarrier} onChange={(e) => update("insuranceCarrier", e.target.value)} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="ins-carrier" /></div>}
        {step === 5 && <div data-testid="step-5"><h2 className="font-semibold">Step 5: Review</h2><dl className="mt-3 space-y-2 text-sm"><dt className="font-medium">Title</dt><dd className="text-slate-500">{data.title || "\u2014"}</dd></dl><button className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" data-testid="submit-matter">Create Matter</button></div>}
      </div>
      <div className="mt-4 flex justify-between">{step > 1 && <button onClick={back} className="rounded-lg border border-slate-300 px-4 py-2 text-sm" data-testid="back-btn">Back</button>}{step < 5 && <button onClick={next} className="ml-auto rounded-lg bg-blue-600 px-4 py-2 text-sm text-white" data-testid="next-btn">Next</button>}</div>
    </div>
  );
}
