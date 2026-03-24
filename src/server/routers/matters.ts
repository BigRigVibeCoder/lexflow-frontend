import { z } from "zod";
import { eq, ilike, and, sql, isNull } from "drizzle-orm";
import { router, protectedProcedure, permissionProcedure } from "../trpc";
import { db } from "@/lib/db";
import { matters, matterTeam } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

async function nextMatterNumber(): Promise<string> {
  const year = new Date().getFullYear().toString();
  const [result] = await db.select({ count: sql<number>`count(*)` }).from(matters);
  const seq = (Number(result?.count ?? 0) + 1).toString().padStart(4, "0");
  return `${year}-${seq}`;
}

const matterInput = z.object({
  clientId: z.string().uuid(), title: z.string().min(1).max(255), type: z.string().default("personal_injury"),
  status: z.enum(["intake","pre_litigation","litigation","discovery","trial","settlement","closed","archived"]).default("intake"),
  feeType: z.enum(["contingency","hourly","flat","hybrid"]).default("contingency"),
  feePercentage: z.string().optional().nullable(), accidentDate: z.string().optional().nullable(),
  statuteOfLimitations: z.string().optional().nullable(), description: z.string().optional().nullable(),
});

export const mattersRouter = router({
  list: protectedProcedure.input(z.object({ page: z.number().int().min(1).default(1), limit: z.number().int().min(1).max(100).default(20), search: z.string().optional(), status: z.string().optional() })).query(async ({ input }) => {
    const { page, limit, search, status } = input;
    const conditions = [isNull(matters.archivedAt)];
    if (search) conditions.push(ilike(matters.title, `%${search}%`));
    if (status) conditions.push(eq(matters.status, status as typeof matters.status.enumValues[number]));
    const where = and(...conditions);
    const [data, countResult] = await Promise.all([
      db.select().from(matters).where(where).limit(limit).offset((page - 1) * limit).orderBy(matters.createdAt),
      db.select({ count: sql<number>`count(*)` }).from(matters).where(where),
    ]);
    return { data, total: Number(countResult[0]?.count ?? 0), page, limit };
  }),
  getById: protectedProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
    const [matter] = await db.select().from(matters).where(eq(matters.id, input.id)).limit(1);
    if (!matter) throw new Error("Matter not found"); return matter;
  }),
  create: permissionProcedure("matter:create").input(matterInput).mutation(async ({ input }) => {
    const matterNumber = await nextMatterNumber();
    const [matter] = await db.insert(matters).values({ ...input, matterNumber }).returning();
    logger.info({ matterId: matter.id, matterNumber }, "matter.created"); return matter;
  }),
  update: permissionProcedure("matter:update").input(z.object({ id: z.string().uuid() }).merge(matterInput.partial())).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const [matter] = await db.update(matters).set({ ...data, updatedAt: new Date() }).where(eq(matters.id, id)).returning();
    if (!matter) throw new Error("Matter not found"); logger.info({ matterId: id }, "matter.updated"); return matter;
  }),
  archive: permissionProcedure("matter:delete").input(z.object({ id: z.string().uuid() })).mutation(async ({ input }) => {
    const [matter] = await db.update(matters).set({ archivedAt: new Date(), status: "archived", updatedAt: new Date() }).where(eq(matters.id, input.id)).returning();
    if (!matter) throw new Error("Matter not found"); logger.info({ matterId: input.id }, "matter.archived"); return matter;
  }),
  addTeamMember: permissionProcedure("matter:update").input(z.object({ matterId: z.string().uuid(), userId: z.string().uuid(), role: z.string().default("member") })).mutation(async ({ input }) => {
    const [member] = await db.insert(matterTeam).values(input).returning();
    logger.info({ matterId: input.matterId, userId: input.userId }, "matter.team.added"); return member;
  }),
  removeTeamMember: permissionProcedure("matter:update").input(z.object({ id: z.string().uuid() })).mutation(async ({ input }) => {
    const [member] = await db.delete(matterTeam).where(eq(matterTeam.id, input.id)).returning();
    if (!member) throw new Error("Team member not found"); return member;
  }),
  getTeam: protectedProcedure.input(z.object({ matterId: z.string().uuid() })).query(async ({ input }) => {
    return db.select().from(matterTeam).where(eq(matterTeam.matterId, input.matterId));
  }),
});
