import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";
import { trustClient, CircuitBreakerError } from "@/lib/trust-client";
import { logger } from "@/lib/logger";

/** Wrap trust client calls with TRPCError handling. */
async function trustCall<T>(fn: () => Promise<T>, operation: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof CircuitBreakerError) {
      logger.warn({ operation }, "trust.circuit_breaker.open");
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Trust service unavailable" });
    }
    const e = err as Error & { code?: string; status?: number };
    logger.error({ operation, code: e.code, status: e.status }, "trust.proxy.error");
    if (e.status === 404) throw new TRPCError({ code: "NOT_FOUND", message: e.message });
    if (e.status === 422) throw new TRPCError({ code: "BAD_REQUEST", message: e.message });
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: e.message ?? "Trust service error" });
  }
}

/** Trust tRPC proxy router — permission-gated access to trust service. */
export const trustRouter = router({
  listAccounts: permissionProcedure("trust:read").query(async () => {
    return trustCall(() => trustClient.listAccounts(), "listAccounts");
  }),

  getAccount: permissionProcedure("trust:read")
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => trustCall(() => trustClient.getAccount(input.id), "getAccount")),

  createAccount: permissionProcedure("trust:admin")
    .input(z.object({ bankName: z.string().min(1), accountNumber: z.string().min(1), routingNumber: z.string().length(9), accountName: z.string().min(1), accountType: z.enum(["iolta", "operating"]) }))
    .mutation(async ({ input }) => {
      logger.info({ accountName: input.accountName }, "trust.account.creating");
      return trustCall(() => trustClient.createAccount(input), "createAccount");
    }),

  listLedgers: permissionProcedure("trust:read")
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => trustCall(() => trustClient.listLedgers(input.accountId), "listLedgers")),

  createLedger: permissionProcedure("trust:admin")
    .input(z.object({ accountId: z.string().uuid(), matterId: z.string().uuid(), clientId: z.string().uuid(), createdByName: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { accountId, ...data } = input;
      return trustCall(() => trustClient.createLedger(accountId, data), "createLedger");
    }),

  deposit: permissionProcedure("trust:deposit")
    .input(z.object({ trustAccountId: z.string().uuid(), clientLedgerId: z.string().uuid(), amount: z.string(), description: z.string().min(1), payorName: z.string().min(1), paymentMethod: z.enum(["check", "wire", "ach", "cash", "other"]), referenceNumber: z.string().optional(), createdByName: z.string().min(1) }))
    .mutation(async ({ input }) => {
      logger.info({ amount: input.amount, ledger: input.clientLedgerId }, "trust.deposit.recording");
      return trustCall(() => trustClient.recordDeposit(input), "deposit");
    }),

  disburse: permissionProcedure("trust:disburse")
    .input(z.object({ trustAccountId: z.string().uuid(), clientLedgerId: z.string().uuid(), amount: z.string(), description: z.string().min(1), payeeName: z.string().min(1), paymentMethod: z.enum(["check", "wire", "ach", "other"]), referenceNumber: z.string().optional(), createdByName: z.string().min(1) }))
    .mutation(async ({ input }) => {
      logger.info({ amount: input.amount, ledger: input.clientLedgerId }, "trust.disburse.recording");
      return trustCall(() => trustClient.recordDisbursement(input), "disburse");
    }),

  transfer: permissionProcedure("trust:admin")
    .input(z.object({ trustAccountId: z.string().uuid(), fromLedgerId: z.string().uuid(), toLedgerId: z.string().uuid(), amount: z.string(), description: z.string().min(1), createdByName: z.string().min(1) }))
    .mutation(async ({ input }) => trustCall(() => trustClient.recordTransfer(input), "transfer")),

  feeTransfer: permissionProcedure("trust:admin")
    .input(z.object({ trustAccountId: z.string().uuid(), clientLedgerId: z.string().uuid(), operatingAccountId: z.string().uuid(), amount: z.string(), description: z.string().min(1), invoiceReference: z.string().optional(), createdByName: z.string().min(1) }))
    .mutation(async ({ input }) => trustCall(() => trustClient.recordFeeTransfer(input), "feeTransfer")),

  voidEntry: permissionProcedure("trust:admin")
    .input(z.object({ entryId: z.string().uuid(), reason: z.string().min(1), voidedByName: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { entryId, ...data } = input;
      return trustCall(() => trustClient.voidEntry(entryId, data), "voidEntry");
    }),

  listTransactions: permissionProcedure("trust:read")
    .input(z.object({ ledgerId: z.string().uuid(), page: z.number().optional(), pageSize: z.number().optional(), startDate: z.string().optional(), endDate: z.string().optional() }))
    .query(async ({ input }) => {
      const { ledgerId, ...params } = input;
      return trustCall(() => trustClient.listTransactions(ledgerId, params), "listTransactions");
    }),

  getTransaction: permissionProcedure("trust:read")
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => trustCall(() => trustClient.getTransaction(input.id), "getTransaction")),

  importStatement: permissionProcedure("trust:reconcile")
    .input(z.object({ trustAccountId: z.string().uuid(), statementDate: z.string(), transactions: z.array(z.object({ date: z.string(), description: z.string(), amount: z.string(), externalId: z.string(), checkNumber: z.string().optional() })), importedByName: z.string().min(1) }))
    .mutation(async ({ input }) => {
      logger.info({ accountId: input.trustAccountId, txCount: input.transactions.length }, "trust.statement.importing");
      return trustCall(() => trustClient.importBankStatement(input), "importStatement");
    }),

  startReconciliation: permissionProcedure("trust:reconcile")
    .input(z.object({ trustAccountId: z.string().uuid(), statementEndDate: z.string(), statementEndBalance: z.string(), preparedByName: z.string().min(1) }))
    .mutation(async ({ input }) => trustCall(() => trustClient.startReconciliation(input), "startReconciliation")),

  getReconciliation: permissionProcedure("trust:reconcile")
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => trustCall(() => trustClient.getReconciliation(input.id), "getReconciliation")),

  threeWayReport: permissionProcedure("trust:reconcile")
    .input(z.object({ accountId: z.string().uuid() }))
    .query(async ({ input }) => trustCall(() => trustClient.getThreeWayReport(input.accountId), "threeWayReport")),
});
