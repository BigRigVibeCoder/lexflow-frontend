import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { hash } from "argon2";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, permissionProcedure } from "@/server/trpc";
import { db } from "@/lib/db";
import { users, auditLogs } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

const createUserSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(128), fullName: z.string().min(1).max(255), role: z.enum(["owner","attorney","paralegal","bookkeeper","intake_specialist"]), barNumber: z.string().max(50).optional() });
const updateUserSchema = z.object({ id: z.string().uuid(), fullName: z.string().min(1).max(255).optional(), role: z.enum(["owner","attorney","paralegal","bookkeeper","intake_specialist"]).optional(), barNumber: z.string().max(50).nullable().optional() });

export const authRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db.select({ id: users.id, email: users.email, fullName: users.fullName, role: users.role, totpEnabled: users.totpEnabled, lastLoginAt: users.lastLoginAt, createdAt: users.createdAt }).from(users).where(eq(users.id, ctx.user.id)).limit(1);
    if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    return user;
  }),
  listUsers: permissionProcedure("user:manage").input(z.object({ page: z.number().int().min(1).default(1), pageSize: z.number().int().min(1).max(100).default(20) })).query(async ({ input }) => {
    const { page, pageSize } = input; const offset = (page - 1) * pageSize;
    const [items, countResult] = await Promise.all([
      db.select({ id: users.id, email: users.email, fullName: users.fullName, role: users.role, status: users.status, lastLoginAt: users.lastLoginAt, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(users),
    ]);
    return { items, total: countResult[0]?.count ?? 0, page, pageSize, totalPages: Math.ceil((countResult[0]?.count ?? 0) / pageSize) };
  }),
  createUser: permissionProcedure("user:manage").input(createUserSchema).mutation(async ({ input, ctx }) => {
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, input.email.toLowerCase())).limit(1);
    if (existing) throw new TRPCError({ code: "CONFLICT", message: "Email already exists" });
    const passwordHash = await hash(input.password, { type: 2, memoryCost: 65536, timeCost: 3, parallelism: 1 });
    const [created] = await db.insert(users).values({ email: input.email.toLowerCase(), passwordHash, fullName: input.fullName, role: input.role, barNumber: input.barNumber, status: "active" }).returning({ id: users.id, email: users.email, fullName: users.fullName, role: users.role });
    await db.insert(auditLogs).values({ userId: ctx.user.id, action: "user.create", resourceType: "user", resourceId: created.id, details: { email: created.email, role: created.role }, ipAddress: ctx.ip, userAgent: ctx.userAgent });
    logger.info({ createdUserId: created.id }, "user.created"); return created;
  }),
  updateUser: permissionProcedure("user:manage").input(updateUserSchema).mutation(async ({ input, ctx }) => {
    const { id, ...updates } = input;
    const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning({ id: users.id, email: users.email, fullName: users.fullName, role: users.role });
    if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    await db.insert(auditLogs).values({ userId: ctx.user.id, action: "user.update", resourceType: "user", resourceId: updated.id, details: { changes: updates }, ipAddress: ctx.ip, userAgent: ctx.userAgent });
    return updated;
  }),
  deactivateUser: permissionProcedure("user:manage").input(z.object({ id: z.string().uuid() })).mutation(async ({ input, ctx }) => {
    if (input.id === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot deactivate self" });
    const [d] = await db.update(users).set({ status: "deactivated" }).where(eq(users.id, input.id)).returning({ id: users.id, email: users.email });
    if (!d) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    await db.insert(auditLogs).values({ userId: ctx.user.id, action: "user.deactivate", resourceType: "user", resourceId: d.id, details: { email: d.email }, ipAddress: ctx.ip, userAgent: ctx.userAgent });
    return { success: true };
  }),
});
