import { pgTable, pgEnum, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { matters } from "./matters";

export const contactTypeEnum = pgEnum("contact_type", ["adjuster", "doctor", "expert", "court", "opposing_counsel"]);

export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  type: contactTypeEnum("type").notNull(),
  company: varchar("company", { length: 200 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const matterContacts = pgTable("matter_contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  matterId: uuid("matter_id").notNull().references(() => matters.id),
  contactId: uuid("contact_id").notNull().references(() => contacts.id),
  linkedAt: timestamp("linked_at").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type MatterContact = typeof matterContacts.$inferSelect;
