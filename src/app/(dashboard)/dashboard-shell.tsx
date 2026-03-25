"use client";
import type { ReactNode } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [{l:"Dashboard",h:"/dashboard",i:"📊"},{l:"Clients",h:"/clients",i:"👥"},{l:"Matters",h:"/matters",i:"📁"},{l:"Documents",h:"/documents",i:"📄"},{l:"Billing",h:"/billing",i:"💰"},{l:"Trust",h:"/trust",i:"🏦"},{l:"Settings",h:"/settings",i:"⚙️"}] as const;

export function DashboardShell({ user, children }: { user: { name?: string | null; email?: string | null; role?: string }; children: ReactNode }) {
  const p = usePathname();
  return (
    <div className="flex min-h-screen bg-slate-50" data-testid="dashboard-shell">
      <nav className="flex w-64 flex-col border-r border-slate-200 bg-white" aria-label="Main navigation" data-testid="sidebar">
        <div className="flex h-16 items-center border-b border-slate-200 px-6"><Link href="/dashboard" className="text-xl font-bold text-slate-900">LexFlow</Link></div>
        <ul className="flex-1 space-y-1 px-3 py-4" role="list">
          {NAV.map((n) => { const a = p === n.h || p?.startsWith(n.h + "/"); return (<li key={n.h}><Link href={n.h} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${a ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`} aria-current={a ? "page" : undefined} data-testid={`nav-${n.l.toLowerCase()}`}><span aria-hidden>{n.i}</span>{n.l}</Link></li>); })}
        </ul>
      </nav>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6"><div /><div className="flex items-center gap-4"><div className="text-right"><p className="text-sm font-medium text-slate-900">{user.name ?? user.email}</p><p className="text-xs text-slate-500 capitalize">{user.role?.replace("_", " ")}</p></div><button onClick={() => signOut({ callbackUrl: "/login" })} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" data-testid="logout">Sign Out</button></div></header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
