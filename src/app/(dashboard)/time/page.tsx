"use client";
import { useState } from "react";

/** Format minutes as HH:MM. */
function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}

export default function TimeEntryPage() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds] = useState(0);
  return (
    <div data-testid="time-entry-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Time Entries</h1>
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-mono" data-testid="timer-display">{formatDuration(Math.floor(timerSeconds / 60))}</div>
          <button onClick={() => setTimerRunning(!timerRunning)} className={"rounded-lg px-4 py-2 text-sm font-medium text-white " + (timerRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700")} data-testid="timer-toggle">{timerRunning ? "Stop" : "Start"}</button>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6" data-testid="new-entry-form">
        <h2 className="font-semibold text-slate-900">New Time Entry</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium text-slate-700">Matter</label><select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="time-matter"><option value="">Select matter...</option></select></div>
          <div><label className="text-sm font-medium text-slate-700">Duration (minutes)</label><input type="number" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="time-duration" placeholder="0" /></div>
        </div>
        <div className="mt-3"><label className="text-sm font-medium text-slate-700">Description</label><textarea className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="time-desc" /></div>
        <button className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" data-testid="save-time-entry">Save Entry</button>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white" data-testid="time-table">
        <table className="w-full text-sm"><thead><tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase"><th className="px-4 py-3">Date</th><th className="px-4 py-3">Matter</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Duration</th><th className="px-4 py-3">Amount</th></tr></thead>
        <tbody><tr className="text-slate-400 text-center"><td colSpan={5} className="px-4 py-8">Time entries load via tRPC</td></tr></tbody></table>
      </div>
    </div>
  );
}
