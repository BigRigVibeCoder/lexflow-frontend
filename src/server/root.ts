import { router } from "@/server/trpc";
import { authRouter } from "@/server/routers/auth";
import { mfaRouter } from "@/server/routers/mfa";
export const appRouter = router({ auth: authRouter, mfa: mfaRouter });
export type AppRouter = typeof appRouter;
