import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc, sql } from "drizzle-orm";
import { router, permissionProcedure } from "../trpc";
import { db } from "@/lib/db";
import { timeEntries } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

/** Time entry tRPC router per SPR-007 T-064. */
export const timeEntriesRouter = router({
  list: permissionProcedure("time:read")
    .input(z.object({ matterId: z.string().uuid().optional(), userId: z.string().uuid().optional(), page: z.number().default(1), pageSize: z.number().default(20) }))
    .query(async ({ input }) => {
      const conditions = [];
      if (input.matterId) conditions.push(eq(timeEntries.matterId, input.matterId));
      if (input.userId) conditions.push(eq(timeEntries.userId, input.userId));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const offset = (input.page - 1) * input.pageSize;
      const [rows, countResult] = await Promise.all([
        db.select().from(timeEntries).where(where).orderBy(desc(timeEntries.createdAt)).limit(input.pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(timeEntries).where(where),
      ]);
      const total = Number(countResult[0]?.count ?? 0);
      return { data: rows, pagination: { page: input.page, pageSize: input.pageSize, total, totalPages: Math.ceil(total / input.pageSize) } };
    }),

  create: permissionProcedure("time:create")
    .input(z.object({ matterId: z.string().uuid(), description: z.string().min(1), durationMinutes: z.number().int().min(1), hourlyRateCents: z.number().int().min(0), isBillable: z.boolean().default(true), date: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id ?? "system";
      const [entry] = await db.insert(timeEntries).values({ ...input, userId }).returning();
      logger.info({ timeEntryId: entry.id, matterId: input.matterId, minutes: input.durationMinutes }, "time_entry.created");
      return entry;
    }),

  update: permissionProcedure("time:update")
    .input(z.object({ id: z.string().uuid(), description: z.string().optional(), durationMinutes: z.number().int().min(1).optional(), isBillable: z.boolean().optional() }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const [entry] = await db.update(timeEntries).set(updates).where(eq(timeEntries.id, id)).returning();
      if (!entry) throw new TRPCError({ code: "NOT_FOUND", message: "Time entry not found" });
      return entry;
    }),

  delete: permissionProcedure("time:update")
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [entry] = await db.delete(timeEntries).where(eq(timeEntries.id, input.id)).returning();
      if (!entry) throw new TRPCError({ code: "NOT_FOUND", message: "Time entry not found" });
      return { success: true };
    }),
});
