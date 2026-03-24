import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { router, protectedProcedure, permissionProcedure } from "../trpc";
import { db } from "@/lib/db";
import { medicalTreatments, matters } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

async function recalcTotal(matterId: string): Promise<void> {
  const [result] = await db.select({ total: sql<string>`COALESCE(SUM(amount), 0)` }).from(medicalTreatments).where(eq(medicalTreatments.matterId, matterId));
  await db.update(matters).set({ totalMedicalBills: result?.total ?? "0", updatedAt: new Date() }).where(eq(matters.id, matterId));
}

export const treatmentsRouter = router({
  list: protectedProcedure.input(z.object({ matterId: z.string().uuid() })).query(async ({ input }) => db.select().from(medicalTreatments).where(eq(medicalTreatments.matterId, input.matterId)).orderBy(medicalTreatments.treatmentDate)),
  add: permissionProcedure("matter:update").input(z.object({ matterId: z.string().uuid(), provider: z.string().min(1).max(200), treatmentDate: z.string(), amount: z.string(), description: z.string().optional().nullable() }))
    .mutation(async ({ input }) => { const [t] = await db.insert(medicalTreatments).values(input).returning(); await recalcTotal(input.matterId); logger.info({ treatmentId: t.id, matterId: input.matterId, amount: input.amount }, "treatment.added"); return t; }),
  update: permissionProcedure("matter:update").input(z.object({ id: z.string().uuid(), matterId: z.string().uuid(), provider: z.string().min(1).max(200).optional(), treatmentDate: z.string().optional(), amount: z.string().optional(), description: z.string().optional().nullable() }))
    .mutation(async ({ input }) => { const { id, matterId, ...data } = input; const [t] = await db.update(medicalTreatments).set(data).where(eq(medicalTreatments.id, id)).returning(); if (!t) throw new Error("Treatment not found"); await recalcTotal(matterId); logger.info({ treatmentId: id }, "treatment.updated"); return t; }),
  remove: permissionProcedure("matter:update").input(z.object({ id: z.string().uuid(), matterId: z.string().uuid() }))
    .mutation(async ({ input }) => { const [t] = await db.delete(medicalTreatments).where(eq(medicalTreatments.id, input.id)).returning(); if (!t) throw new Error("Treatment not found"); await recalcTotal(input.matterId); logger.info({ treatmentId: input.id }, "treatment.removed"); return t; }),
});
