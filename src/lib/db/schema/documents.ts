import { pgTable, pgEnum, uuid, varchar, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { matters } from "./matters";
import { users } from "./users";

/** Document category enum per SPR-006 T-055. */
export const documentCategoryEnum = pgEnum("document_category", [
  "pleading", "correspondence", "medical_record", "billing", "evidence", "court_order", "other",
]);

/** Document access action enum per SPR-006 T-055. */
export const documentAccessActionEnum = pgEnum("document_access_action", [
  "view", "download", "delete",
]);

/** Documents table — stores file metadata with FK to matters. */
export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  matterId: uuid("matter_id").notNull().references(() => matters.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: documentCategoryEnum("category").default("other").notNull(),
  originalFilename: varchar("original_filename", { length: 255 }).notNull(),
  storedFilename: varchar("stored_filename", { length: 255 }).notNull().unique(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  uploadedById: uuid("uploaded_by_id").notNull().references(() => users.id),
  tags: text("tags").array(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Document access log — audit trail for view/download/delete actions. */
export const documentAccessLog = pgTable("document_access_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id").notNull().references(() => documents.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  action: documentAccessActionEnum("action").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

/** Document type for TypeScript usage. */
export type Document = typeof documents.$inferSelect;
/** New document insertion type. */
export type NewDocument = typeof documents.$inferInsert;
/** Document access log type. */
export type DocumentAccessLogEntry = typeof documentAccessLog.$inferSelect;
