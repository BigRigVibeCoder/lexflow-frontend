import { z } from "zod";
import { eq, ilike, and, sql } from "drizzle-orm";
import { router, protectedProcedure, permissionProcedure } from "../trpc";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

const clientInput = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  ssnLast4: z.string().length(4).regex(/^\\d{4}$/).optional().nullable(),
  insuranceCarrier: z.string().max(200).optional().nullable(),
  insurancePolicyNumber: z.string().max(100).optional().nullable(),
  referralSource: z.string().max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const clientsRouter = router({
  list: protectedProcedure
    .input(z.object({ page: z.number().int().min(1).default(1), limit: z.number().int().min(1).max(100).default(20), search: z.string().optional(), isActive: z.boolean().optional() }))
    .query(async ({ input }) => {
      const { page, limit, search, isActive } = input;
      const conditions = [];
      if (search) conditions.push(ilike(clients.firstName, `%${search}%`));
      if (isActive !== undefined) conditions.push(eq(clients.isActive, isActive));
      const where = conditions.length ? and(...conditions) : undefined;
      const [data, countResult] = await Promise.all([
        db.select().from(clients).where(where).limit(limit).offset((page - 1) * limit).orderBy(clients.lastName),
        db.select({ count: sql<number>`count(*)` }).from(clients).where(where),
      ]);
      return { data, total: Number(countResult[0]?.count ?? 0), page, limit };
    }),
  getById: protectedProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
    const [client] = await db.select().from(clients).where(eq(clients.id, input.id)).limit(1);
    if (!client) throw new Error("Client not found");
    return client;
  }),
  create: permissionProcedure("client:create").input(clientInput).mutation(async ({ input }) => {
    const [client] = await db.insert(clients).values(input).returning();
    logger.info({ clientId: client.id }, "client.created");
    return client;
  }),
  update: permissionProcedure("client:update").input(z.object({ id: z.string().uuid() }).merge(clientInput.partial())).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const [client] = await db.update(clients).set({ ...data, updatedAt: new Date() }).where(eq(clients.id, id)).returning();
    if (!client) throw new Error("Client not found");
    logger.info({ clientId: id }, "client.updated");
    return client;
  }),
  deactivate: permissionProcedure("client:delete").input(z.object({ id: z.string().uuid() })).mutation(async ({ input }) => {
    const [client] = await db.update(clients).set({ isActive: false, updatedAt: new Date() }).where(eq(clients.id, input.id)).returning();
    if (!client) throw new Error("Client not found");
    logger.info({ clientId: input.id }, "client.deactivated");
    return client;
  }),
});
