import { pgTable, uuid, varchar, text, boolean, timestamp, date } from "drizzle-orm/pg-core";

/** Clients table — personal injury clients with PI-specific fields. */
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  ssnLast4: varchar("ssn_last_4", { length: 4 }),
  insuranceCarrier: varchar("insurance_carrier", { length: 200 }),
  insurancePolicyNumber: varchar("insurance_policy_number", { length: 100 }),
  referralSource: varchar("referral_source", { length: 100 }),
  notes: text("notes"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
