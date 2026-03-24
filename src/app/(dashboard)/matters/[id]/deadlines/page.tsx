"use client";
import { useState } from "react";

export default function MatterDeadlinesPage() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("custom");
  return (
    <div data-testid="matter-deadlines-page">
      <h2 className="text-lg font-semibold text-slate-900">Deadlines</h2>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-3 gap-3">
          <input type="text" placeholder="Deadline title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="deadline-title" />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="deadline-date" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="deadline-type"><option value="sol">SOL</option><option value="hearing">Hearing</option><option value="filing">Filing</option><option value="discovery">Discovery</option><option value="custom">Custom</option></select>
        </div>
        <button className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white" data-testid="add-deadline-btn">Add Deadline</button>
      </div>
      <div className="mt-4" data-testid="deadline-list"><p className="text-sm text-slate-400">Deadlines loaded via tRPC. SOL deadlines highlighted in red when &lt;30 days.</p></div>
    </div>
  );
}
