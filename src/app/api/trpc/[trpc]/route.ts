import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export const dynamic = "force-dynamic";

async function handler(req: Request): Promise<Response> {
  const { appRouter } = await import("@/server/root");
  const { createContext } = await import("@/server/trpc");
  return fetchRequestHandler({ endpoint: "/api/trpc", req, router: appRouter, createContext: () => createContext({ req }) });
}
export { handler as GET, handler as POST };
