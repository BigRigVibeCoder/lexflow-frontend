import { pgTable, pgEnum, uuid, varchar, text, integer, timestamp, date, boolean } from "drizzle-orm/pg-core";
import { matters } from "./matters";
import { users } from "./users";
import { documents } from "./documents";

/** Invoice status enum per SPR-007 T-063. */
export const invoiceStatusEnum = pgEnum("invoice_status", ["draft", "sent", "paid", "void", "partial"]);
/** Invoice line item type enum. */
export const lineItemTypeEnum = pgEnum("line_item_type", ["time", "expense", "flat_fee"]);
/** Payment method enum. */
export const paymentMethodEnum = pgEnum("payment_method", ["check", "ach", "credit_card", "trust_transfer"]);
/** Expense category enum. */
export const expenseCategoryEnum = pgEnum("expense_category", ["filing_fee", "service", "travel", "copying", "postage", "medical", "expert", "other"]);
/** Operating transaction type enum. */
export const operatingTxTypeEnum = pgEnum("operating_tx_type", ["fee_income", "expense", "refund", "adjustment"]);

/** Time entries — duration in minutes, rate in cents. */
export const timeEntries = pgTable("time_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  matterId: uuid("matter_id").notNull().references(() => matters.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  description: text("description").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  hourlyRateCents: integer("hourly_rate_cents").notNull(),
  isBillable: boolean("is_billable").default(true).notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Expense entries — amount in cents. */
export const expenseEntries = pgTable("expense_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  matterId: uuid("matter_id").notNull().references(() => matters.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  category: expenseCategoryEnum("category").default("other").notNull(),
  receiptDocumentId: uuid("receipt_document_id").references(() => documents.id),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Invoices — all currency in cents. Void only, never delete. */
export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  matterId: uuid("matter_id").notNull().references(() => matters.id),
  invoiceNumber: varchar("invoice_number", { length: 20 }).notNull().unique(),
  status: invoiceStatusEnum("status").default("draft").notNull(),
  subtotalCents: integer("subtotal_cents").notNull().default(0),
  taxCents: integer("tax_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
  paidAmountCents: integer("paid_amount_cents").notNull().default(0),
  dueDate: date("due_date"),
  issuedAt: timestamp("issued_at"),
  paidAt: timestamp("paid_at"),
  voidedAt: timestamp("voided_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Invoice line items — links to time/expense entries. */
export const invoiceLineItems = pgTable("invoice_line_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id),
  timeEntryId: uuid("time_entry_id").references(() => timeEntries.id),
  expenseEntryId: uuid("expense_entry_id").references(() => expenseEntries.id),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  type: lineItemTypeEnum("type").notNull(),
});

/** Payments — amount in cents. */
export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id),
  amountCents: integer("amount_cents").notNull(),
  method: paymentMethodEnum("method").notNull(),
  referenceNumber: varchar("reference_number", { length: 100 }),
  trustTransactionId: uuid("trust_transaction_id"),
  receivedAt: timestamp("received_at").defaultNow().notNull(),
});

/** Operating account transactions. */
export const operatingTransactions = pgTable("operating_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: operatingTxTypeEnum("type").notNull(),
  amountCents: integer("amount_cents").notNull(),
  description: text("description").notNull(),
  relatedInvoiceId: uuid("related_invoice_id").references(() => invoices.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TimeEntry = typeof timeEntries.$inferSelect;
export type NewTimeEntry = typeof timeEntries.$inferInsert;
export type ExpenseEntry = typeof expenseEntries.$inferSelect;
export type NewExpenseEntry = typeof expenseEntries.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceLineItem = typeof invoiceLineItems.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type OperatingTransaction = typeof operatingTransactions.$inferSelect;
