"use client";
import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault(); setError(null); setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) { setError("Invalid email or password. Account may be locked after 5 failed attempts."); return; }
    router.push("/dashboard"); router.refresh();
  }

  return (
    <main data-testid="login-page">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <header className="mb-6 text-center"><h1 className="text-2xl font-bold text-slate-900">LexFlow</h1><p className="mt-1 text-sm text-slate-500">Sign in to your account</p></header>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert" data-testid="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="you@firm.com" autoComplete="email" data-testid="email" /></div>
          <div><label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password</label><input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="••••••••" autoComplete="current-password" data-testid="password" /></div>
          <button type="submit" disabled={loading} data-testid="sign-in" className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">{loading ? "Signing in…" : "Sign In"}</button>
        </form>
      </div>
    </main>
  );
}
