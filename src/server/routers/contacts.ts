import { z } from "zod";
import { eq, ilike, sql } from "drizzle-orm";
import { router, protectedProcedure, permissionProcedure } from "../trpc";
import { db } from "@/lib/db";
import { contacts, matterContacts } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

const contactInput = z.object({
  name: z.string().min(1).max(200), type: z.enum(["adjuster","doctor","expert","court","opposing_counsel"]),
  company: z.string().max(200).optional().nullable(), email: z.string().email().optional().nullable(),
  phone: z.string().max(20).optional().nullable(), address: z.string().optional().nullable(), notes: z.string().optional().nullable(),
});

export const contactsRouter = router({
  list: protectedProcedure.input(z.object({ page: z.number().int().min(1).default(1), limit: z.number().int().min(1).max(100).default(20), search: z.string().optional() })).query(async ({ input }) => {
    const { page, limit, search } = input;
    const where = search ? ilike(contacts.name, `%${search}%`) : undefined;
    const [data, countResult] = await Promise.all([
      db.select().from(contacts).where(where).limit(limit).offset((page - 1) * limit).orderBy(contacts.name),
      db.select({ count: sql<number>`count(*)` }).from(contacts).where(where),
    ]);
    return { data, total: Number(countResult[0]?.count ?? 0), page, limit };
  }),
  getById: protectedProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
    const [c] = await db.select().from(contacts).where(eq(contacts.id, input.id)).limit(1);
    if (!c) throw new Error("Contact not found"); return c;
  }),
  create: permissionProcedure("contact:create").input(contactInput).mutation(async ({ input }) => {
    const [c] = await db.insert(contacts).values(input).returning();
    logger.info({ contactId: c.id }, "contact.created"); return c;
  }),
  update: permissionProcedure("contact:update").input(z.object({ id: z.string().uuid() }).merge(contactInput.partial())).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const [c] = await db.update(contacts).set({ ...data, updatedAt: new Date() }).where(eq(contacts.id, id)).returning();
    if (!c) throw new Error("Contact not found"); logger.info({ contactId: id }, "contact.updated"); return c;
  }),
  linkToMatter: permissionProcedure("matter:update").input(z.object({ matterId: z.string().uuid(), contactId: z.string().uuid() })).mutation(async ({ input }) => {
    const [link] = await db.insert(matterContacts).values(input).returning();
    logger.info({ matterId: input.matterId, contactId: input.contactId }, "contact.linked"); return link;
  }),
  unlinkFromMatter: permissionProcedure("matter:update").input(z.object({ id: z.string().uuid() })).mutation(async ({ input }) => {
    const [link] = await db.delete(matterContacts).where(eq(matterContacts.id, input.id)).returning();
    if (!link) throw new Error("Link not found"); return link;
  }),
  listByMatter: protectedProcedure.input(z.object({ matterId: z.string().uuid() })).query(async ({ input }) => {
    return db.select().from(matterContacts).where(eq(matterContacts.matterId, input.matterId));
  }),
});
