import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc, sql } from "drizzle-orm";
import { router, permissionProcedure } from "../trpc";
import { db } from "@/lib/db";
import { invoices, invoiceLineItems } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

/** Generate next invoice number INV-YYYY-NNNN. */
async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = "INV-" + String(year) + "-";
  const [result] = await db.select({ count: sql<number>`count(*)` }).from(invoices);
  const seq = Number(result?.count ?? 0) + 1;
  return prefix + String(seq).padStart(4, "0");
}

/** Invoice tRPC router per SPR-007 T-068. Void only — never delete. */
export const invoicesRouter = router({
  list: permissionProcedure("invoice:read")
    .input(z.object({ matterId: z.string().uuid().optional(), status: z.enum(["draft", "sent", "paid", "void", "partial"]).optional(), page: z.number().default(1), pageSize: z.number().default(20) }))
    .query(async ({ input }) => {
      const conditions = [];
      if (input.matterId) conditions.push(eq(invoices.matterId, input.matterId));
      if (input.status) conditions.push(eq(invoices.status, input.status));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const offset = (input.page - 1) * input.pageSize;
      const [rows, countResult] = await Promise.all([
        db.select().from(invoices).where(where).orderBy(desc(invoices.createdAt)).limit(input.pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(invoices).where(where),
      ]);
      const total = Number(countResult[0]?.count ?? 0);
      return { data: rows, pagination: { page: input.page, pageSize: input.pageSize, total, totalPages: Math.ceil(total / input.pageSize) } };
    }),

  getById: permissionProcedure("invoice:read")
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [inv] = await db.select().from(invoices).where(eq(invoices.id, input.id));
      if (!inv) throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      const lines = await db.select().from(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, input.id));
      return { ...inv, lineItems: lines };
    }),

  create: permissionProcedure("invoice:create")
    .input(z.object({ matterId: z.string().uuid(), lineItems: z.array(z.object({ description: z.string(), amountCents: z.number().int(), type: z.enum(["time", "expense", "flat_fee"]), timeEntryId: z.string().uuid().optional(), expenseEntryId: z.string().uuid().optional() })), taxCents: z.number().int().default(0), dueDate: z.string().optional() }))
    .mutation(async ({ input }) => {
      const invoiceNumber = await generateInvoiceNumber();
      const subtotalCents = input.lineItems.reduce((sum, li) => sum + li.amountCents, 0);
      const totalCents = subtotalCents + input.taxCents;
      const [inv] = await db.insert(invoices).values({ matterId: input.matterId, invoiceNumber, subtotalCents, taxCents: input.taxCents, totalCents, dueDate: input.dueDate ?? null }).returning();
      for (const li of input.lineItems) {
        await db.insert(invoiceLineItems).values({ invoiceId: inv.id, description: li.description, amountCents: li.amountCents, type: li.type, timeEntryId: li.timeEntryId ?? null, expenseEntryId: li.expenseEntryId ?? null });
      }
      logger.info({ invoiceId: inv.id, invoiceNumber, totalCents }, "invoice.created");
      return inv;
    }),

  send: permissionProcedure("invoice:send")
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [inv] = await db.update(invoices).set({ status: "sent", issuedAt: new Date() }).where(and(eq(invoices.id, input.id), eq(invoices.status, "draft"))).returning();
      if (!inv) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Invoice must be in draft status to send" });
      logger.info({ invoiceId: input.id }, "invoice.sent");
      return inv;
    }),

  void: permissionProcedure("invoice:create")
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [inv] = await db.update(invoices).set({ status: "void", voidedAt: new Date() }).where(eq(invoices.id, input.id)).returning();
      if (!inv) throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      logger.info({ invoiceId: input.id }, "invoice.voided");
      return inv;
    }),
});
