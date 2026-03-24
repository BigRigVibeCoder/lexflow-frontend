import { pgTable, pgEnum, uuid, varchar, text, numeric, timestamp, date, boolean } from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { users } from "./users";

export const matterStatusEnum = pgEnum("matter_status", [
  "intake", "pre_litigation", "litigation", "discovery", "trial", "settlement", "closed", "archived"
]);
export const feeTypeEnum = pgEnum("fee_type", ["contingency", "hourly", "flat", "hybrid"]);
export const deadlineTypeEnum = pgEnum("deadline_type", ["sol", "hearing", "filing", "discovery", "custom"]);

export const matters = pgTable("matters", {
  id: uuid("id").defaultRandom().primaryKey(),
  matterNumber: varchar("matter_number", { length: 12 }).notNull().unique(),
  clientId: uuid("client_id").notNull().references(() => clients.id),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).default("personal_injury").notNull(),
  status: matterStatusEnum("status").default("intake").notNull(),
  feeType: feeTypeEnum("fee_type").default("contingency").notNull(),
  feePercentage: numeric("fee_percentage", { precision: 5, scale: 2 }),
  accidentDate: date("accident_date"),
  statuteOfLimitations: date("statute_of_limitations"),
  totalMedicalBills: numeric("total_medical_bills", { precision: 12, scale: 2 }).default("0"),
  totalSettlement: numeric("total_settlement", { precision: 12, scale: 2 }),
  description: text("description"),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const matterTeam = pgTable("matter_team", {
  id: uuid("id").defaultRandom().primaryKey(),
  matterId: uuid("matter_id").notNull().references(() => matters.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  role: varchar("role", { length: 50 }).default("member").notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

export const matterDeadlines = pgTable("matter_deadlines", {
  id: uuid("id").defaultRandom().primaryKey(),
  matterId: uuid("matter_id").notNull().references(() => matters.id),
  title: varchar("title", { length: 255 }).notNull(),
  dueDate: date("due_date").notNull(),
  type: deadlineTypeEnum("type").default("custom").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const medicalTreatments = pgTable("medical_treatments", {
  id: uuid("id").defaultRandom().primaryKey(),
  matterId: uuid("matter_id").notNull().references(() => matters.id),
  provider: varchar("provider", { length: 200 }).notNull(),
  treatmentDate: date("treatment_date").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Matter = typeof matters.$inferSelect;
export type NewMatter = typeof matters.$inferInsert;
export type MatterTeamMember = typeof matterTeam.$inferSelect;
export type MatterDeadline = typeof matterDeadlines.$inferSelect;
export type MedicalTreatment = typeof medicalTreatments.$inferSelect;
