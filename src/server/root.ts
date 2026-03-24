import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { mfaRouter } from "./routers/mfa";
import { clientsRouter } from "./routers/clients";
import { mattersRouter } from "./routers/matters";
import { deadlinesRouter } from "./routers/deadlines";
import { treatmentsRouter } from "./routers/treatments";
import { contactsRouter } from "./routers/contacts";
import { trustRouter } from "./routers/trust";

export const appRouter = router({
  auth: authRouter, mfa: mfaRouter, clients: clientsRouter, matters: mattersRouter,
  deadlines: deadlinesRouter, treatments: treatmentsRouter, contacts: contactsRouter,
  trust: trustRouter,
});

export type AppRouter = typeof appRouter;
