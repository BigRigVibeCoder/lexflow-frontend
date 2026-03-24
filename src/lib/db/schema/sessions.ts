import { pgTable, uuid, varchar, text, timestamp, inet, index, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: inet("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index("idx_sessions_user_id").on(t.userId),
  tokenIdx: uniqueIndex("idx_sessions_token").on(t.sessionToken),
  expiresIdx: index("idx_sessions_expires").on(t.expiresAt),
}));

export type Session = typeof sessions.$inferSelect;
