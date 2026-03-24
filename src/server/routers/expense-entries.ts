import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc, sql } from "drizzle-orm";
import { router, permissionProcedure } from "../trpc";
import { db } from "@/lib/db";
import { expenseEntries } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

/** Expense entry tRPC router per SPR-007 T-067. */
export const expenseEntriesRouter = router({
  list: permissionProcedure("time:read")
    .input(z.object({ matterId: z.string().uuid().optional(), page: z.number().default(1), pageSize: z.number().default(20) }))
    .query(async ({ input }) => {
      const conditions = [];
      if (input.matterId) conditions.push(eq(expenseEntries.matterId, input.matterId));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const offset = (input.page - 1) * input.pageSize;
      const [rows, countResult] = await Promise.all([
        db.select().from(expenseEntries).where(where).orderBy(desc(expenseEntries.createdAt)).limit(input.pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(expenseEntries).where(where),
      ]);
      const total = Number(countResult[0]?.count ?? 0);
      return { data: rows, pagination: { page: input.page, pageSize: input.pageSize, total, totalPages: Math.ceil(total / input.pageSize) } };
    }),

  create: permissionProcedure("time:create")
    .input(z.object({ matterId: z.string().uuid(), description: z.string().min(1), amountCents: z.number().int().min(1), category: z.enum(["filing_fee", "service", "travel", "copying", "postage", "medical", "expert", "other"]).default("other"), receiptDocumentId: z.string().uuid().optional(), date: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id ?? "system";
      const [entry] = await db.insert(expenseEntries).values({ ...input, userId, receiptDocumentId: input.receiptDocumentId ?? null }).returning();
      logger.info({ expenseId: entry.id, matterId: input.matterId, amountCents: input.amountCents }, "expense.created");
      return entry;
    }),

  delete: permissionProcedure("time:update")
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [entry] = await db.delete(expenseEntries).where(eq(expenseEntries.id, input.id)).returning();
      if (!entry) throw new TRPCError({ code: "NOT_FOUND", message: "Expense entry not found" });
      return { success: true };
    }),
});
