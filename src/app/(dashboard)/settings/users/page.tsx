"use client";
export default function UsersPage() {
  return (
    <div data-testid="users-page"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-slate-900">User Management</h1><p className="mt-1 text-sm text-slate-500">Manage users, roles, and access.</p></div><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors" data-testid="create-user-button">Create User</button></div>
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white"><table className="w-full text-left text-sm" data-testid="users-table"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="px-4 py-3 font-medium text-slate-600" scope="col">Name</th><th className="px-4 py-3 font-medium text-slate-600" scope="col">Email</th><th className="px-4 py-3 font-medium text-slate-600" scope="col">Role</th><th className="px-4 py-3 font-medium text-slate-600" scope="col">Status</th><th className="px-4 py-3 font-medium text-slate-600" scope="col">Actions</th></tr></thead><tbody><tr><td className="px-4 py-3 text-slate-500 italic" colSpan={5}>Connect tRPC client to load users</td></tr></tbody></table></div></div>
  );
}
