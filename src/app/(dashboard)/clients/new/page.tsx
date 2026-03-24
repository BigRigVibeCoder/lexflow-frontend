"use client";
import { useState } from "react";

export default function NewClientPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div data-testid="new-client-page" className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">New Client</h1>
      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium text-slate-700">First Name</label><input type="text" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="firstName" /></div>
          <div><label className="text-sm font-medium text-slate-700">Last Name</label><input type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="lastName" /></div>
        </div>
        <div><label className="text-sm font-medium text-slate-700">Email</label><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="email" /></div>
        <div><label className="text-sm font-medium text-slate-700">Phone</label><input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="phone" /></div>
        <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors" data-testid="submit-client">Create Client</button>
      </div>
    </div>
  );
}
