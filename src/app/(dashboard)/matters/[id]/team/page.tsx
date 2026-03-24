"use client";
import { useState } from "react";

export default function MatterTeamPage() {
  const [newUserId, setNewUserId] = useState("");
  return (
    <div data-testid="matter-team-page">
      <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
      <div className="mt-4 flex gap-2"><input type="text" placeholder="Add user by ID..." value={newUserId} onChange={(e) => setNewUserId(e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="add-member-input" /><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white" data-testid="add-member-btn">Add</button></div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4" data-testid="team-list"><p className="text-sm text-slate-400">Team loaded via tRPC</p></div>
    </div>
  );
}
