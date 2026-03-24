import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "./dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}
