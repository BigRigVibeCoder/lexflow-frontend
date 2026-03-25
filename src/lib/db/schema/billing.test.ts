import { describe, it, expect } from "vitest";
import { timeEntries, expenseEntries, invoices, invoiceLineItems, payments, operatingTransactions, invoiceStatusEnum, paymentMethodEnum } from "./billing";

describe("billing schema", () => {
  it("time_entries has required columns", () => {
    const cols = Object.keys(timeEntries);
    expect(cols).toContain("durationMinutes");
    expect(cols).toContain("hourlyRateCents");
    expect(cols).toContain("isBillable");
  });
  it("expense_entries uses integer cents", () => {
    expect(Object.keys(expenseEntries)).toContain("amountCents");
  });
  it("invoices has all currency fields as cents", () => {
    const cols = Object.keys(invoices);
    expect(cols).toContain("subtotalCents");
    expect(cols).toContain("taxCents");
    expect(cols).toContain("totalCents");
    expect(cols).toContain("paidAmountCents");
    expect(cols).toContain("voidedAt");
  });
  it("invoice status enum includes void", () => {
    expect(invoiceStatusEnum.enumValues).toContain("void");
    expect(invoiceStatusEnum.enumValues).toContain("partial");
  });
  it("line items link to time and expense entries", () => {
    const cols = Object.keys(invoiceLineItems);
    expect(cols).toContain("timeEntryId");
    expect(cols).toContain("expenseEntryId");
    expect(cols).toContain("amountCents");
  });
  it("payments use integer cents", () => {
    expect(Object.keys(payments)).toContain("amountCents");
    expect(paymentMethodEnum.enumValues).toContain("trust_transfer");
  });
  it("operating transactions exist", () => {
    expect(Object.keys(operatingTransactions)).toContain("amountCents");
  });
  it("billing math: cents avoid float precision issues", () => {
    const rate = 25000; // $250.00/hr
    const minutes = 90;
    const amount = Math.round((rate * minutes) / 60);
    expect(amount).toBe(37500); // $375.00 exactly
    expect(Number.isInteger(amount)).toBe(true);
  });
});
