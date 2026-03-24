"use client";
import { useParams } from "next/navigation";
export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  return (
    <div data-testid="user-detail-page"><h1 className="text-2xl font-bold text-slate-900">User Details</h1><p className="mt-1 text-sm text-slate-500">ID: {userId}</p>
    <div className="mt-6 max-w-lg space-y-6 rounded-xl border border-slate-200 bg-white p-6">
      <div><label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label><input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" disabled data-testid="user-name-input" /></div>
      <div><label className="mb-1 block text-sm font-medium text-slate-700">Email</label><input type="email" className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm" disabled data-testid="user-email-input" /></div>
      <div><label htmlFor="role-select" className="mb-1 block text-sm font-medium text-slate-700">Role</label><select id="role-select" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="user-role-select"><option value="owner">Owner</option><option value="attorney">Attorney</option><option value="paralegal">Paralegal</option><option value="bookkeeper">Bookkeeper</option><option value="intake_specialist">Intake Specialist</option></select></div>
      <div className="flex gap-3"><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors" data-testid="save-user-button">Save</button><button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors" data-testid="deactivate-user-button">Deactivate</button></div>
    </div></div>
  );
}
