import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc } from "drizzle-orm";
import { router, permissionProcedure } from "../trpc";
import { db } from "@/lib/db";
import { payments, invoices } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

/** Payment tRPC router per SPR-007 T-069. */
export const paymentsRouter = router({
  listByInvoice: permissionProcedure("invoice:read")
    .input(z.object({ invoiceId: z.string().uuid() }))
    .query(async ({ input }) => {
      const rows = await db.select().from(payments).where(eq(payments.invoiceId, input.invoiceId)).orderBy(desc(payments.receivedAt));
      return rows;
    }),

  record: permissionProcedure("invoice:create")
    .input(z.object({ invoiceId: z.string().uuid(), amountCents: z.number().int().min(1), method: z.enum(["check", "ach", "credit_card", "trust_transfer"]), referenceNumber: z.string().optional(), trustTransactionId: z.string().uuid().optional() }))
    .mutation(async ({ input }) => {
      const [inv] = await db.select().from(invoices).where(eq(invoices.id, input.invoiceId));
      if (!inv) throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      if (inv.status === "void") throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Cannot pay a voided invoice" });
      const newPaidAmount = inv.paidAmountCents + input.amountCents;
      if (newPaidAmount > inv.totalCents) throw new TRPCError({ code: "BAD_REQUEST", message: "Payment exceeds invoice total" });
      const [payment] = await db.insert(payments).values({ invoiceId: input.invoiceId, amountCents: input.amountCents, method: input.method, referenceNumber: input.referenceNumber ?? null, trustTransactionId: input.trustTransactionId ?? null }).returning();
      const newStatus = newPaidAmount >= inv.totalCents ? "paid" as const : "partial" as const;
      await db.update(invoices).set({ paidAmountCents: newPaidAmount, status: newStatus, paidAt: newStatus === "paid" ? new Date() : null }).where(eq(invoices.id, input.invoiceId));
      logger.info({ paymentId: payment.id, invoiceId: input.invoiceId, amountCents: input.amountCents, method: input.method }, "payment.recorded");
      return payment;
    }),
});
