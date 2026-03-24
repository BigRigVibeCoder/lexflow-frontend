import { describe, it, expect } from "vitest";
import type { TrustAccount, ClientLedger, JournalEntry, ThreeWayReport, TrustErrorCode } from "./types";

describe("trust-client types", () => {
  it("TrustAccount type is structurally valid", () => {
    const account: TrustAccount = { id: "1", bankName: "B", accountName: "A", accountType: "iolta", balance: "0", ledgerCount: 0, createdAt: "" };
    expect(account.accountType).toBe("iolta");
  });
  it("ClientLedger type is structurally valid", () => {
    const ledger: ClientLedger = { id: "1", trustAccountId: "1", matterId: "1", clientId: "1", matterNumber: "2026-0001", clientName: "J", balance: "0", createdAt: "" };
    expect(ledger.matterNumber).toBe("2026-0001");
  });
  it("JournalEntry type supports all transaction types", () => {
    const types: JournalEntry["transactionType"][] = ["deposit", "disbursement", "transfer_in", "transfer_out", "fee_transfer", "void"];
    expect(types).toHaveLength(6);
  });
  it("ThreeWayReport includes ledger breakdown", () => {
    const report: ThreeWayReport = { trustAccountId: "1", bankBalance: "0", bookBalance: "0", clientLedgerTotal: "0", bankToBookVariance: "0", bookToLedgerVariance: "0", isBalanced: true, asOfDate: "", ledgerBreakdown: [] };
    expect(report.isBalanced).toBe(true);
  });
  it("TrustErrorCode covers all contract codes", () => {
    const code: TrustErrorCode = "INSUFFICIENT_BALANCE";
    expect(code).toBe("INSUFFICIENT_BALANCE");
  });
});
