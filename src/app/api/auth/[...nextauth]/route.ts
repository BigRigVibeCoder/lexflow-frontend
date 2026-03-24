import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function handler(req: NextRequest) {
  const { handlers } = await import("@/lib/auth");
  const method = req.method === "GET" ? handlers.GET : handlers.POST;
  return method(req);
}

export { handler as GET, handler as POST };
