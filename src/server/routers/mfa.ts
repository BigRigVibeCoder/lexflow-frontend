import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateSecret, verify as verifyTotp, generateURI } from "otplib";
import { toDataURL } from "qrcode";
import { hash } from "argon2";
import { randomBytes } from "crypto";
import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/lib/db";
import { users, auditLogs } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

function genCodes(n: number, len: number): string[] { const c: string[] = []; for (let i = 0; i < n; i++) c.push(randomBytes(Math.ceil(len / 2)).toString("hex").slice(0, len)); return c; }

export const mfaRouter = router({
  setupTotp: protectedProcedure.mutation(async ({ ctx }) => {
    const [u] = await db.select({ totpEnabled: users.totpEnabled }).from(users).where(eq(users.id, ctx.user.id)).limit(1);
    if (u?.totpEnabled) throw new TRPCError({ code: "BAD_REQUEST", message: "MFA already enabled" });
    const secret = generateSecret();
    const url = generateURI({ issuer: "LexFlow", label: ctx.user.email, secret });
    const qr = await toDataURL(url);
    await db.update(users).set({ totpSecret: secret }).where(eq(users.id, ctx.user.id));
    logger.info({ userId: ctx.user.id }, "mfa.setup.initiated");
    return { secret, qrDataUrl: qr };
  }),
  verifyTotp: protectedProcedure.input(z.object({ code: z.string().length(6) })).mutation(async ({ input, ctx }) => {
    const [u] = await db.select({ totpSecret: users.totpSecret, totpEnabled: users.totpEnabled }).from(users).where(eq(users.id, ctx.user.id)).limit(1);
    if (!u?.totpSecret) throw new TRPCError({ code: "BAD_REQUEST", message: "TOTP not initiated" });
    if (u.totpEnabled) throw new TRPCError({ code: "BAD_REQUEST", message: "MFA already enabled" });
    if (!verifyTotp({ token: input.code, secret: u.totpSecret })) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid code" });
    const codes = genCodes(10, 8);
    const hashed = await Promise.all(codes.map((c) => hash(c, { type: 2, memoryCost: 65536, timeCost: 3, parallelism: 1 })));
    await db.update(users).set({ totpEnabled: true, totpVerifiedAt: new Date(), recoveryCodes: hashed }).where(eq(users.id, ctx.user.id));
    await db.insert(auditLogs).values({ userId: ctx.user.id, action: "mfa.enabled", resourceType: "user", resourceId: ctx.user.id, ipAddress: ctx.ip, userAgent: ctx.userAgent });
    return { recoveryCodes: codes };
  }),
  disableTotp: protectedProcedure.mutation(async ({ ctx }) => {
    await db.update(users).set({ totpEnabled: false, totpSecret: null, totpVerifiedAt: null, recoveryCodes: null }).where(eq(users.id, ctx.user.id));
    await db.insert(auditLogs).values({ userId: ctx.user.id, action: "mfa.disabled", resourceType: "user", resourceId: ctx.user.id, ipAddress: ctx.ip, userAgent: ctx.userAgent });
    return { success: true };
  }),
  generateRecoveryCodes: protectedProcedure.mutation(async ({ ctx }) => {
    const [u] = await db.select({ totpEnabled: users.totpEnabled }).from(users).where(eq(users.id, ctx.user.id)).limit(1);
    if (!u?.totpEnabled) throw new TRPCError({ code: "BAD_REQUEST", message: "MFA not enabled" });
    const codes = genCodes(10, 8);
    const hashed = await Promise.all(codes.map((c) => hash(c, { type: 2, memoryCost: 65536, timeCost: 3, parallelism: 1 })));
    await db.update(users).set({ recoveryCodes: hashed }).where(eq(users.id, ctx.user.id));
    await db.insert(auditLogs).values({ userId: ctx.user.id, action: "mfa.recovery_codes_regenerated", resourceType: "user", resourceId: ctx.user.id, ipAddress: ctx.ip, userAgent: ctx.userAgent });
    return { recoveryCodes: codes };
  }),
});
