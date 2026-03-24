import { CircuitBreaker } from "./circuit-breaker";
import { logger } from "@/lib/logger";
import type {
  TrustAccount, ClientLedger, JournalEntry, ThreeWayReport, PaginatedResponse,
  CreateAccountRequest, CreateLedgerRequest, DepositRequest, DisburseRequest,
  TransferRequest, FeeTransferRequest, VoidRequest, ImportStatementRequest,
  StartReconciliationRequest, TransactionResponse, TransferResponse, VoidResponse,
  ImportResponse, ReconciliationResponse, TrustErrorResponse,
} from "./types";

export type { TrustAccount, ClientLedger, JournalEntry, ThreeWayReport, PaginatedResponse };
export { CircuitBreakerError } from "./circuit-breaker";

/** Trust service HTTP client per CON-001 §3. */
export class TrustClient {
  private readonly baseUrl: string;
  private readonly serviceKey: string;
  private readonly breaker: CircuitBreaker;

  constructor(baseUrl?: string, serviceKey?: string) {
    this.baseUrl = baseUrl ?? process.env.TRUST_SERVICE_URL ?? "http://localhost:4000";
    this.serviceKey = serviceKey ?? process.env.INTERNAL_SERVICE_KEY ?? "";
    this.breaker = new CircuitBreaker();
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    return this.breaker.execute(async () => {
      const url = `${this.baseUrl}${path}`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Internal-Service-Key": this.serviceKey,
      };
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const err = await res.json() as TrustErrorResponse;
        logger.warn({ path, status: res.status, code: err.error?.code }, "trust.client.error");
        const e = new Error(err.error?.message ?? "Trust service error");
        Object.assign(e, { code: err.error?.code, status: res.status });
        throw e;
      }
      return res.json() as Promise<T>;
    });
  }

  /** Create a trust account. CON-002 §2.1. */
  async createAccount(data: CreateAccountRequest): Promise<TrustAccount> {
    return this.request("POST", "/api/trust/accounts", data);
  }

  /** List all trust accounts. CON-002 §2.2. */
  async listAccounts(): Promise<{ data: TrustAccount[] }> {
    return this.request("GET", "/api/trust/accounts");
  }

  /** Get a single trust account. CON-002 §2.3. */
  async getAccount(id: string): Promise<TrustAccount> {
    return this.request("GET", `/api/trust/accounts/${id}`);
  }

  /** Create a client ledger. CON-002 §2.4. */
  async createLedger(accountId: string, data: CreateLedgerRequest): Promise<ClientLedger> {
    return this.request("POST", `/api/trust/accounts/${accountId}/ledgers`, data);
  }

  /** List ledgers for an account. CON-002 §2.5. */
  async listLedgers(accountId: string): Promise<{ data: ClientLedger[] }> {
    return this.request("GET", `/api/trust/accounts/${accountId}/ledgers`);
  }

  /** Record a deposit. CON-002 §3.1. */
  async recordDeposit(data: DepositRequest): Promise<TransactionResponse> {
    return this.request("POST", "/api/trust/transactions/deposit", data);
  }

  /** Record a disbursement. CON-002 §3.2. */
  async recordDisbursement(data: DisburseRequest): Promise<TransactionResponse> {
    return this.request("POST", "/api/trust/transactions/disburse", data);
  }

  /** Record a transfer. CON-002 §3.3. */
  async recordTransfer(data: TransferRequest): Promise<TransferResponse> {
    return this.request("POST", "/api/trust/transactions/transfer", data);
  }

  /** Record a fee transfer. CON-002 §3.4. */
  async recordFeeTransfer(data: FeeTransferRequest): Promise<TransactionResponse> {
    return this.request("POST", "/api/trust/transactions/fee-transfer", data);
  }

  /** Void a journal entry. CON-002 §3.5. */
  async voidEntry(entryId: string, data: VoidRequest): Promise<VoidResponse> {
    return this.request("POST", `/api/trust/transactions/${entryId}/void`, data);
  }

  /** List transactions for a ledger. CON-002 §4.1. */
  async listTransactions(ledgerId: string, params?: { page?: number; pageSize?: number; startDate?: string; endDate?: string }): Promise<PaginatedResponse<JournalEntry>> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
    if (params?.startDate) qs.set("startDate", params.startDate);
    if (params?.endDate) qs.set("endDate", params.endDate);
    const query = qs.toString();
    return this.request("GET", `/api/trust/ledgers/${ledgerId}/transactions${query ? `?${query}` : ""}`);
  }

  /** Get a single transaction. CON-002 §4.2. */
  async getTransaction(id: string): Promise<JournalEntry> {
    return this.request("GET", `/api/trust/transactions/${id}`);
  }

  /** Import a bank statement. CON-002 §5.1. */
  async importBankStatement(data: ImportStatementRequest): Promise<ImportResponse> {
    return this.request("POST", "/api/trust/bank-statements/import", data);
  }

  /** Start reconciliation. CON-002 §5.2. */
  async startReconciliation(data: StartReconciliationRequest): Promise<ReconciliationResponse> {
    return this.request("POST", "/api/trust/reconciliation", data);
  }

  /** Get reconciliation details. CON-002 §5.3. */
  async getReconciliation(id: string): Promise<ReconciliationResponse> {
    return this.request("GET", `/api/trust/reconciliation/${id}`);
  }

  /** Get three-way report. CON-002 §5.4. */
  async getThreeWayReport(accountId: string): Promise<ThreeWayReport> {
    return this.request("GET", `/api/trust/accounts/${accountId}/three-way-report`);
  }
}

/** Singleton trust client instance. */
export const trustClient = new TrustClient();
