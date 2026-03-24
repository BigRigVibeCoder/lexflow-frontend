/** Trust error codes per CON-001 §5.2. */
export type TrustErrorCode =
  | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR"
  | "INSUFFICIENT_BALANCE" | "ALREADY_VOIDED" | "LEDGER_BUSY"
  | "INTERNAL_ERROR" | "DUPLICATE_ENTRY" | "MATTER_NOT_FOUND"
  | "CLIENT_NOT_FOUND" | "CLIENT_NOT_ON_MATTER" | "SERVICE_UNAVAILABLE";

/** Error response shape per CON-001 §2. */
export interface TrustErrorResponse {
  error: { code: TrustErrorCode; message: string; details?: unknown };
}

/** Trust account per CON-002 §2.2. */
export interface TrustAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountType: "iolta" | "operating";
  balance: string;
  ledgerCount: number;
  createdAt: string;
}

/** Client ledger per CON-002 §2.5. */
export interface ClientLedger {
  id: string;
  trustAccountId: string;
  matterId: string;
  clientId: string;
  matterNumber: string;
  clientName: string;
  balance: string;
  createdAt: string;
}

/** Journal entry per CON-002 §4.1. */
export interface JournalEntry {
  id: string;
  entryGroupId: string;
  transactionType: "deposit" | "disbursement" | "transfer_in" | "transfer_out" | "fee_transfer" | "void";
  amount: string;
  runningBalance: string;
  description: string;
  referenceNumber: string | null;
  createdByName: string;
  isVoided: boolean;
  voidedByName: string | null;
  voidedAt: string | null;
  createdAt: string;
}

/** Paginated response per CON-001 §5.1. */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

/** Three-way report per CON-002 §5.4. */
export interface ThreeWayReport {
  trustAccountId: string;
  bankBalance: string;
  bookBalance: string;
  clientLedgerTotal: string;
  bankToBookVariance: string;
  bookToLedgerVariance: string;
  isBalanced: boolean;
  asOfDate: string;
  ledgerBreakdown: { ledgerId: string; matterNumber: string; clientName: string; balance: string }[];
}

/** Create account request per CON-002 §2.1. */
export interface CreateAccountRequest {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountName: string;
  accountType: "iolta" | "operating";
}

/** Create ledger request per CON-002 §2.4. */
export interface CreateLedgerRequest {
  matterId: string;
  clientId: string;
  createdByName: string;
}

/** Deposit request per CON-002 §3.1. */
export interface DepositRequest {
  trustAccountId: string;
  clientLedgerId: string;
  amount: string;
  description: string;
  payorName: string;
  paymentMethod: "check" | "wire" | "ach" | "cash" | "other";
  referenceNumber?: string;
  createdByName: string;
}

/** Disbursement request per CON-002 §3.2. */
export interface DisburseRequest {
  trustAccountId: string;
  clientLedgerId: string;
  amount: string;
  description: string;
  payeeName: string;
  paymentMethod: "check" | "wire" | "ach" | "other";
  referenceNumber?: string;
  createdByName: string;
}

/** Transfer request per CON-002 §3.3. */
export interface TransferRequest {
  trustAccountId: string;
  fromLedgerId: string;
  toLedgerId: string;
  amount: string;
  description: string;
  createdByName: string;
}

/** Fee transfer request per CON-002 §3.4. */
export interface FeeTransferRequest {
  trustAccountId: string;
  clientLedgerId: string;
  operatingAccountId: string;
  amount: string;
  description: string;
  invoiceReference?: string;
  createdByName: string;
}

/** Void request per CON-002 §3.5. */
export interface VoidRequest {
  reason: string;
  voidedByName: string;
}

/** Import bank statement request per CON-002 §5.1. */
export interface ImportStatementRequest {
  trustAccountId: string;
  statementDate: string;
  transactions: { date: string; description: string; amount: string; externalId: string; checkNumber?: string }[];
  importedByName: string;
}

/** Start reconciliation request per CON-002 §5.2. */
export interface StartReconciliationRequest {
  trustAccountId: string;
  statementEndDate: string;
  statementEndBalance: string;
  preparedByName: string;
}

/** Transaction response per CON-002 §3.1. */
export interface TransactionResponse {
  entryId: string;
  trustAccountBalance: string;
  clientLedgerBalance: string;
  createdAt: string;
}

/** Transfer response per CON-002 §3.3. */
export interface TransferResponse {
  entryId: string;
  fromLedgerBalance: string;
  toLedgerBalance: string;
  createdAt: string;
}

/** Void response per CON-002 §3.5. */
export interface VoidResponse {
  voidEntryId: string;
  originalEntryId: string;
  trustAccountBalance: string;
  clientLedgerBalance: string;
  voidedAt: string;
}

/** Import response per CON-002 §5.1. */
export interface ImportResponse {
  imported: number;
  duplicatesSkipped: number;
  statementId: string;
}

/** Reconciliation response per CON-002 §5.2. */
export interface ReconciliationResponse {
  reconciliationId: string;
  status: "balanced" | "unbalanced";
  bankBalance: string;
  bookBalance: string;
  variance: string;
  unmatchedBankTransactions: number;
  unmatchedBookEntries: number;
}
