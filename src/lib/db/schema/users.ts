import { pgTable, pgEnum, uuid, varchar, text, boolean, timestamp, integer, index, uniqueIndex } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["owner", "attorney", "paralegal", "bookkeeper", "intake_specialist"]);
export const userStatusEnum = pgEnum("user_status", ["active", "suspended", "deactivated"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default("paralegal"),
  status: userStatusEnum("status").notNull().default("active"),
  barNumber: varchar("bar_number", { length: 50 }),
  totpSecret: varchar("totp_secret", { length: 255 }),
  totpEnabled: boolean("totp_enabled").notNull().default(false),
  totpVerifiedAt: timestamp("totp_verified_at", { withTimezone: true }),
  recoveryCodes: text("recovery_codes").array(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  failedLoginCount: integer("failed_login_count").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  emailIdx: uniqueIndex("idx_users_email").on(t.email),
  roleIdx: index("idx_users_role").on(t.role),
  statusIdx: index("idx_users_status").on(t.status),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
