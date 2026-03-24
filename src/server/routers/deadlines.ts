import { z } from "zod";
import { eq, and, lte, gte, sql } from "drizzle-orm";
import { router, protectedProcedure, permissionProcedure } from "../trpc";
import { db } from "@/lib/db";
import { matterDeadlines } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

export const deadlinesRouter = router({
  add: permissionProcedure("matter:update").input(z.object({ matterId: z.string().uuid(), title: z.string().min(1).max(255), dueDate: z.string(), type: z.enum(["sol","hearing","filing","discovery","custom"]).default("custom"), notes: z.string().optional().nullable() }))
    .mutation(async ({ input }) => { const [d] = await db.insert(matterDeadlines).values(input).returning(); logger.info({ deadlineId: d.id, matterId: input.matterId }, "deadline.added"); return d; }),
  complete: permissionProcedure("matter:update").input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => { const [d] = await db.update(matterDeadlines).set({ isCompleted: true, completedAt: new Date() }).where(eq(matterDeadlines.id, input.id)).returning(); if (!d) throw new Error("Deadline not found"); logger.info({ deadlineId: input.id }, "deadline.completed"); return d; }),
  listByMatter: protectedProcedure.input(z.object({ matterId: z.string().uuid() }))
    .query(async ({ input }) => db.select().from(matterDeadlines).where(eq(matterDeadlines.matterId, input.matterId)).orderBy(matterDeadlines.dueDate)),
  listUpcoming: protectedProcedure.input(z.object({ days: z.number().int().min(1).default(30) }))
    .query(async ({ input }) => { const future = new Date(Date.now() + input.days * 86400000); return db.select().from(matterDeadlines).where(and(eq(matterDeadlines.isCompleted, false), gte(matterDeadlines.dueDate, sql`CURRENT_DATE`), lte(matterDeadlines.dueDate, future.toISOString().split("T")[0]))).orderBy(matterDeadlines.dueDate); }),
  listOverdue: protectedProcedure.query(async () => db.select().from(matterDeadlines).where(and(eq(matterDeadlines.isCompleted, false), lte(matterDeadlines.dueDate, sql`CURRENT_DATE`))).orderBy(matterDeadlines.dueDate)),
});
