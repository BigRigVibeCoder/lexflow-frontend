import { pgTable, uuid, varchar, text, timestamp, inet, jsonb, bigserial, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const auditLogs = pgTable("audit_logs", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  resourceType: varchar("resource_type", { length: 50 }).notNull(),
  resourceId: uuid("resource_id"),
  details: jsonb("details"),
  ipAddress: inet("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index("idx_audit_user").on(t.userId),
  resourceIdx: index("idx_audit_resource").on(t.resourceType, t.resourceId),
  actionIdx: index("idx_audit_action").on(t.action),
  createdIdx: index("idx_audit_created").on(t.createdAt),
}));

export type AuditLog = typeof auditLogs.$inferSelect;
