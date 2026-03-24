import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

export async function writeAuditLog(entry: { userId: string | null; action: string; resourceType: string; resourceId?: string; details?: Record<string, unknown>; ipAddress?: string | null; userAgent?: string | null }): Promise<void> {
  try { await db.insert(auditLogs).values({ userId: entry.userId, action: entry.action, resourceType: entry.resourceType, resourceId: entry.resourceId, details: entry.details, ipAddress: entry.ipAddress, userAgent: entry.userAgent }); }
  catch (err: unknown) { logger.error({ err: err instanceof Error ? err.message : String(err), action: entry.action }, "audit.write.failed"); }
}
